---
title: Dual Range Input
---

I recently had a need for an `<input type='range'>` with start and end buttons, so I built one:

<p class="codepen" data-height="309" data-theme-id="light" data-default-tab="html,result" data-slug-hash="WNJjPRv" data-user="jshawl" style="height: 309px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/jshawl/pen/WNJjPRv">
  Dual Range Input Hello World</a> by Jesse Shawl (<a href="https://codepen.io/jshawl">@jshawl</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

[View on GitHub](https://github.com/jshawl/dual-range-input)
[View on npm](https://www.npmjs.com/package/dual-range-input)

I made a few API and design decisions that I wanted to think through 
here for the next npm package I might build.

## Design Decisions

### Functional UI From the Start

It is important to me that a broken/unloaded/javascript-less state
still functions as intended.

The hello world example (above) demonstrates how the package depends on two existing `<input type='range'>`s.

I'm curious about auto generating these inputs from JavaScript but for now
I'm happy with requiring the user to provide them. This has the added benefit of being able to attach event listeners to and modify the values of the underling `input`s with no conflict issues.

### Browser Native Module Support

Using ES Modules means not having to deal with a build system:

```html
<script type="module">
  import DualRangeInput from 'https://unpkg.com/dual-range-input@latest/script.js';
  DualRangeInput(".dual-range-1");
</script>
```

The source code _is_ the distributed code, which means I don't have to worry about compilation before distribution.

### Sane Default Behavior

The first action I implemented was making each slider "push" the other when
a particular minimum or maximum value was exceeded.

e.g. dragging the start past the end should also drag the end with it.

I also added in `:active` states to match the browser-native styles, and made
it so that the active button appears above the inactive button.

Lastly, I had started with always showing the values but realized this created problems when the start and end were very close together - the numbers would overlap! I decided to only show the value of the range during dragging, which in my humble opinion is an enhancement to how the browser-native range input should behave.

## API Decisions

### Default Export is a Function

The default export from the package is a function, which allows users to call
the library whatever they want:

```js
import customRange from 'https://unpkg.com/dual-range-input@latest/script.js'
```

but also binds each invocation to a particular UI element - the set of browser-native `input`s. 

### Dynamic Arguments

You can do

```js
DualRangeInput(".a-query-selector")
```

which is short for:

```js
DualRangeInput({selector: ".a-query-selector"})
```

I did this because I suspect most consumers will use the input without configuration.

### Inlined, Overridable CSS

I wanted to avoid asking consumers to add a `<link />` tag to import the custom styles required, and so I decided to just write the CSS inside the main script tag.

This has the added benefit (to me) of coupling the UI markup with the UI styles. That is, users don't
have control over the UI markup (yet), and so each new release can safely modify the markup and styles without worrying about breaking previous implementations.

## Looking Forward

I'm super curious about adding in a third button, like a gradient generator might have and am wondering if I've made a mistake by adding "dual" to the package name from the start.

Interested in contributing? Check it out [on GitHub](https://github.com/jshawl/dual-range-input).
