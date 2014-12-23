---
layout: post
---

I recently came across a gem for handling user authentication with sinatra - 
[sinatra simple authentication](https://github.com/pmonfort/sinatra-simple-authentication).
This gem was easy to install and use, but the log in and sign up views
were hardcoded in Haml.

This meant I couldn’t take advantage of Sinatra’s layout.erb global view, and
any shared markup (navigation, footer, etc.) would have to be copied and pasted
into each of the views, *and* be written in Haml!!

So I decided to fork the gem and convert the views to use erb.

## Fork and clone the repo

First, you’ll need to fork the repo on [github](https://github.com/) and clone your fork:

    $ git clone git@github.com:jshawl/sinatra-simple-authentication

## Build the gem locally

First install dependencies:

    $ bundle install

And build the gem:

    $ gem build sinatra-simple-authentication.gemspec 

## Require the local gem from another ruby app

In a separate directory, you’ll need a ruby application with a gemfile and an app.rb
to see the changes that you make to the gem - i.e. link to the local one.

Here’s the one I’m working with - [view on github](https://github.com/jshawl/sinatra-authentication/tree/6536b6732edcc37ac85fe6baa5330eecabf80a54)

In the Gemfile, add the path to the local gem:

<div class="highlight"><pre><span class="gh">diff --git a/Gemfile b/Gemfile</span>
<span class="gh">index 418bda9..770b9f6 100644</span>
<span class="gd">--- a/Gemfile</span>
<span class="gi">+++ b/Gemfile</span>
<span class="gu">@@ -7,5 +7,5 @@ gem &#39;activerecord&#39;</span>
 gem &#39;sinatra-contrib&#39;
 gem &#39;sinatra-activerecord&#39;
 gem &#39;pg&#39;
<span class="gd">-gem &#39;sinatra-simple-authentication&#39;</span>
<span class="gi">+gem &#39;sinatra-simple-authentication&#39;, :path =&gt; &quot;~/Sites/sinatra-simple-authentication&quot;</span>
 gem &#39;rack-flash3&#39;
</pre></div>

Install the dependencies from this new Gemfile:

    $ bundle install

And run the application:

    $ bundle exec ruby app.rb

The bundle exec tripped me up a bit at first. Without it, I kept getting:

    kernel_require.rb:55:in `require': cannot load such file -- sinatra/simple-authentication (LoadError)

when trying to run my application with `ruby app.rb`. 


`bundle exec` is required to load the local gem we installed with `bundle install`. The [man page](http://bundler.io/man/bundle-exec.1.html) says it perfectly:

>Essentially, if you would normally have run something like `rspec spec/my_spec.rb`, and you want to use the gems specified in the Gemfile(5) and installed via bundle install(1), you should run `bundle exec rspec spec/my_spec.rb`.

## Make changes

Now you can freely edit the files in your local gem's folder. Here are the changes I made to the sinatra simple
authentication gem - [view on github](https://github.com/jshawl/sinatra-simple-authentication/compare/ff7064dcadde23ee3b7d6be3383a80f8f1679ac6...7f039d63758c0af6472b9bd1aeab260fcff024c5)

## Pull request?

If you push your changes back to github, others can use your fork of the gem by
specifying a git url and branch name in their Gemfile:

<div class="highlight"><pre><span class="gh">diff --git a/Gemfile b/Gemfile</span>
<span class="gh">index 418bda9..39ae19b 100644</span>
<span class="gd">--- a/Gemfile</span>
<span class="gi">+++ b/Gemfile</span>
<span class="gu">@@ -7,5 +7,5 @@ gem &#39;activerecord&#39;</span>
 gem &#39;sinatra-contrib&#39;
 gem &#39;sinatra-activerecord&#39;
 gem &#39;pg&#39;
<span class="gd">-gem &#39;sinatra-simple-authentication&#39;</span>
<span class="gi">+gem &#39;sinatra-simple-authentication&#39;, :git =&gt; &quot;https://github.com/jshawl/sinatra-simple-authentication.git&quot;, :branch =&gt; &quot;master&quot;</span>
</pre></div>

If you think other users of this gem would benefit from your changes, submit a pull request on github!


