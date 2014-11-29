---
layout: post
title: Async API Calls with Pagination
---

I recently created a landing page for my [jshawl.github.io](http://jshawl.github.io/) domain
and wanted to get all of my public repos from the github api.

At first, I considered writing a little ruby script, triggered by cron job that would
fetch all of my repos and save the output as a JSON file.

This would allow me to reuse an existing [codepen](http://codepen.io/jshawl/pen/fvAmk) to display
and filter all of my repos.

Instead, I thought I’d just use JavaScript&trade;

### Getting the first set of repos

{% highlight js %}
repos = [];
$.get('https://api.github.com/users/jshawl/repos', function( res ){
  repos.push( res );
});
console.log( repos );
{% endhighlight %}

This code won’t work. Because the ajax call is asynchronous, the `console.log( repos )` is
called before the callback. This is just a simple message to the console, but it’s important
to keep any render function outside of the ajax callback.

{% highlight js %}

function getRepos( url, repos, callback){
  $.get( url, function( res ){
    res.forEach( function( repo ){
      repos.push( repo )
    });
    callback();
  });
}

repos = [];
getRepos('https://api.github.com/users/jshawl/repos', repos, function(){
  console.log( repos );
}); 

{% endhighlight %}

Setting up a function and an anonymous callback ensures I can keep my render function outside of the ajax's callback.
This is important because I don't want to call the render method each time an http request is successfully made.

### Getting the next page

{% highlight js %}

function getRepos( url, repos, callback){
  $.get( url, function( res, textStatus, req ){
    res.forEach( function( repo ){
      repos.push( repo )
    });
    nextUrl = req.getAllResponseHeaders().match(/<(.*)>; rel="next"/);
    if( nextUrl ){
      getRepos( nextUrl[1], repos, callback );
    } else {
      callback();
    }
  });
}

repos = [];
getRepos('https://api.github.com/users/jshawl/repos', repos, function(){
  console.log( repos );
}); 

{% endhighlight %}


