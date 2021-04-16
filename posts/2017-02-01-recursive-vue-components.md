---
layout: layouts/post.njk
title: Recursive Vue Components
---

In this post, I'll walk through my process of creating a recursive Vue.js component, that is, a component
which can render itself.

[Demo](https://jshawl.github.io/recursive-vue-component/)  
[Completed Code](https://github.com/jshawl/recursive-vue-component/blob/gh-pages/index.html)


### Wait, What? Why?!

I recently had a need for building a custom file-browser, which allowed users to click through any number of folders
and files stored on their Dropbox account.

A directory listing is a classic example of recursion.

Imagine the following output of the `tree` command (a fancier, more gui-y `ls`):

```
.
├── dir1/
│   ├── fileA
│   ├── fileB
│   └── fileC
├── dir2/
├── dir3/
└── file1
```

If I can solve the problem of listing the highest-up directory:

```
.
├── dir1/
├── dir2/
├── dir3/
└── file1
```

then I will have solved the problem of listing any child directory as well:

```
.
├── fileA
├── fileB
└── fileC
```

To reuse a solution, I'll need to use the same bit of code, a Vue component.

### Getting Set Up ([acd19c5](https://github.com/jshawl/recursive-vue-component/commit/acd19c5))

Here's all the code you'll need to get started writing your first Vue component:

```html
<!doctype html>
<html>
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.1.10/vue.min.js"></script>
  </head>
  <body>
    <div id='app'></div>
    <script>
      new Vue({
        el: '#app'
      })
    </script>
  </body>
</html>
```

### Define a Tree Component ([88346c5](https://github.com/jshawl/recursive-vue-component/commit/88346c5))

First, a simple hello world template to make sure everything's working:

```html
<div id='app'>
  <tree></tree>
</div>
<script type='x-template' id='tree'>
  <div>
    Hello
  </div>
</script>
```

#### Notes

- The `script` tag must have a `type` other than `text/javascript`. Try removing
   the type attribute, and you'll see why you need it. Without `x-template`, the browser
   will attempt to execute the content inside the tags as Javascript.
- The template contents (everything inside the template script tag) must contain
   __one and only one__ root element. One element is ok. Two elements are _not_ ok. Zero elements are _not_ ok.


```js
Vue.component('tree',{
  template: '#tree'
})
```

#### Notes

- You must define a component before the `new Vue({...`

### Mix in some data ([4a6e34a](https://github.com/jshawl/recursive-vue-component/commit/4a6e34a))

Without a data method present, our Vue component method is pretty useless.

```js
let files = [
  {tag: 'folder', name: 'dir1'},
  {tag: 'folder', name: 'dir2'},
  {tag: 'file', name: 'file1'}
]
```

Add the data to the `tree` component:

```js
Vue.component('tree',{
  template: '#tree',
  data(){
    return {
      files
    }
  }
})
```

And try printing out that data from within the template:

```html
<script type='x-template' id='tree'>
  <div>
    {%raw%}{{files}}{%endraw%}
  </div>
</script>
```

It's not pretty.... yet, but even a few directives can meaningfully display the top-level directory
specified in `files`.

```html
<script type='x-template' id='tree'>
  <div>
    <div v-for="file in files">
      {%raw%}{{file.name}}{%endraw%}<span v-if="file.tag == 'folder'">/</span>
    </div>
  </div>
</script>
```

### Handling Click Events ([022a9fc](https://github.com/jshawl/recursive-vue-component/commit/022a9fc))

In order to expand a folder, we can add event listeners to a particular element using the
`v-on:click` directive:

```html
<div v-for="file in files">
  <div v-if="file.tag == 'folder'" v-on:click='toggleExpand()'>
    {%raw%}{{file.name}}{%endraw%}
  </div>
  <div v-else>
    {%raw%}{{file.name}}{%endraw%}
  </div>
</div>
```

Attempting to click on one of the folders will throw a `ReferenceError` about the function
not being defined.

Define it in the component:

```js
Vue.component('tree',{
  template: '#tree',
  methods: {
    toggleExpand: function(){
      console.log('togglin!')
    }
  },
  data(){
    //...
  }})
```

Rather than just log to the console, it'd be nice if a property on each of the folders were toggled, to visually represent whether or not
a folder should be expanded to review its children.

Unfortunately, it's impossible to toggle properties on each individual file
without a component for each folder.

### Adding a `<folder/>` component ([9b4bc33](https://github.com/jshawl/recursive-vue-component/commit/9b4bc33))

#### Modify the existing template

Instead of printing a div for folder entries:

```html
<div v-for="file in files">
  <div v-if="file.tag == 'folder'" v-on:click='toggleExpand()'>
    {%raw%}{{file.name}}{%endraw%}/
  </div>
  <div v-else>
    {%raw%}{{file.name}}{%endraw%}
  </div>
</div>
```

We'll print a component instance:

```html
<div v-for="file in files">
  <folder v-if="file.tag == 'folder'"></folder>
  <div v-else>
    {%raw%}{{file.name}}{%endraw%}
  </div>
</div>
```

#### Create a template for the folder component

```html
<script type="x-template" id='folder'>
  <div v-on:click="toggleExpand()">
    folder here
  </div>
</script>
```

#### Define a new component

```js
Vue.component('folder',{
  template: '#folder',
  methods: {
    toggleExpand: function(){
      console.log('togglin!')
    }
  },
})
```

__Note:__ I've removed the `methods` property from the `tree` component, and placed it in the new `folder` component.

#### Pass the folder name into the component as an attribute

```html
<folder v-if="file.tag == 'folder'" :file='file'></folder>
```

In order to access the `file` object passed in as an attribute, we need
to add a `props` attribute onto the component definition:

```js
Vue.component('folder',{
  template: '#folder',
  props: ['file'],
  methods: {
    toggleExpand: function(){
      console.log('togglin!')
    }
  }
})
```

And print it out in the template:

```html
<script type="x-template" id='folder'>
  <div v-on:click="toggleExpand()">
    {%raw%}{{file.name}}{%endraw%}/
  </div>
</script>
```

### Toggle the open state ([8d5fcf9](https://github.com/jshawl/recursive-vue-component/commit/8d5fcf9))

In order to toggle whether a folder displays its children or not, let's add the `data`
method to the `folder` component, and initialize it to false:

```js
Vue.component('folder',{
  template: '#folder',
  props: ['file'],
  methods: {
    toggleExpand: function(){
      console.log('togglin!')
    }
  },
  data: function(){
    return {
      isOpen: false
    }
  }
})
```

Modify `toggleExpand()` to flip that value:

```js
toggleExpand: function(){
  this.isOpen = !this.isOpen
}
```

and display the value of `isOpen` inside the template:

```html
<script type="x-template" id='folder'>
  <div v-on:click="toggleExpand()">
    {%raw%}{{file.name}}{%endraw%}/
    <span v-if='isOpen'>show children</span>
  </div>
</script>
```

### Displaying folder contents ([4134c5a](https://github.com/jshawl/recursive-vue-component/commit/4134c5a))

In order to display a folder's contents, let's first modify the `files` array
to have files inside of folders:

```js
let files = [
  {tag: 'folder', name: 'dir1', files: [
    {tag: 'file', name: 'fileA'},
    {tag: 'file', name: 'fileB'}
  ]},
  {tag: 'folder', name: 'dir2'},
  {tag: 'file', name: 'file1'}
]
```

Next, modify the template to display the child files (reusing the `tree` component)
if the given file has a truthy `files` attribute _and_ the `isOpen` value is true:

```html
<script type="x-template" id='folder'>
  <div>
    <div v-on:click="toggleExpand()">
      {%raw%}{{file.name}}{%endraw%}/
    </div>
    <tree v-if='isOpen && file.files'></tree>
  </div>
</script>
```

Lastly, we need to give the `tree` component a set of files to display, as it currently
will continue displaying the top node of the `files` array. We can accomplish this
with an attribute on the tree component:

```html
<script type="x-template" id='folder'>
  <div>
    <div v-on:click="toggleExpand()">
      {%raw%}{{file.name}}{%endraw%}/
    </div>
    <tree v-if='isOpen && file.files' :children='file.files'></tree>
  </div>
</script>
```

and add the `props` attribute onto the `tree` component definition:

```js
Vue.component('tree',{
  template: '#tree',
  props: ['children']
  data(){
    return {
      files: this.children || files
    }
  }
})
```

### Bells and whistles

The rest is a little CSS and a few more levels of files and folders.

[Demo](https://jshawl.github.io/recursive-vue-component/)  
[Completed Code](https://github.com/jshawl/recursive-vue-component/blob/gh-pages/index.html)
