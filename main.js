const setData = require("./popup").setData;
const initData = require("./popup").initData;

var inputHandle = document.getElementById("githubHandle");
var btn = document.getElementById("check");

if (
    document.getElementById("githubHandle").value === "" &&
    chrome.storage !== undefined
) {
    chrome.storage.sync.get("lastSearched", function (data) {
        var storedHandle = data["lastSearched"];
        if (storedHandle != "" && storedHandle != null) {
            setData(storedHandle);
        }
    });
}

inputHandle.onkeydown = function (event) {
    if (event.keyCode == 13) {
        btn.click();
    }
};

document.getElementById("show").onclick = function () {
    document.getElementById("dialog").showModal();
    document.getElementById("overlay").style.visibility = "visible";
};

document.getElementById("closeBtn").onclick = function () {
    document.getElementById("dialog").close();
    document.getElementById("overlay").style.visibility = "collapse";
};

btn.onclick = function () {
    var handle = document.getElementById("githubHandle").value;
    var result = document.getElementById("result");
    if (handle != "" && handle != null) {
        result.innerHTML = "Loading...";
        initData(handle);
    } else {
        result.innerHTML = "Please enter a valid Github Username";
    }
};
