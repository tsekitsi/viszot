import lz4.block
import os
import re
import time
import xml.etree.ElementTree as ET
import zipfile


def timestamp_now():
    return str(int(time.time()))+"000"


def compress_json_lz4(filepath_in, filepath_out, platform):
    with open(filepath_in, 'rb') as bytestream:
        compressed = lz4.block.compress(bytestream.read())
        with open(filepath_out, 'wb') as outfile:
            outfile.write(b"mozLz40\0" + compressed)


def decompress_json_lz4(filepath_in, filepath_out, platform):
    with open(filepath_in, 'rb') as bytestream:
        bytestream.read(8)  # skip past the b"mozLz40\0" header
        valid_bytes = bytestream.read()
        text = lz4.block.decompress(valid_bytes)
        with open(filepath_out, 'wb') as outfile:
            outfile.write(text)


def decompress_xpi(filepath_in, path_out):
    with zipfile.ZipFile(filepath_in, "r") as zip_ref:
        zip_ref.extractall(path_out)


def get_addon_info(path_to_install_rdf):
    descr_node = ET.parse(path_to_install_rdf).getroot()[0]
    em_string = "{http://www.mozilla.org/2004/em-rdf#}"
    creator = descr_node.find(em_string+"creator").text
    description = descr_node.find(em_string+"description").text
    id = descr_node.find(em_string+"id").text
    name = descr_node.find(em_string+"name").text
    version = descr_node.find(em_string+"version").text
    return {"creator": creator, "description": description,
            "id": id, "name": name, "version": version
            }


def get_default_from_profiles_ini(filepath_to_profiles_ini):
    with open(filepath_to_profiles_ini, "r") as file_obj:
        default_found = False
        counter_i = 1
        counter_j = 1
        start = counter_i
        # First pass (over all lines):
        for line in file_obj:
            if len(re.findall("\[.*\]", line)) > 0:
                if default_found:
                    break
                start = counter_i
            if len(re.findall("Default=1", line)) > 0:
                default_found = True
            counter_i += 1
        file_obj.seek(0)
        # Second pass (starting at the default profile's header line):
        for line in file_obj:
            if counter_j > start:
                if len(re.findall("Path=", line)) > 0:
                    return line.split("=")[1].rstrip()
            counter_j += 1
    return None
