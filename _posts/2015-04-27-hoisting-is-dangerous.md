---
layout: post
title: "Hoisting Can Be Dangerous"
---

Hoisting is often convenient in JavaScript. It allows us to call functions before they’re defined:

{% highlight js%}
sayHi()
function sayHi(){
  console.log('oh hey')
}
{% endhighlight %}

If you define a function inside of a conditional, you run the risk of having a function being overwritten via hoisting:

{% highlight js %}
if(true){
  function truthy(){
    document.write("true is true!")
  }
} else{
  function truthy(){
    document.write("true is false!")
  }
}
truthy(); // will always log "true is false!"
{% endhighlight %}