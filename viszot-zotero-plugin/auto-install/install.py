#!/usr/bin/env python3

from helpers import *
from shutil import copyfile
from sys import platform
import json
import os


DIR_OF_XPI = ".."
PATH_TO_XPI = os.path.join(DIR_OF_XPI, "viszot.xpi")
DIR_OF_LZ4 = None
# https://stackoverflow.com/a/8220141:
if platform == "linux":
    # Linux
    pass
elif platform == "darwin":
    # OS X
    DIR_OF_LZ4 = os.path.join(os.path.expanduser("~"),
                              "Library",
                              "Application Support",
                              "Zotero"
                              )
elif platform == "win32":
    # Windows
    DIR_OF_LZ4 = os.path.join(os.path.expanduser("~"),
                              "AppData",
                              "Roaming",
                              "Zotero",
                              "Zotero"
                              )
profile_rel_path = get_default_from_profiles_ini(os.path.join(DIR_OF_LZ4, "profiles.ini"))
DIR_OF_LZ4 = os.path.join(DIR_OF_LZ4, profile_rel_path)
PATH_TO_LZ4 = os.path.join(DIR_OF_LZ4, "addonStartup.json.lz4")
PATH_TO_EXTENSIONS_JSON = os.path.join(DIR_OF_LZ4, "extensions.json")

# Read addon info:
addon_info = get_addon_info(os.path.join(DIR_OF_XPI, "src", "install.rdf"))


def register_in_lz4_and_copy_xpi():
    # Initialize dictionary:
    object_out = {}
    out_json_filename = os.path.splitext(os.path.basename(PATH_TO_LZ4))[0]
    # Decompress & read original .json.lz4 file:
    decompress_json_lz4(PATH_TO_LZ4, out_json_filename, platform)
    with open(out_json_filename, "r") as jsonf:
        original_json = json.load(jsonf)
        original_app_global = original_json["app-global"]
        object_out["app-global"] = original_app_global
        try:
            # If there are profile-specific addons installed:
            original_app_profile = original_json["app-profile"]
            addons = original_app_profile["addons"]
            addons[addon_info["id"]] = {"enabled": True,
                                        "lastModifiedTime": timestamp_now(),
                                        "path": addon_info["id"]+".xpi",
                                        "signedState": 0,
                                        "version": addon_info["version"],
                                        "enableShims": True
                                        }
            path = original_app_profile["path"]
            # Copy xpi to the designated path with the appropriate name:
            copyfile(PATH_TO_XPI, os.path.join(path, addon_info["id"] + ".xpi"))
            # Append the json file:
            object_out["app-profile"] = {"addons": addons, "path": path}
        except:
            # If there are no profile-specific addons installed:
            addons = {addon_info["id"]: {"enabled": True,
                                         "lastModifiedTime": timestamp_now(),
                                         "path": addon_info["id"]+".xpi",
                                         "signedState": 0,
                                         "version": addon_info["version"],
                                         "enableShims": True
                                         }
                      }
            path = os.path.join(DIR_OF_LZ4, "extensions")
            # Copy xpi to the designated path with the appropriate name:
            copyfile(PATH_TO_XPI, os.path.join(path, addon_info["id"]+".xpi"))
            # Append the json file:
            object_out["app-profile"] = {"addons": addons, "path": path}
    # Save modifications and close:
    with open(out_json_filename, "w") as jsonf:
        json.dump(object_out, jsonf)
    # Compress & write new lz4 file (overwrite)
    compress_json_lz4(out_json_filename, PATH_TO_LZ4, platform)
    # Delete local copy of json file:
    os.remove(out_json_filename)
    return path


def modify_extensions_json(path):
    addon_detailed_info = {"id": addon_info["id"],
                           "syncGUID": "{45d5c74c-465e-9748-abaa-a20704b8a7a8}",
                           "location": "app-profile",
                           "version": addon_info["version"],
                           "type": "extension",
                           "internalName": None,
                           "updateURL": None,
                           "updateKey": None,
                           "optionsURL": None,
                           "optionsType": None,
                           "aboutURL": None,
                           "defaultLocale": {"name": addon_info["name"],
                                             "description": addon_info["description"],
                                             "creator": addon_info["creator"],
                                             "homepageURL": None
                                             },
                           "visible": True,
                           "active": True,
                           "userDisabled": False,
                           "appDisabled": False,
                           "installDate": timestamp_now(),
                           "updateDate": timestamp_now(),
                           "applyBackgroundUpdates": 1,
                           "bootstrap": False,
                           "path": path+addon_info["id"]+".xpi",
                           "skinnable": False,
                           "size": 1,
                           "sourceURI": "file://"+PATH_TO_XPI,
                           "releaseNotesURI": None,
                           "softDisabled": False,
                           "foreignInstall": False,
                           "strictCompatibility": False,
                           "locales": [],
                           "targetApplications": [{"id": "zotero@chnm.gmu.edu",
                                                   "minVersion": "5.0.0",
                                                   "maxVersion": "5.*"
                                                   }],
                           "targetPlatforms": [],
                           "multiprocessCompatible": False,
                           "signedState": 0,
                           "seen": True,
                           "dependencies": [],
                           "hasEmbeddedWebExtension": False,
                           "mpcOptedOut": False,
                           "userPermissions": None,
                           "icons":{},
                           "iconURL": None,
                           "icon64URL": None,
                           "blocklistState": 0,
                           "blocklistURL": None,
                           "startupData": None
                           }
    with open(PATH_TO_EXTENSIONS_JSON) as f:
        extjsn = json.load(f)
        extjsn["addons"].append(addon_detailed_info)
        with open(PATH_TO_EXTENSIONS_JSON, "w") as fp:
            json.dump(extjsn, fp)


if __name__ == "__main__":
    path = register_in_lz4_and_copy_xpi()
    modify_extensions_json(path)
    os.write(1, b"VisZot installed successfully!\n")
