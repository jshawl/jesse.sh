---
layout: post
title: JSONify your Jekyll Site
---

Recently, I wanted to be able to dynamically load posts on my jekyll site. One way to achieve this is to generate the entirety
of your site in json.

I created a file called `site.json` and added these contents: 

{% highlight html %}
  {% raw %}
    ---
    layout: nil
    ---

    [
	{% for post in site.posts %}
	    {
	      "title"    : "{{ post.title }}",
	      "url"     : "{{ post.url }}",
	      "date"     : "{{ post.date | date: "%B %d, %Y" }}",
	      "content"  : "{{ post.content | escape }}"
	    } {% if forloop.last %}{% else %},{% endif %}
	{% endfor %}
    ] 
  {% endraw %}
{% endhighlight %}

If you omit the `escape` by "content", double quotes in your content might break your json.

Happy Ajaxing!
