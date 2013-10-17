---
layout: post
title:  "My Open Source Workflow [CSS]"
published: false
---

After reading [Andrey Sitnik's post on Autoprefixer](http://css-tricks.com/autoprefixer/), I knew I had to try out [Grunt.js](http://gruntjs.com/)<!-- more -->

I've done it all: Writing 'vanilla' CSS and adding vendor prefixes by hand, using [Compass](http://compass-style.org/) for its valuable mixins, using client-side tools like Lea Verou's [prefixfree.js](http://leaverou.github.io/prefixfree/). But nothing felt right.

I was spending too much time worrying about supporting my own browser (-webkit) instead of building kickass websites. I've finally found a workflow where I don't have to worry about these things. I'm a big fan of Sass, and wanted to find a setup where the CSS processing was managed by one tool. I'm sad to say goodbye to [CodeKit](https://incident57.com/codekit/) for now, but if you're getting started out with Sass and/or other prepocessors, I recommend the application without hesitation. So let's get to it!

### Oh Hey, Grunt!

Next step, we'll start a local Grunt project. If you don't already have Grunt.js installed, [check out the docs](http://gruntjs.com/getting-started). To install the Grunt command line interface, we just need to run in the terminal:

{% highlight bash %}
 $ npm install -g grunt-cli
{% endhighlight %}

Next, we'll get a local Grunt project started by adding a
####package.json
{% highlight javascript %}
{
  "name": "my-project-name",
  "version": "0.1.0",
  "devDependencies": {
    "grunt": "~0.4.1"
  }
}
{% endhighlight %}

and a basic 'hello world' Gruntfile.js just to make sure things are installed correctly.
####Gruntfile.js
{% highlight js %}
module.exports = function(grunt) {
  grunt.registerTask('default', 'just a basic hello world', function() {
    grunt.log.writeln('Grunt is installed and working!');
  });
};
{% endhighlight %}

At this point, you should be able to run

{% highlight bash %}
 $ grunt
{% endhighlight %}

and it will output 'Grunt is installed and working' in the console. View the code [on GitHub](https://github.com/jshawl/open-source-workflow/tree/d9ca4a09da3e46d90bb9513ccf08a1ed1371501f/css).

Did it work?! Awesome!



