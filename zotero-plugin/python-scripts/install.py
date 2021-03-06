from helpers import *
from shutil import copyfile
import json


def register_in_lz4_and_copy_xpi(addon_info, dir_of_xpi):
    PATH_TO_XPI = join(dir_of_xpi, construct_xpi_filename(
        addon_info["name"], addon_info["version"]))
    # Initialize dictionary:
    object_out = {}
    out_json_filename = os.path.splitext(os.path.basename(PATH_TO_LZ4))[0]
    # Decompress & read original .json.lz4 file:
    decompress_json_lz4(PATH_TO_LZ4, out_json_filename, platform)
    # Reading extracted (decompressed) json:
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
            path_to_extensions_dir = original_app_profile["path"]
            # Copy xpi to the designated path with the appropriate name:
            copyfile(PATH_TO_XPI, os.path.join(
                path_to_extensions_dir, addon_info["id"] + ".xpi"))
            # Append the json file:
            object_out["app-profile"] = {"addons": addons,
                                         "path": path_to_extensions_dir}
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
            path_to_extensions_dir = os.path.join(DIR_OF_LZ4, "extensions")
            if not os.path.exists(path_to_extensions_dir):
                os.makedirs(path_to_extensions_dir)
            # Copy xpi to the designated path with the appropriate name:
            copyfile(PATH_TO_XPI, os.path.join(
                path_to_extensions_dir, addon_info["id"]+".xpi"))
            # Append the json file:
            object_out["app-profile"] = {"addons": addons,
                                         "path": path_to_extensions_dir}
    # Save modifications and close:
    with open(out_json_filename, "w") as jsonf:
        json.dump(object_out, jsonf)
    # Compress & write new lz4 file (overwrite):
    compress_json_lz4(out_json_filename, PATH_TO_LZ4, platform)
    # Delete local copy of json file:
    os.remove(out_json_filename)
    return path_to_extensions_dir


def modify_extensions_json(addon_info, dir_of_xpi, path_to_extensions_dir):
    PATH_TO_XPI = join(dir_of_xpi, "viszot.xpi")
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
                           "path": path_to_extensions_dir+addon_info["id"]+".xpi",
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
                           "icons": {},
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


def install_viszot(dir_of_xpi):
    # Read addon info from the source code:
    addon_info = get_addon_info(join(dir_of_xpi, "src", "install.rdf"))

    dir_to_zip = join("..", "src")
    path_to_xpi = join("..", construct_xpi_filename(
        addon_info["name"], addon_info["version"]))
    # Make xpi:
    make_xpi(dir_to_zip, path_to_xpi)  # compress current source code to xpi

    # Continue:
    path = register_in_lz4_and_copy_xpi(addon_info, dir_of_xpi)
    modify_extensions_json(addon_info, dir_of_xpi, path)

    # Announce successful operation:
    os.write(1, b"VisZot installed successfully!\n")


if __name__ == "__main__":
    install_viszot("..")
