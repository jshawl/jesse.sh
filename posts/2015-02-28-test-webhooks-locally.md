---
layout: layouts/post.njk

title: "Testing Webhooks Locally"
---

I recently built an application - [restful.link](http://restful.link)
in order to inspect the data that was sent as a webhook, like information
about about any new pull request on GitHub.

I had to keep manually opening pull requests on github.com anytime I wanted to
process the data that was posted. This was time consuming, so I implemented
a new feature which allows users to proxy new requests and resend existing
requests to a local server.

Here’s how you can start testing webhooks locally, using GitHub as an example:

## Create a Restful Link

Visit [restful.link](http://restful.link) and create a new link.

![](/img/create-link.gif)

## Set up a Webhook

Visit the repository you’d like to listen on for events, and add the
URL that was just generated.

![](/img/add-webhook.png)

If you revisit the restful link you created, you’ll see that GitHub
sent a test event.

## Enable Proxy to Localhost

Click on the Proxy to localhost checkbox, specify the port that
your local server is running on, and test out the connection.

![](/img/proxy-new.gif)

Be sure to enable cross origin resource sharing (from restful.link to localhost)
or you’ll get a "Connection refused" error even if your server is running
at the specified port.

## Create a new Pull Request

Really, we just need to do anything that will trigger the configured webhook.

New requests will be sent to restful.link and automatically updated
in your browser, as well as sent to your local server.

## Resend requests

If you’d like to resend any one request to your local server, click the "Resend to localhost"
link.

![](/img/proxy-resend.gif)





