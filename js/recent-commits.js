(function(){
  var history = JSON.parse(localStorage.getItem("recentCommits"))
  if( history && history.date >= new Date().getTime() - 600000 ){
    var recentCommits = history
    render(recentCommits.commits)
  } else {
    getRecentCommits(function(commits){
      var recentCommits = {
        date: new Date().getTime(),
        commits: commits
      }
      localStorage.setItem("recentCommits", JSON.stringify(recentCommits))
      render(commits)
    })
  }
  function getRecentCommits( callback ){
    var request = new XMLHttpRequest();
    request.open('GET', 'https://api.github.com/users/jshawl/events', true);
    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
	// Success!
	var data = JSON.parse(this.response);
        callback(data)
      }
    }
    request.onerror = function() {
      // There was a connection error of some sort
    };
    request.send();
  }
  function render( data ){
    var h2 = document.createElement("h2")
    h2.innerHTML = "Recent Commits"
    var container = document.querySelector(".projects")
    container.appendChild( h2 )
    var ul = document.createElement("ul")
    container.appendChild( ul )
    for( var i = 0; i < data.length; i++ ){
      var evt = data[i]
      if(evt.type == "PushEvent" && evt.payload.commits[0].author.email == "jesse@jshawl.com"){
	var li = document.createElement("li")
	var a = document.createElement("a")
	a.innerHTML = evt.repo.name
	a.href = "https://github.com/" + evt.repo.name
	var description = document.createElement("p")
	description.classList.add("description")
	var commit = evt.payload.commits[0] 
	var sha = document.createElement("a")
	sha.classList.add("sha")
	sha.innerHTML = commit.sha.substr(0,7)
	sha.href = "https://github.com/" + evt.repo.name + "/commit/" + commit.sha
	description.appendChild(sha)
	description.innerHTML += " " + commit.message
	li.appendChild(a)
	li.appendChild(description)
	ul.appendChild(li)
      }
    }
  }
})()
