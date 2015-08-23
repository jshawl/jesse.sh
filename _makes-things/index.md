---
layout: default
title: Projects
type: page
projects:
  - title: Slackbot Reminders
    description: <p>Send a direct message to the bot:</p> <blockquote> <p>Walk the dog; at 5pm</p> </blockquote> <p>Everything before the ";" is the reminder. Everything after the semi-colon is when the reminder will be sent back.  The complete list of available time descriptions can be found here - <a href="https://github.com/mojombo/chronic#examples">https://github.com/mojombo/chronic#examples</a></p> <p>The bot will reply with your reminder at the specified time via direct message.</p>
    url: "https://github.com/jshawl/slackbot-reminders"
  - title: Gistalt
    description: <p><a href='http://dvncan.com'>Duncan Graham</a> and I built a beautiful interface to create and edit GitHub gists.</p>
    url: "http://gistalt.co"
  - title: Restful.link
    description: "<p>Inspect RESTful http requests, and be notified of new requests via websockets!</p>"
    url: "http://restful.link/"
  - title: Updog
    description: <p>UpDog is a static website host, powered by DropBox</p>
    url: "https://updog.co/"
  - title: BKBRNR
    description: <p>Bkbrnr is a place where I store all my project ideas. Some are just thoughts, others have repos and code, and a few are even deployed.</p>
    url: 'http://bkbrnr.com/jshawl'
  - title: Precess
    description: <p>I wanted to enhance my Ruby skills by making a Sinatra app, so I built my own real-time Sass (and Less) compiler after listening to the server architecture talk on the <a href='http://blog.codepen.io/radio/'>Codepen radio</a>.</p> <p> The application sits behind an Nginx reverse proxy to the Unicorn server. In order to compile Less, requests are made to an express app listening for compile requests.  
    url: http://precess.co
  - title: Unqueue
    description: <p>My <a href='http://getpocket.com'>Pocket</a> runneth over, and I needed a one click solution to mark all of the items in my queue as read. There wasn't one, so I rolled my own with the Pocket API. <a href="http://jshawl.com/unqueue/">Check it out!</a></p>
    url: "http://jshawl.com/unqueue/"
  - title: Instagramap
    url: 'http://jshawl.com/instagramap/'
    description: <p>This was my personal playground for exploring both the Instagram and Google Maps API's. It pulls in recent photos taken in DC and pins them on a google map.</p> <p>I wanted to recreate the in-app exploratory experience of visualizing a collection of photos.</p>
---

<div class="wrapper projects">
    <h2>Projects</h2>
    <ul>
      {% for project in page.projects %}
	<li>
	  <a href='{{project.url}}'>{{project.title}}</a>
	  <div class='description'>{{project.description}}</div>
	</li>
      {% endfor %}
    </ul>
</div><!-- wrapper -->
<script src="/js/recent-commits.js"></script>
