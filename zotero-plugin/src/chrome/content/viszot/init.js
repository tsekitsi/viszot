var Zotero = Components.classes["@zotero.org/Zotero;1"]
    .getService(Components.interfaces.nsISupports)
    .wrappedJSObject;

var allItemsEndpoint = Zotero.Server.Endpoints["/viszot/allItems"] = function() {};
allItemsEndpoint.prototype = {
    "supportedMethods": ["GET"],
    "init": function(postData, sendResponseCallback) {
        var items = Zotero.getActiveZoteroPane().getSelectedCollection().getChildItems();
        sendResponseCallback(200, "application/json",
            JSON.stringify(items)
        )
    }
}

const addMyPaperEndpoint = Zotero.Server.Endpoints["/viszot/addMyPaper"] = function() {};
// https://github.com/zotero/zotero/blob/d361930bcc4730630483625a2d7cf484f1c27554/chrome/content/zotero/lookup.js#L84
addMyPaperEndpoint.prototype = {
    "supportedMethods": ["POST"],
    "supportedDataTypes": ["application/json"],
    /**
	 * TO-DO: add description
	 * @param {Object} postData POST data (expects doi field)
	 * @param {Function} sendResponseCallback function to send HTTP response
	 */
    "init": async function(postData, sendResponseCallback) {
        const doiID = postData.doi; //"10.3847/1538-4357/aaf9aa";
        let newItems = false;
        let libraryID = ZoteroPane.getSelectedLibraryID();
		let collection = ZoteroPane.getSelectedCollection();
        let collections = collection ? [collection.id] : false;
        try {
            await new Zotero.Promise(async (resolve, reject) => {
                let translate = new Zotero.Translate.Search();
                translate.setIdentifier({DOI: doiID});
                let translators = await translate.getTranslators();
                translate.setTranslator(translators);
                try {
                    newItems = await translate.translate({
                        libraryID,
                        collections,
                        saveAttachments: true
                    });
                    sendResponseCallback(200, "text/html", "Added your paper!");
                }
                // Continue with other ids on failure
                catch (e) {
                    Zotero.logError(e);
                }
            })
        } catch (err) {
            Zotero.logError(err);
        }
        //return newItems;
    }
}
