# VisZot: Visualize your Zotero collections

### Marios Tsekitsidis

Viszot is a "web" application that visualizes your Zotero collections.

## Installation
There are two components to VisZot: (1) a plugin (/"addon") for the Zotero standalone app, and (2) an extension for the Google Chrome browser. Below you will find instructions on how to install each.

### 1) Installing the Zotero standalone plugin
You may install the Zotero standalone plugin either manually or programatically (automatically).

**Manual installation**
In Zotero, go to "Tools -> Add-ons -> Tools for all Add-ons (the small, drop-down wheel in the top right corner) -> Install Add-on From File" and select the file viszot.xpi located in the directory viszot-zotero-plugin. Restart Zotero when prompted.

**Auto installation**
1. In the terminal, `cd` to the directory `viszot-zotero-plugin/auto-install`.
2. Run `python install.py` (you might need to install required packages by running `pip install -r requirements.txt` first).

## System Requirements
- Zotero 5.* Standalone
- Google Chrome 92.* browser
- (For auto-installing the Zotero plugin) Python 3
