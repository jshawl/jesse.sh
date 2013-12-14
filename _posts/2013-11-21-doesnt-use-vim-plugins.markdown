---
layout: post
title: "Pluginless"
published: false
---

I've finally done it. There are no plugins in my `~/.vim` directory, and no references to plugin managers in my `~/.vimrc`.

I feel like I finally 'get' Vim. It's the same setup on every server. 

When I began using Vim, I often googled looking for plugins that would make my text editing a bit easier. I thoughtlessly copied
several plugins into my ~/.vim/plugins/ directory and pasted lines of this weird vim-scripty thing into my .vimrc looking for solutions
to where Vim fell short. 

Don't do that. 

Start with totally blank ~/.vimrc. If you're going to add a setting or a key remapping, leave a comment on the same line that explains 
what the line does.

While at first it may seem impossible to live without NerdTree or Ctrl-p,
the following tips have helped me become efficient with any vim install. It means
that my vim setup is nearly the same on every server. The only additions I've made
to my ~/.vimrc are conveniences, but don't have wild remappings that would confuse 
me while using vim without that .vimrc.

Opening any project starts with

    $ cd /path/to/project/
    $ vim .

This opens up Vim with the current working directory set to the project's path.
To view all files in this directory, type `:Ex`. This will open up a directory
listing that is navigatable via the `h`,`j`,`k`, and `l` keys:

    " ============================================================================
    " Netrw Directory Listing                                        (netrw v140)
    "   /Users/jesseshawl/Sites/jesse.sh
    "   Sorted by      name
    "   Sort sequence: [\/]$,\<core\%(\.\d\+\)\=\>,\.h$,\.c$,\.cpp$,*,\.o$,\.obj$,\.info$,\.swp$,\.bak$,\~$
    "   Quick Help: <F1>:help  -:go up dir  D:delete  R:rename  s:sort-by  x:exec
    " ============================================================================
    ../
    .git/
    .sass-cache/
    _layouts/
    _posts/
    _site/
    awl/
    css/
    font/
    img/
    scss/

To open an existing file in a split window:

    :sp filename.ext

Or to open an existing file in a vertically split window:

    :vsp filename.ext

I like to keep similar files in separate windows, but all within the same tab. I
often have vertically and horizontally split windows containing the scss files
I'm working on at any given time. 

To move between windows in one tab, type `<C-w>` and then the direction (`hjkl`)
of the window you'd like to focus on.

To open a new tab,

    :tabe filename.ext

This opens a new tab with the supplied filename loaded into the buffer.


