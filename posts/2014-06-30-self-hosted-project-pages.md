---
layout: layouts/post.njk

title: "Self hosted project pages"
---

Today I learned how to self-host gh-pages-esque project pages in an easy way
using an nginx alias.

I have my main domain: http://jshawl.com/ which lives in `/var/www/jshawl.com/`

I wanted to be able to `cd` into that directory, clone any new repos, and if
there is a gh-pages branch, serve it with the url as http://jshawl.com/project-name/.

Normally, this URL structure doesn't play nicely with jekyll sites, as jekyll
compiles the site to the `_site/` folder by default. The `index.html` file in
`/var/www/jshawl.com/project-name/` is the yaml-filled jekyll-ready index file, 
not the compiled file with all of my posts listed out.

Essentially, I wanted to set the document root of http://jshawl.com/project-name/ to `/var/www/jshawl.com/project-name/_site/`

Here's how I accomplished this task with an nginx alias:
```text
server {
    listen 80;
    root /var/www/jshawl.com;
    server_name jshawl.com;
    index index.html;

    location /project-name/ {
	    alias /var/www/jshawl.com/project-name/_site/;
    }
} 
```

In a later post, I'd like to explore the possibility of doing this automatically, perhaps
with a `try_files` directive.