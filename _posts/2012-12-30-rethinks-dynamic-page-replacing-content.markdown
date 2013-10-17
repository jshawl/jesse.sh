---
layout: post
title: Rethinking Dynamic Page Replacing Content
date: December 30, 2012
--- 

In May of 2012, Chris updated a previous post about [dynamic page replacing content](http://css-tricks.com/dynamic-page-replacing-content/). This article is an update to that update, which uses the HTML5 history API for a better user experience.

Here's a quick recap of the best practices:

1. Works fine with JavaScript disabled.
2. It is possible to "deep link" to specific content. 
3. The browsers back button and forward button work as expected.

## The problem with URL hashes

For one individual user, the [existing demo](http://css-tricks.com/examples/DynamicPage/) meets the criteria just fine, but URL's are permanent addresses, and they're going to be shared. 

Consider the following scenario:

1. I've got a fancy browser with Javascript enabled. I'm browsing the demo site, and I find a great product I'd like to share with a friend.

2. I copy the url 'http://example.com/#awesome-product', and send it to my friend.

3. My friend doesn't have javascript enabled. (S)he opens the link in her browser, and is confused that the awesome product doesn't load as expected.

4. (S)he gets confused/frustrated and swears never to visit example.com again.

THIS IS BAD UX!!

Today, we'll be improving the existing demo such that the dynamic page replacing content needn't rely on the hash. 

[demo](http://sudojesse.github.com/dynamic-page/)
[download files](https://github.com/sudojesse/dynamic-page/archive/master.zip)

## Modernizr for progressive enhancement

*Note: The following examples build upon the previous demo. Download the files [here](http://css-tricks.com/examples/DynamicPage.zip) to follow along.*

If you're not using [Modernizr](http://modernizr.com/) yet, go get it (I'll wait). It's the easiest way to detect browser features with javascript. 

Since we'll be playing with the HTML5 history api, we only need to check the 'History' checkbox. Download the custom build [here](https://raw.github.com/sudojesse/dynamic-page/master/js/modernizr.js).

Include it in the <code>&lt;head&gt;</code> of our html file:
	
{% highlight html %}
<script type='text/javascript' src='js/modernizr.js'></script>
{% endhighlight %}

Testing for HTML5 history support is super easy:
{% highlight javascript %}
// dynamicpage.js

$(function(){
	if(Modernizr.history){
		//history is supported; do magical things
	} else {
		//history is not supported; nothing fancy here
	}
});
{% endhighlight %}

First, we're going to set up everything to manipulate the browser's history, and then we'll add all the fancy loading provided from the previous demo.

## Manipulate the history with HTML5 history API

The HTML5 history.pushState() method  allows us to: 

1. Change the URL
	* without a hash
	* without a page refresh (this is where the dynamic page replacing content happens)
2. Update the browser's history stack
	* so we can navigate through the history with back and forward button clicks.

The pushState() method takes three parameters:
{% highlight js %} 
history.pushState(stateObject, 'title', URL);
{% endhighlight %}   

We're only going to be supplying the URL in this example, but you can learn more about the history API over at the [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/DOM/Manipulating_the_browser_history).

After changing the URL, we'll want to set up a function to load the content - loadContent() seems like a good name.

{% highlight js %}
$(function(){
	if(Modernizr.history){
		//history is supported; do magical things
		
		//hijack the nav click event
		$('nav').delegate('a', 'click', function(){
			_href = $(this).attr('href');
			
			// change the url without a page refresh and add a history entry.
			history.pushState(null, null, _href);
			
			// load the content
			loadContent(_href); // fear not! we're going to build this function in the next code block
			
		});
	} else {
		//history is not supported; nothing fancy here
	}
});
{% endhighlight %}

And now, we just need to code up the loadContent() function, which is a matter of taking code from the original example.

Code dump!

{% highlight js %}
// set up some variables
var $mainContent = $("#main-content"),
    $pageWrap    = $("#page-wrap"),
    baseHeight   = 0,
    $el;

// calculate wrapper heights to prevent jumping when loading new content
$pageWrap.height($pageWrap.height());
baseHeight = $pageWrap.height() - $mainContent.height();

function loadContent(href){
        $mainContent
                .find("#guts")
                .fadeOut(200, function() { // fade out the content of the current page
                    $mainContent.hide().load(href + " #guts", function() { // load the contents of whatever href is
                        $mainContent.fadeIn(200, function() {
                            $pageWrap.animate({
                                height: baseHeight + $mainContent.height() + "px"
                            });
                        });
                        $("nav a").removeClass("current");
                        console.log(href);
                        $("nav a[href$="+href+"]").addClass("current");
                    });
                });
    }
{% endhighlight %} 

## Handle browser back and forward button clicks

At this point, content is loaded in a fancy ajaxy way, but clicking on your back button won't take us back... yet.
The history API gives us access to the 'popstate' event, which fires everytime the history stack changes (read: back and/or forward buttons are clicked.) Anytime this event fires, we just need to call our loadContent() function:

{% highlight js %}
$(window).bind('popstate', function(){   
	_link = location.pathname.replace(/^.*[\\\/]/, ''); //get filename only
	loadContent(_link);
});
{% endhighlight %}

## A little homework assignment

At the time of this writing, the popstate event happens on page load in Chrome. This means two requests are being made:

1. The original http request for whateverpage.html
2. The request made by $.load in our loadContent() function

There are a couple of different ways to handle this, but I'll let you decide which works best. 


