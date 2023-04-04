# VisZot: Visualize your Zotero collections

## 1 Introduction

### 1.1 Motivation

Citation management software is valuable to researchers, allowing them to import references<!--from various sources such as library catalogs, databases, and web pages-->, group them together, annotate them and create bibliographies in various styles. While such features are useful in organizing <!--(synonym: cataloging)--> literature, they fall short of evolving <!--(synonym: enhancing)--> the researcher's understanding of a domain. <!--(keywords: "the-use-of-mapping-in-literature-review", "knowledge synthesis", "mapping review")--> Drawing relationships between citations in one's catalog, like paper A "extends"/"contradicts" paper B, can help identify overlaps and gaps in the literature, and highlight areas where more research is needed.

### 1.2 Contribution

In this project I develop a web application, VisZot, that extends the citation management software Zotero. VisZot allows users to define and visualize relationships between citations in their Zotero library (e.g. A cites B). All data created in VisZot gets stored with the citations in Zotero using the Zotero API. Therefore, a user's VisZot data and Zotero library are fundamentally synchronized.

### 1.3 Overview

In this document I provide a description of the development enviroment, an explanation of the application's architecture, a discussion of features and limitations and an outline of future improvements.



<!-- 

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

**Adding pre-commit hook (optional)**

You may automatically update the Zotero plugin version before committing changes to its source code by adding the following git pre-commit hook:

```
#!/bin/bash

./zotero-plugin/scripts/darwin/version++.sh zotero-plugin/src
./zotero-plugin/scripts/darwin/xpify.sh zotero-plugin/src
```

### 2) Installing the Google Chrome Extension
In the Extensions managment view ("chrome://extensions/"), click "Load Unpacked" and select the "viszot-chrome-extension" directory when prompted.

## System Requirements
- Zotero 5.* Standalone
- Google Chrome 92.* browser
- (For auto-installing the Zotero plugin) Python 3
-->