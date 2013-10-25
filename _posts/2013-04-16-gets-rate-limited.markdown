---
layout: post
title:  "Dealing with Rate Limited APIs"

---
tl;dr: Access the API once an hour with a cron job, and let your $.getJSON make a call to the cached response.

I recently set up a [little something](/apis/#github) to pull in all of the repos that I've starred on Github. With a simple JSON call, I can pull that data in no problem. 

Unfortunately (well, this is actually a good thing), Github [limits](http://developer.github.com/v3/#rate-limiting) unauthenticated API access to 60 requests per hour. Sure, I could use an OAuth access token to query their API up to 5,000 times per hour, but this requires a little PHP/Backend-fu to set up.

Before, any time someone visited my /apis/ page, the JSON call would make the request to Github's API. [see the code](https://github.com/jshawl/jshawl-v3/blob/0d0ac608c215bacab8f766caf7cd88d6f6c5564c/templates/partials/github.html#L3)

What I want to do instead is setup a CRON job to get that JSON once per hour, save it as some file (github-data.json maybe?), and then make our JSON call reference the cached response. NOTE: I'm choosing once per hour, but you can make the call as often as you like (under 60 times per hour). That way, we'll never have to worry about exceeding our rate limit for unauthenticated API access.

First, let's write a shell script to grab that data and write it to a file:
<span data-lang='sh'></span>

    #!/bin/sh

    # grab the JSON from the github API and save it to a file named github.json
        curl https://api.github.com/users/jshawl/starred?type=public > /var/www/jshawl.com/github.json
        #oh snap! a one liner!

I named this file 'get-github-json.sh'. Since we're running this script from a CRON job, we should use absolute paths. Who knows where that file could end up!

Now we make it executable
<span data-lang='sh'></span>

    $ chmod +x ./get-github-json.sh

Test it out!
<span data-lang='sh'></span>

    $ ./get-github-json.sh

If it worked, you should see a new file called github.json. Cool! so the shell script is working. Now we just need to setup a cron job to run that script once per hour, every hour, every day, every month, every year.

    $ sudo crontab -e #you might not need sudo depending on your webserver's directory permissions.

I chose to use Vim as my crontab editor. Just add our crontab entry.

ProTip! Need help adding a new crontab? Check out this tool: [http://www.generateit.net/cron-job/index.php](http://www.generateit.net/cron-job/index.php)
<span data-lang='sh'></span>

    # execute /var/www/jshawl.com/get-github-json.sh once per hour
    # every day, every month, every year
    0 * * * * /var/www/jshawl.com/get-github-json.sh

This is really cool. Our /get-github-json.sh will access the Github API once per hour. The last thing we need to do is change our $.getJSON call to reference the cached copy anytime your webpage loads.
<span data-lang='lang-js'></span>

    $.getJSON('/github.json', function (result) {
            // do magical things with our result object.
    }

Here's what I did with it: [https://github.com/jshawl/jshawl-v3/blob/master/templates/partials/github.html#L3](https://github.com/jshawl/jshawl-v3/blob/master/templates/partials/github.html#L3)

In the event that more than 60 people look at my /apis/ page within one hour, I won't get a "Rate Limit Exceeded" error from Github.

Awesome.







