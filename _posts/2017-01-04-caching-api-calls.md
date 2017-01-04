---
layout: post
---

I recently made a few upgrades to [updog.co](https://updog.co/) which have decreased the Time To First Byte
dramatically.

## Before:

![](https://dl.dropbox.com/s/e0xz24r8a6chozo/Screenshot%202017-01-04%2005.30.49.png?dl=0)

## After:

![](https://dl.dropbox.com/s/m2onzm5puvw0n7p/Screenshot%202017-01-04%2005.39.47.png?dl=0)

## Wait, What?! How?!

Updog uses memcached as its cache store, and requests to the Dropbox API were cached for 5
seconds to avoid exceeding Dropbox's API rate limits.

Here's some pseudo-ruby code:

```rb
Rails.cache.fetch(the_content, expires_in: 5.seconds) do
  # If nothing found in the cache execute the following line
  # and write to the cache
  get_from_api the_content
end
```

This meant that even if a site went viral on updog.co, requests for any particular URI would
never exceed more than 1 API call every 5 seconds, which is well within Dropbox's limits.

Imagine another type of user whose site is only looked at every couple of days. Because the cache is
only held for 5 seconds, this user's content would have to be looked up from the Dropbox API on
nearly every load:

```
User -> updog.co -> Dropbox API -> updog.co -> User
```

What I really wanted was a way to move the Dropbox API call to the background, so
that the user never has to wait on the response from Dropbox:

```
       Dropbox API
        \      /
User -> updog.co -> User
```

The solution was to cache the response from the Dropbox API forever.

On every inbound request to updog.co, check the site's last modified time. If more than
5 seconds have elapsed since the last update, fetch the content again from the Dropbox
API in the background:

```rb
Rails.cache.fetch(the_content) do
  # If nothing found in the cache execute the following line
  # and write to the cache
  get_from_api the_content
end
if site_not_updated_in_last_5_seconds
  get_from_api_in_background the_content
  and_then_modify_the_update_time
end
```

I was able to handle the background processing with [sidekiq](https://github.com/mperham/sidekiq)

Here's the caching code in total

The caching code in total is available [on GitHub](https://github.com/jshawl/updog/blob/0a829523544ed3db32d036c9bbd7ea5ce2694a21/app/models/site.rb#L73-L78)
