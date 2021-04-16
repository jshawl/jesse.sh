---
layout: layouts/post.njk

title: "Let's build a CRUD app with the Fetch API"
---

[View demo](https://jshawl.github.io/stopgap-demo/)
| [View code](https://github.com/jshawl/stopgap-demo/blob/c27a02b07af090b3497c27ab8c8539a9fe5d8490/index.html)

I recently built an application - [https://stopgap.store/](https://stopgap.store/) which is a simple way to get
up and running with an API with almost zero configuration.

In an effort to demo its capabilities, I thought I'd explore working with the [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) as well.

Fetch is an experimental technology!

![](/img/caniuse-fetch.png)

* TOC
{:toc}

## Initial Setup

We're gonna do this thing entirely in a single html file:

```html
<!doctype html>
<html>
  <head></head>
  <body>
    <form>
      <label for='todo'>Todo:</label>
      <input type='text' id='todo'>
    </form>
    <ul class='todos'></ul>
  </body>
</html>
```

And a little bit of JavaScript before the closing `</body>` tag:

```js
var form = document.querySelector('form')
var input = document.getElementById('todo')
var todos = document.querySelector('.todos')
```

### Setting up the API

In lieu of setting up a local API server to persist our data, or authenticating with a third
party provider like Firebase, we can generate a throw-away api at [https://stopgap.store/](https://stopgap.store/)

Click on "Create Project" and copy the URL:

![](/img/create-project.gif)

Add the url as a variable:

```js
var apiUrl = 'https://stopgap.store/48277/todos'
```

**Note:** You can add whatever resource name you like to the end of the url.
I decided to use "todos"

All together now!

```html
<!doctype html>
<html>
  <head></head>
  <body>
    <form>
      <label for='todo'>Todo:</label>
      <input type='text' id='todo'>
    </form>
    <ul class='todos'></ul>
    <script>
      var apiUrl = 'https://stopgap.store/48277/todos'
      var form = document.querySelector('form')
      var input = document.getElementById('todo')
      var todos = document.querySelector('.todos')
    </script>
  </body>
</html>
```

## Create

A good start would be `console.log`ging whatever's in the input
when the user submits the form:

```js
form.addEventListener("submit", create)
function create(event){
  event.preventDefault()
  console.log(input.value)
}
```

To create something on the server, we need to send a POST request, with a JSON
string of the content we want to send.

```js
function create(event){
  event.preventDefault()
  fetch(apiUrl,{
    method: 'POST',
    body: JSON.stringify({
      text: input.value
    })
  }).then(function(response){
    response.json().then(function(todo){
      console.log(todo)
    })
  })
}
```

But instead of logging to the console, we'll need to create a new `<li>` and
append it to the existing `<ul>`

```js
//...
    response.json().then(li)
  })
}
function li(todo){
  var l = document.createElement("li")
  l.innerHTML = todo.text
  todos.appendChild(l)
}
```

## Read

When the page loads, fetch all the todos from the server, and create `<li>`s for each of them.

```js
fetch(apiUrl + ".json").then(function(response){
  response.json().then(function(todos){
    todos.forEach(li)
  })
})
```

**Note**: the addition of ".json" is required here
because the apiUrl serves HTML as well.

## Update

An easy way to allow the user to edit inidividual todos would be to make each li `contenteditable`:

```js
function li(todo){
//...
  l.setAttribute("contenteditable", true)
```
and tell the server when the content is no longer being changed on the `blur` event:

```js
function li(todo){
//...
  l.setAttribute("contenteditable", true)
  l.setAttribute("data-id", todo.id)
  l.addEventListener("blur", update)
  todos.append(l)
}

function update(event){
  var id = event.target.getAttribute("data-id")
  fetch(apiUrl + "/" + id, {
    method: 'PATCH',
    body: JSON.stringify({
     text: event.target.innerText
    })
  }).then(function(response){
    response.json().then(function(todo){
      console.log(todo)
    })
  })
}
```

## Delete

For each list item, we can add a link to delete, though this will require
a small change or to to our `li()` function and `PATCH` request.

First, create a `<span>` child of the `<li>` and make that contenteditable.

```js
function li(todo){
  var l = document.createElement("li")
  var span = document.createElement("span")
  span.setAttribute("contenteditable", true)
  span.setAttribute("data-id", todo.id)
  span.innerHTML = todo.text
  span.addEventListener("blur", update)
  l.appendChild(span)
  todos.appendChild(l)
}
```

Then, create a link to delete:

```js
// in function li()
var a = document.createElement("a")
a.innerHTML = '&times;'
a.addEventListener("click", remove)
a.setAttribute("data-id", todo.id)
l.appendChild(a)
```

and the function to handle the removal:

```js
function remove(event){
  event.preventDefault()
  var id = event.target.getAttribute("data-id")
  fetch(apiUrl + "/" + id,{
    method: 'DELETE'
  }).then(function(){
    todos.removeChild(event.target.parentNode)
  })
}
```

Add a little css to space things out:

```css
span + a {
  display: inline-block;
  margin-left: 1em;
  cursor: pointer;
}
```

## Complete code

```html
<!doctype html>
<html>
  <head>
    <style>
      span + a {
	display: inline-block;
	margin-left: 1em;
	cursor: pointer;
      }
    </style>
  </head>
  <body>
    <form>
      <label for='todo'>Todo:</label>
      <input type='text' id='todo'>
    </form>
    <ul class='todos'></ul>
    <script>
      var apiUrl = 'https://stopgap.store/48277/todos'
      var form = document.querySelector('form')
      var input = document.getElementById('todo')
      var todos = document.querySelector('.todos')
      form.addEventListener("submit", create)
      function create(event){
	event.preventDefault()
	fetch(apiUrl,{
	  method: 'POST',
	  body: JSON.stringify({
	    text: input.value
	  })
	}).then(function(response){
	  response.json().then(li)
	})
      }
      function update(event){
	var id = event.target.getAttribute("data-id")
	fetch(apiUrl + "/" + id + ".json", {
	  method: 'PATCH',
	  body: JSON.stringify({
	   text: event.target.innerText
	  })
	}).then(function(response){
	  response.json().then(function(todo){
	    console.log(todo)
	  })
	})
      }
      function li(todo){
	var l = document.createElement("li")
	var span = document.createElement("span")
	span.setAttribute("contenteditable", true)
	span.setAttribute("data-id", todo.id)
	span.innerHTML = todo.text
	span.addEventListener("blur", update)
	l.appendChild(span)
	var a = document.createElement("a")
	a.innerHTML = '&times;'
	a.addEventListener("click", remove)
	a.setAttribute("data-id", todo.id)
	l.appendChild(a)
	todos.appendChild(l)
      }
      function remove(event){
	event.preventDefault()
	var id = event.target.getAttribute("data-id")
	fetch(apiUrl + "/" + id,{
	  method: 'DELETE'
	}).then(function(){
	  todos.removeChild(event.target.parentNode)
	})
      }
      fetch(apiUrl + ".json").then(function(response){
	response.json().then(function(todos){
	  todos.forEach(li)
	})
      })
    </script>
  </body>
</html>
```