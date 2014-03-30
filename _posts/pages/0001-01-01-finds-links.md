---
layout: default
title: Links
type: page
---

<div class="wrapper">
<h1>Links</h1>
<p>Here's a collection of what I've been enjoying on Pocket lately.</p>
<div class='pocket-watch'></div>
<script src="http://code.jquery.com/jquery-1.11.0.min.js"> </script>
<script type="text/javascript" src="/js/pocketwatch.min.js"> </script>
  <script type='text/javascript'>
  $('.pocket-watch').pocketWatch({
      access_token: '69391704-b853-ba68-f903-c0e281',
      count:10,
      filter: 'favorite',
      template:'<article class="push--bottom"><h2><a href="{% raw %}{{resolved_url}}{% endraw %}">{% raw %}{{resolved_title}}{% endraw %}</a></h2> <p>{% raw %}{{excerpt}}{% endraw %}</p></article>'
   });
  </script>
</div><!-- //wrapper -->
