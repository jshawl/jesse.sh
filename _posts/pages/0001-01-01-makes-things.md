---
layout: default
title: Projects
type: page
---

<div class="wrapper projects">
    <article>
	<h2>Precess</h2>
	<a href='http://precess.co/'><img src='/img/precess.png' alt='Prcess'></a>
	<p>I wanted to enhance my Ruby skills by making a Sinatra app, so I built my own real-time Sass (and Less) compiler after listening
	to the server architecture talk on the <a href='http://blog.codepen.io/radio/'>Codepen radio</a>.</p>
	<p> The application sits behind an Nginx reverse proxy to the Unicorn server. In order to compile Less, requests are made to an express app listening for compile requests. 
	    <a href='https://github.com/jshawl/precess/'>View the source on GitHub</a>.
	</p>
	<p>Or start compiling over at <a href='http://precess.co/'>http://precess.co/</a>.</p>
    </article>
    <article>
	<h2 class='article-title'>Pocket Zero</h2>
	<a href="http://jesse.sh/awl/made/pocket-zero/">
	    <img src="/img/pocket-zero.png" alt="Pocket Zero">
	</a>
	<p>My <a href='http://getpocket.com'>Pocket</a> runneth over, and I needed a one click solution to mark all of the items in my queue as read. There wasn't one, so I rolled my own with the Pocket API. <a href="http://jesse.sh/awl/made/pocket-zero/">Check it out!</a></p>
    </article>

    <article>
	<h2>Instagramap</h2>
	<a href='http://jshawl.com/instagramap/'>
	    <img src='/img/imap.png' alt='Instagramap' >
	</a>
	<p>This was my personal playground for exploring both the Instagram and Google Maps API's. It pulls in recent photos taken in DC and pins them on a google map.</p>
	<p>I wanted to recreate the in-app exploratory experience of visualizing a collection of photos.</p>
    </article>

    <article>
	<h2>Jagged Border Generator</h2> 
	Jagged borders make your designs sharp! :) Why not make a <em>cutting</em> edge design with my Jagged Border Generator?</p>
	<pre class="codepen" data-height="500" data-type="result" data-href="JcpKg" data-user="jshawl" data-safe="true"><code></code><a href="http://codepen.io/jshawl/pen/JcpKg">Check out this Pen!</a></pre>
	<script async src="https://codepen.io/assets/embed/ei.js"></script>
    </article>
</div><!-- wrapper -->
