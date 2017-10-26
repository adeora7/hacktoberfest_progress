var inputHandle = document.getElementById("githubHandle");
var btn = document.getElementById("check");

$("#show").hide(); $("#invisbutton").show();
if (document.getElementById("githubHandle").value === "") {
	chrome.storage.sync.get("lastSearched", function (data){
	  var storedHandle = data['lastSearched'];
  	  if (storedHandle != "" && storedHandle != null) {
		setData(storedHandle);
	  }
  });
}

inputHandle.onkeydown = function(event){
	if(event.keyCode == 13) {
		btn.click();
	}
}

document.getElementById("show").onclick = function() {
	document.getElementById("dialog").showModal();
	document.getElementById("overlay").style.visibility = "visible";
}

document.getElementById("closeBtn").onclick = function() {
	document.getElementById("dialog").close();
	document.getElementById("overlay").style.visibility = "collapse";
}

btn.onclick = function() {
  var handle = document.getElementById("githubHandle").value;
	var result = document.getElementById("result");
	if(handle != "" && handle != null) {
		result.innerHTML = "Loading...";
		initData(handle);
	} else {
		result.innerHTML = "Please enter a valid Github Username";
		$("#show").hide(); $("#invisbutton").show();
	}
}

function getMessage(total_count) {
  var message = "";
  switch (total_count) {
    case 0:
      return "It is never too late to start.";
    case 1:
      return "Still long way to go.";
    case 2:
      return "Awesome, you are half way through.";
    case 3:
      return "Just one more to go.";
    default:
      return "Congratulations, you have completed hacktoberfest 2017.";
  }
}

function updateMostRecentUsers(user) {
	chrome.storage.sync.get("mostRecentUsers", function (data) {
		var mostRecentUsers = data['mostRecentUsers'] || [];
		var hasUser = false;
		if (mostRecentUsers.length > 0) {
			for(var i=0; i<mostRecentUsers.length; i++) {
				if (mostRecentUsers[i].name === user.name) {
					hasUser = true;
				}
			}
		}

		if (!hasUser) {
			mostRecentUsers.push(user);
		}

		if (mostRecentUsers.length > 5) {
			mostRecentUsers.shift();
		}

		chrome.storage.sync.set({"mostRecentUsers": mostRecentUsers}, function() {
			var html = "";
			for(var i=0; i< mostRecentUsers.length; i++) {
				html += "<img id='" + mostRecentUsers[i].name + "' class='rounded' src='" + mostRecentUsers[i].thumbnail + "' alt='" + mostRecentUsers[i].name + "'/>";
			}
			var parent = document.getElementById("mostRecentUsers");
			parent.addEventListener("click", function(e) {
				setData(e.target.id);
			});
			parent.innerHTML = html;
		});
	});

}

function setData(handle) {
	document.getElementById("githubHandle").value = handle;
	initData(handle);
}

function getXHR(url) {

	return new Promise(function(resolve, reject) {
		var req = new XMLHttpRequest();
		req.open("GET", url, true);
		req.onreadystatechange = function() {
		  if(this.status === 200 && this.readyState === 4) {
			resolve(JSON.parse(req.responseText));
		  }
		};
		req.onerror = function() {
	      reject(Error("Network Error"));
	    };
		req.send();
	});

}

function initData(handle) {
	var avatarUrl = "";

	getXHR(`https://api.github.com/users/${handle}`)
	.then(function(data) {
		avatarUrl = data.avatar_url;
		return getXHR(`https://api.github.com/search/issues?q=author:${handle}+type:pr+created:2017-09-30T00:00:00-12:00..2017-10-31T23:59:59-12:00+is:public`);
	})
	.then(function(data) {
		var prCount = data.items.length || 0;

		updateMostRecentUsers({"name": handle, "thumbnail": avatarUrl});
		chrome.storage.sync.set({"lastSearched": handle, "thumbnail": avatarUrl}, function () {
		  var res = "";
		  res += "<img id='avatar' src='" + avatarUrl + "'/>"
			res += "<div id='resultHandle'>" + handle + "</div>";
			var count = (prCount > 4 ? "4" : prCount) + "/4";
			res += "<div id='prCompleteCount'>" + count + "</div>";
			var message = getMessage(prCount);
			res += "<div id='message'>" + message + "</div>";
			document.getElementById("result").innerHTML = res;

			var newestPRs = prCount > 4 ? data.items.slice(0, 4) : data.items;
	        if (newestPRs.length > 0) {
			  var content = "";
			  var prs = newestPRs.map((v, i) => {
	            return `<li><a target="_blank" href="${v["html_url"]}">#${v["number"]} - ${v["title"]}</a></li>`;
		      });
	          content += `<div id="prList"><h2>Pull requests</h2><ul>${prs}</ul></div>`;

			  document.getElementById("dialogContent").innerHTML = content;
	  	      document.getElementById("show").style.visibility = "visible";
	  	      $("#show").show(); $("#invisbutton").hide();
		  	} else {
		      document.getElementById("show").style.visibility = "collapse";
		     $("#show").hide(); $("#invisbutton").show();
		  	}

		});
	})
	.catch(function(error) {
		console.error(error);
	});

}
