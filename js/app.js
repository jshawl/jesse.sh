(function(){
  var gs, prefix
  var links = document.querySelectorAll(".js-tmux")
  window.addEventListener("keypress", function(event){
    if( event.keyCode == 106 ){ //j
      scrollBy(0,30)
    }
    if( event.keyCode == 107 ){ //k
      scrollBy(0,-30)
    }
    if( event.keyCode == 71 ){ //G
      scroll(0,document.body.scrollHeight)
    }
    if( event.keyCode == 103 ){ //g
      if(gs){
	scroll(0,0)
        gs = false
      } else {
        gs = true
      }
    }
    if(event.keyCode == 2 ){ //Ctrl-b
      prefix = true
    }
    if( event.keyCode == 110 ){ //n
      if( prefix ){
	var active = 0
	for( var i = 0; i < links.length; i++ ){
	  var link = links[i]
          if(link.classList.contains("active")){
	    active = i
	  }	
	}
	if( active == links.length - 1){
	  active = 0 
	} else {
          active += 1
	}
        window.location = links[active].href
      }
    }
    if( event.keyCode == 112 ){ //p
      if( prefix ){
	var active = 0
	for( var i = 0; i < links.length; i++ ){
	  var link = links[i]
          if(link.classList.contains("active")){
	    active = i
	  }	
	}
	if( active == 0 ){
	  active = links.length - 1 
	} else {
          active -= 1
	}
        window.location = links[active].href
      }
    }
  })
})()