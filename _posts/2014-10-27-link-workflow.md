---
layout: post
---

I've recently removed the `/finds-links` url from my site, which was a jQuery plugin powered by pocket.

This project, "The Q" has come back to life as a rails application that lets users expose links saved in
their Pocket account. Check it out at <http://the--q.herokuapp.com/>. I might bring back the `/finds-links` page
by collecting [JSON from The Q](http://the--q.herokuapp.com/jshawl/css.json).

I wanted to share / document my workflow for finding and saving links.

Currently, most everything goes through Pocket.

I use Feedly and Twitter as my main sources of link-based news, and both of these applications
offer a "Save to Pocket" one-click solution.

But, I've become a full-time pinboard user as of late! <https://pinboard.in/u:jshawl> It's worth way more
than the initial one-time sign up fee of ~$10, and I recommend Pinboard without hesitation. Heck, I even
went for the archival account! (an additional $25 per year).

>Are you on pinboard? If so let me know!

To facilitate adding links to pinboard, I've set up an IFTTT recipe that saves all new Pocket items
to Pinboard and marks them "to read", Pinboard's version of Pocket's "read later".

Anything that I actually want to read later, or even just look at again for tagging purposes goes into
my Pinboard [unread feed](https://pinboard.in/u:jshawl/unread/).

I'm a bit worried now about saving too many links. That is, I don't want to have so many that I'm no longer able
to find just the link I was looking for. However, Pinboard's full text search feature has worked for me thus far
and so I'll continue saving just about everything I come across.

In the future, I'd like to allow others to write to my pinboard account and/or set up a JSON endpoint for my favorited
items to display on my site. Think a smaller curated list for my site without the user having to visit pinboard.