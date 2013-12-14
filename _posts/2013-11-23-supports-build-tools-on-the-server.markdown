---
layout: post
title: "A Case for Build Tools on the Server"
---

Any modern web development workflow involves the use of build tools like Grunt and Sass or Compass. (Definitely not Less)

If a company runs an enterprise-y amount of production web servers, it might be difficult to manually update each one with the same software. Fortunately, that's not a viable option.

In 2013, we use load balancers and highly available clusters to distribute traffic among nodes serving up web stuff. It's quite straightforward, actually. There's often one node who's only job is to distribute inbound traffic amongst its peers. These peers are mirrors of one another. They are identical in every way, save for their ip address.

Consolidate your servers.

Have a dedicated node for each stack:

PHP, Rails, Node, Python.

Each of these servers has one job to do.

Configure a proxy server. Let all inbound

Cache all the things.

Not everybody knows how to use these tools, let alone have them installed on their local development environment.
Without installing these build tools on a production server, we're giving future code editors the opportunity to
edit built css or javascript. If this happens, the codebase will have diverged, and it will be near impossible to retroactively add the sprinkled on code to prebuild Sass or JavaScript files. 

Let's assume there are no build tools on the server. What are our options for deploying minified and linted code to production servers? 

**Q: Check the processed code into source control?**

A: No. Please don't do that. 

If you track minified and processed code into source control, every commit will be littered with redundant
and meaningless information. The only thing git can tell me is that there was a change on line 1 of (.*)\.min\.(css|js).

What I really care about is where the change was made in my js or scss file.

**Q: Rsync built files to the production server? **

A: Better but not ideal.

This seems like a recipe for failure. What build tools did you use to process those files? What version of that build tool did you use? Did you document it for a future developer? What if you forget to update the documentation?

We need an authoritative source for what's being used and how it's working. 


