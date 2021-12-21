var Zotero = Components.classes["@zotero.org/Zotero;1"]
    .getService(Components.interfaces.nsISupports)
    .wrappedJSObject;

var allItemsEndpoint = Zotero.Server.Endpoints["/viszot/allItems"] = function() {};

allItemsEndpoint.prototype = {
    "supportedMethods": ["GET"],
    "init": function(postData, sendResponseCallback) {
        var items = Zotero.getActiveZoteroPane().getSelectedCollection().getChildItems();
        var outString = "";
        items.forEach(function(item) {
            outString += ("<div>&#8226; "+item.getField('title', false, true)+"</div>");
        })
        sendResponseCallback(200, "text/html",
            new Date() //outString //JSON.stringify(items)
        )
    }
}