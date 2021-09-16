from viszotdev_py_helpers.install_helpers import *


DIR_OF_XPI = "."


def install_viszot():
    path = register_in_lz4_and_copy_xpi(DIR_OF_XPI)
    modify_extensions_json(DIR_OF_XPI, path)
    os.write(1, b"VisZot installed successfully!\n")


if __name__ == "__main__":
    install_viszot()
