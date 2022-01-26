# VisZot: Visualize your Zotero collections

### Marios Tsekitsidis

Viszot is a "web" application that visualizes your Zotero collections.

## Installation
There are two components to VisZot: (1) a plugin (/"addon") for the Zotero standalone app, and (2) an extension for the Google Chrome browser. Below you will find instructions on how to install each.

### 1) Installing the Zotero standalone plugin
You may install the Zotero standalone plugin either manually or programatically (automatically).

**Manual installation**
In Zotero, go to "Tools -> Add-ons -> Tools for all Add-ons (the small, drop-down wheel in the top right corner) -> Install Add-on From File" and select the file viszot.xpi located in the directory viszot-zotero-plugin. Restart Zotero when prompted.

**Auto installation (useful in development)**
1. In the terminal, `cd` to the directory `viszot-zotero-plugin`.
2. Run `python install.py` (you might need to install required packages by running `pip install -r requirements.txt` inside `viszot-zotero-plugin/viszotdev_py_helpers` first).

**How to make addon installation file (xpi) from current source code**

(On Mac) Inside the directory `zotero-plugin`, run

```./scripts/darwin/xpify.sh src```

This will create the file `VisZot-XXXX.xpi` in the directory `zotero-plugin`, where "XXXX" is the current version. It will overwrite any previous xpi files in the directory. The newly created xpi file can be used to install the addon (plugin) to Zotero.

**How to increment addon version programmatically**

(On Mac) Inside the directory `zotero-plugin`, run

```./scripts/darwin/version++.sh src```

This will increment the version inside `src/install.rdf` if there are uncommitted changes anywhere under `src/chrome`.

### 2) Installing the Google Chrome Extension
In the Extensions managment view ("chrome://extensions/"), click "Load Unpacked" and select the "viszot-chrome-extension" directory when prompted.

## System Requirements
- Zotero 5.* Standalone
- Google Chrome 92.* browser
- (For auto-installing the Zotero plugin) Python 3
