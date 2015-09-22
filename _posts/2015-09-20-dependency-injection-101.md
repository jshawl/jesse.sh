---
layout: post
---

"Dependency injection" is a somewhat scary term to explain loading modules and making sure
memory footprint is minimal.

I've been thinking a lot about Angular's `$injector` and how I might build a dependency injector
from scratch.

## A thing that creates things

À la angular, I wanted an `injector` as the global namespace, a `module` method that allows
me to both read and create modules. Let's start with creating a module.

We want the interface to be something like

{% highlight js %}
injector.module("egg",[],{
  hatch: function(){
    console.log("chirp chirp") 
  }
})
{% endhighlight %}

Where the name of the module is the first argument, the second argument is
an array of dependencies, and the third argument is the module's prototype (methods and attributes).

{% highlight js %}
var injector = { // global namespace
  module: function(name, dependencies, prototype){
    var module = { // a custom template for modules
      name: name,
      dependencies: dependencies
    }
    for( var attr in prototype){
      module[attr] = prototype[attr] // attach proto methods to module
    }
    this._modules[name] = module
    return module
  },
  _modules: {}
}
{% endhighlight %}

{% highlight js %}
var egg = injector.module('egg',[],{
  hatch: function(){
    console.log("chirp chirp")
  }
})
egg.hatch()
{% endhighlight %}

If there is only the first argument, the injector assumes the module has already been defined and returns the module's prototype.

{% highlight js %}
var injector = { // global namespace
  module: function(name, dependencies, prototype){
    if(!dependencies){
      return this._modules[name]
    }
    var module = { // a custom template for modules
      name: name,
      dependencies: dependencies
    }
    for( var attr in prototype){
      module[attr] = prototype[attr] // attach proto methods to module
    }
    this._modules[name] = module
    return module
  },
  _modules: {}
}
injector.module("egg").hatch()
{% endhighlight %}

Now that we can read and write modules, let's try seeing if a module's dependencies have been loaded before calling methods.

The angular-style of injecting dependencies is:

{% highlight js %}
injector.module('name of module',['array','of','dependencies',function(array, of, dependencies){
  // if each module name in the array is defined and the last element
  // is a function, invoke the function with each dependency as an argument.
}])
{% endhighlight %}

## Raising Errors when Dependencies Are Not Met

If the specified dependency is not already defined in `injector._modules`, raise an error:

{% highlight js %}
for( var i = 0; i < dependencies.length; i++ ){
  var dependency = dependencies[i]
  var loaded = this._modules[dependency] ? true : false
  if(!loaded){
    throw new Error("Dependency not met: " + dependency)
  }
}
{% endhighlight %}

https://repl.it/BJrx/1

## Passing Modules to functions

While in the loop, if the `typeof` the element is a function, we can assume it is the last
element of the array, and invoke it with each of the modules.

{% highlight js %}
if( typeof dependency == "function" ){
  var modules = dependencies.map(function(d){ // map names of modules to actual modules
    return this._modules[d]
  }.bind(this)) // preserve context
  return dependency.apply(this, modules) // unknown number of dependencies
}
{% endhighlight %}

This code must come before the error-raising code above. That is, a `return` is necessary after the
function's invocation to prevent the "module not met" dependency error.

We now have an interface like this:

{% highlight js %}
injector.module('chicken',['egg', function(egg){
    egg.hatch()
}])
{% endhighlight %}

https://repl.it/BJrx/2

## Next Steps

Now that we have a way to create, read, and depend on modules, where do we go from here?

I was thinking it would be nice to be able to asynchronously load modules, but I'll leave that for another day.

Here's the dependency injector all together:

{% highlight js %}
var injector = { // global namespace
  module: function(name, dependencies, prototype){
    if(!dependencies){
      return this._modules[name]
    }
    for( var i = 0; i < dependencies.length; i++ ){
      var dependency = dependencies[i]
      if( typeof dependency == "function" ){
	var modules = dependencies.map(function(d){ // map names of modules to actual modules
	  return this._modules[d]
	}.bind(this)) // preserve context
	return dependency.apply(this, modules) // unknown number of dependencies
      }
      var loaded = this._modules[dependency] ? true : false
      if(!loaded){
	throw new Error("Dependency not met: " + dependency)
      }
    }
    var module = { // a custom template for modules
      name: name,
      dependencies: dependencies
    }
    for( var attr in prototype){
      module[attr] = prototype[attr] // attach proto methods to module
    }
    this._modules[name] = module
    return module
  },
  _modules: {}
}
injector.module('egg',[],{
  hatch: function(){
    console.log("chirp chirp")
  }
})
injector.module('chicken',['egg', function(egg){
  egg.hatch()
}])
{% endhighlight %}

https://repl.it/BJrx/4 | https://github.com/jshawl/dependency-injection