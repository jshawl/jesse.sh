---
layout: post
title:  "This isn't Target Practice"
---

<p>Checkboxes are tiny. Labels are big(ger). This isn't target practice.<!-- more --></p>

<h3>The Good:</h3>

<pre class="codepen" data-height="300" data-type="result" data-href="CpFrv" data-user="jshawl" data-safe="true"> <code> </code> <a href="http://codepen.io/jshawl/pen/CpFrv">Check out this Pen!</a> </pre>

<script src="http://codepen.io/assets/embed/ei.js"> </script>

<h3>The Bad:</h3>

<pre class="codepen" data-height="300" data-type="result" data-href="Jkwvr" data-user="jshawl" data-safe="true"> <code> </code> <a href="http://codepen.io/jshawl/pen/Jkwvr">Check out this Pen!</a> </pre>

<script src="http://codepen.io/assets/embed/ei.js"> </script>

<h3>The How:</h3>

<p>We give the label a "for" attribute, where the value corresponds to the ID of the corresponding &lt;input></p>

<p>Uh oh! We just used an ID in our markup. I think this is ok, because we're not using the id selector for styling purposes (where IDs <a href='http://csswizardry.com/2011/09/when-using-ids-can-be-a-pain-in-the-class/'>can be a pain in the class</a>).</p>

<p>If for any reason you don't want to use IDs in your markup, you can just wrap the checkbox with the label:</p>

<pre class="codepen" data-height="300" data-type="result" data-href="AKwue" data-user="jshawl" data-safe="true"> <code> </code> <a href="http://codepen.io/jshawl/pen/AKwue">Check out this Pen!</a> </pre>

<script src="http://codepen.io/assets/embed/ei.js"> </script>
