var inputHandle = document.getElementById("githubHandle");
var btn = document.getElementById("check");

inputHandle.onkeydown = function (event) {
  if (event.keyCode == 13) {
    btn.click();
  }
}
btn.onclick = function () {
  console.log("hello world");
  var handle = document
    .getElementById("githubHandle")
    .value;
  console.log(handle);
  var result = document.getElementById("result");
  if (handle != "" && handle != null) {
    result.innerHTML = "Loading...";
    getData(handle);
  } else {
    result.innerHTML = "Please enter a valid Github Username";
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

function getData(handle) {

  var reqUrl = "https://api.github.com/search/issues?q=author%3A" + handle + "+type%3Apr+created%3A2017-09-30T00:00:00-12:00..2017-10-31T23:59:59-12:00+is%3Ap" +
      "ublic";

  var req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    var res = "";
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(req.responseText);
      console.log(data);
      // document.getElementById("resultHandle").innerHTML = handle;

      res += "<div id='resultHandle'>" + handle + "</div>";
      var count = (data['total_count'] > 4
        ? "4"
        : data['total_count']) + "/4";
      res += "<div id='prCompleteCount'>" + count + "</div>";
      var message = getMessage(data['total_count']);

      res += "<div id='message'>" + message + "</div>";
      
      if (data['items'].length > 0) {
        var newestPRs = data.total_count > 4 ? data.items.slice(0, 4) : data.items;
        var prs = newestPRs.map((v, i) => {
          return (`
          <li>
            <a target="_blank" href="${v.html_url}">
              #${v.number} - ${v.title}
            </a>
          </li>`);
        });
      }
      
      document.getElementById("result").innerHTML = res;
    }
  };
  req.open("GET", reqUrl, true);
  // req.setRequestHeader('Cache-Control','max-age=0');
  req.send();

}
