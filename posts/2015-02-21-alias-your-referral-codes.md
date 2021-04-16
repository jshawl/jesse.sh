---
layout: layouts/post.njk
title: Alias Your Referral Codes
---

When recommending any new service like Dropbox or DigitalOcean,
I send my referral codes to the potential customer in hopes that
they’ll sign up, and my account will be credited accordingly.

Instead of having to look up these referral codes for each of these
interactions, I’ve created a few nginx aliases to make the links
easier to share.

In my domain’s nginx configuration file, I’ve added:

```bash
# /etc/nginx/sites-enabled/jshawl.com

server {
  listen 80;
  server_name jshawl.com;

  location /do {
    rewrite ^/do?$ https://www.digitalocean.com/?refcode=01b24a40b88f permanent;  
  }

  location /db {
    rewrite ^/db?$ https://db.tt/y3JvNpU permanent;  
  }
}
```

You can also alias fequently used urls like the jQuery cdn:

```bash
location /jq {
  rewrite ^/jq?$ https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js permanent;
}
```

The above url will even work in a script tag:

```html
<script src='http://jshawl.com/jq' type='text/javascript'></script>
```

I can now share [jshawl.com/do](http://jshawl.com/do), [jshawl.com/db](http://jshawl.com/db), and [jshawl.com/jq](http://jshawl.com/jq)
without having to lookup the actual urls.