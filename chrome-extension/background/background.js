// https://stackoverflow.com/q/5745822
chrome.runtime.onInstalled.addListener(function (object) {
    chrome.tabs.create({url: "../react-app/build/index.html"}, function (tab) {
        console.log("New tab launched with index.html");
    });
});

function getAllItems() {
    $.ajax({
        url:'http://127.0.0.1:23119/viszot/allItems',
        headers: {'zotero-allowed-request':true},
        success: function (response) {
            $("#response").html(response);
            console.log(response);
        },
        error: function (e) {
            console.log(e);
        },
    });
}