from helpers import *
import json


def remove_from_lz4_and_remove_xpi(dir_of_xpi):
    # 1. Read addon info from install.rdf:
    addon_info = get_addon_info(os.path.join(dir_of_xpi, "src", "install.rdf"))
    # 2. Use addon id to construct xpi filename:
    INSTALLED_XPI_FNAME = addon_info["id"]+".xpi"
    # 3. Extract .json.lz4 archive to .json file in cwd:
    out_json_filename = os.path.splitext(os.path.basename(PATH_TO_LZ4))[0]
    decompress_json_lz4(PATH_TO_LZ4, out_json_filename, platform)
    # 4. Read extacted json:
    with open(out_json_filename, "r") as jsonf:
        original_json = json.load(jsonf)
        # Get path to extensions dir:
        original_app_profile = original_json["app-profile"]
        path_to_extensions_dir = original_app_profile["path"]
        # 5. Remove .xpi from extensions dir:
        try:
            os.remove(join(path_to_extensions_dir, INSTALLED_XPI_FNAME))
        except FileNotFoundError:
            print("Error: File \"{}\" not found in extensions dir!".format(INSTALLED_XPI_FNAME))
        # 6. Remove addon from temporary json (doesn't throw exception if key not found):
        original_app_profile["addons"].pop("viszot@iastate.edu", "Key not found!")
        # 7. Compress & write new lz4 file (overwrite) in DIR_OF_LZ4:
        with open(out_json_filename, "w") as jsonf:
            json.dump(original_json, jsonf)
        compress_json_lz4(out_json_filename, PATH_TO_LZ4, platform)
    # -1. Clean up:
    os.remove(out_json_filename)


def remove_from_extensions_json(dir_of_xpi):
    my_addon_info = get_addon_info(os.path.join(dir_of_xpi, "src", "install.rdf"))
    with open(PATH_TO_EXTENSIONS_JSON) as f:
        extjsn = json.load(f)
        addons_list = extjsn["addons"]
        for index in range(len(addons_list)):
            addon_info = addons_list[index]
            if addon_info["id"] == my_addon_info["id"]:
                addons_list.pop(index)
                break
        with open(PATH_TO_EXTENSIONS_JSON, "w") as fp:
            json.dump(extjsn, fp)


def uninstall_viszot(dir_of_xpi):
    remove_from_lz4_and_remove_xpi(dir_of_xpi)
    remove_from_extensions_json(dir_of_xpi)
    os.write(1, b"VisZot uninstalled successfully!\n")


if __name__ == "__main__":
    uninstall_viszot("..")
