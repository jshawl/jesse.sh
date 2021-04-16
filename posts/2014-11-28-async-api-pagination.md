---
layout: layouts/post.njk

title: Async API Calls with Pagination
---

I recently created a landing page for my [jshawl.github.io](http://jshawl.github.io/) domain
and wanted to get all of my public repos from the github api.

At first, I considered writing a little ruby script, triggered by cron job that would
fetch all of my repos and save the output as a JSON file.

This would allow me to reuse an existing [codepen](http://codepen.io/jshawl/pen/fvAmk) to display
and filter all of my repos.

Instead, I thought I’d just use JavaScript&trade;

### Thinking Async

```js
repos = [];
$.get('https://api.github.com/users/jshawl/repos', function( res ){
  repos.push( res );
});
console.log( repos ); // or render( repos );
```

This code won’t work as you might expect. Because the ajax call is asynchronous, the `console.log( repos )` is
called before the http request finishes its round trip. 

I've got two options:

1. Add the render logic to the ajax callback
  - hopefully, the pagination API calls will come back in the right order.
2. Create my own callback to call a render method after everything is retrieved

It will be easier to maintain this site and reuse parts of its code if I separate my
concerns and go with option 2. Also, using a callback means I'll be able to manipulate or sort
all of the data before rendering it on screen.

### Put a Callback on it

```js

function getRepos( url, repos, callback ){
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

```

Setting up a function and an anonymous callback ensures I can keep my render method outside of the ajax's callback.
This is important because I don't want to call the render method each time an http request is successfully made.
Ideally, I'd like to sort or filter the data before displaying the entire response.

### Getting the next page

Getting the next page is just a matter of looking in the headers for a link
with `rel="next"`. If one is found, recursively find the next set of repos. If one is
not found, call the callback to tell our first `getRepos()` call that all of the
requests have completed.

Notice I've added two optional arguments to `$.get`'s anonymous callback. `req` contains
the link for the next page.

```js

function getRepos( url, repos, callback ){
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

```


