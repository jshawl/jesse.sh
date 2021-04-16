---
layout: layouts/post.njk

title: "Faster Indenting with Vim"
---

One of the best features of Vim is its ability to effortlessly remap keys. It gives me 100% control over hotkeys that drastically increase my productivity.

When I started out using Vim, I often caved and opened up Sublime Text when I needed to do some heavy code formatting. Indenting seemed unintuitive and frankly, a pain to use at first.

I've added these remappings to my ~/.vimrc, which lets me indent faster than I ever could with Sublime:

```bash
noremap > >>
noremap < <<
vnoremap > >gv
vnoremap < <gv
```

The first two are key mappings in normal mode. I'm able to type a single `>` or `<` to indent or unindent a line respectively.

The second two are mappings for indenting while in visual mode. The `gv` reselects the last visual selection, which lets me indent a block of code without leaving visual mode. 

By default, Vim will exit visual mode after an indenting operation occurs. This is silly. I'd rather be able to indent as much as I like while in Visual mode, and then `esc` when I'm done formatting.

<img src='/img/indenting.gif' style='max-width:100%;'>

<br style='clear:both;'>

### Update

If you're working with a single file type, say HTML or CSS, you can type `gg=G` to auto indent the entire file. Unfortunately, I do a lot of work with inline PHP (er.. WordPress), and auto indenting the entire file will either screw up your PHP or your HTML, depending on what you've set your filetype to with `:set filetype=`. 

Until there's a better way to auto format a file with more than one language inside, I've found the easiest way to keep my code clean is with the remappings above. Do you know of a better way? Let me know! Thanks to <a href="https://twitter.com/mrmrs_">@mrmrs_</a> for the auto indenting file tip!
