---
layout: post
title:  "From Floats to Flexbox"
published: false
---

Flexbox is ready. Even [caniuse thinks so](http://caniuse.com/flexbox). At a whopping 35%, you likely won't be using Flexbox in production environments until browser versions are a thing of the past.<!-- more --> But it's ready for me.

I've begun working on a small-ish micro site that's meant to be a reference for web developers. shh.. it's not quite ready. Since the target audience will be front end developers, I've decided to completely abandon floats and use flexbox for positioning elements on the page. This will be a place for me to take notes on what was confusing and how I found the answer I was looking for.

<h2 id='#'>Getting Started</h2>
Cross browser flexbox support has become somewhat of a CSS nightmare. If you're super concerned about the nitty gritty of which vendor prefixes to use and whether new or old Flexbox syntax will work for you, I recommend these articles:

1. [Advanced Cross Browser Flexbox](http://dev.opera.com/articles/view/advanced-cross-browser-flexbox/)
2. [Mixing Old and New for the Best Browser Support](http://css-tricks.com/using-flexbox/)

I'd rather not do the dirty work of dealing with vendor prefixes, so I've added [Autoprefixer](https://github.com/ai/autoprefixer) to my workflow. I'm using Grunt to watch Scss files, compile them, and automatically add vendor prefixes. [View the gruntfile](https://github.com/jshawl/open-source-workflow/blob/master/css/Gruntfile.js). 