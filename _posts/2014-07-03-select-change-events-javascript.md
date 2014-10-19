---
layout: post
title: Dropdown change events and selectedIndex
---

Today I learned how to listen to `<select>` change events, and store
the selected option in plain-jane javascript:

<p data-height="268" data-theme-id="788" data-slug-hash="phLAj" data-default-tab="js" class='codepen'>See the Pen <a href='http://codepen.io/jshawl/pen/phLAj/'>phLAj</a> by Jesse Shawl (<a href='http://codepen.io/jshawl'>@jshawl</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//codepen.io/assets/embed/ei.js"></script>

I had never heard of the `selectedIndex` method, so I checked out the documentation on the [mozilla developer network](https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XUL/Property/selectedIndex).

I'm not sure this is super useful outside the context of dropdown menus, but it's a heck of a lot easier
than looking for `selected` attributes and removing them, which can be a pain to manage.

Instead, you can just set `selectNode.selectedIndex` to `-1`, which will deselect all options.
