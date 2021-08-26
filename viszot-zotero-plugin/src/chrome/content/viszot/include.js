var Zotero = Components.classes["@zotero.org/Zotero;1"]
    .getService(Components.interfaces.nsISupports)
    .wrappedJSObject;

var allItemsEndpoint = Zotero.Server.Endpoints["/viszot/allItems"] = function() {};

allItemsEndpoint.prototype = {
    "supportedMethods": ["GET"],
    "init": function(postData, sendResponseCallback) {
        sendResponseCallback(200, "text/html",
            "VisZot reporting..!"
        )
    }
}