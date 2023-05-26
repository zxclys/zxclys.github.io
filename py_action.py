# -*- coding: UTF-8 -*-

import os
import shutil
import random
import sys

template_base = 'tmp'
template_base_img = template_base + '/t_img.html'
template_base_index = template_base + '/t_index.html'
template_base_js = template_base + '/js/t_script.js'
template_base_css = template_base + '/css/style.css'

with open(template_base_img, 'r') as file:
    template_base_img = file.read()

with open(template_base_index, 'r') as file:
    template_base_index = file.read()

with open(template_base_js, 'r') as file:
    template_base_js = file.read()

t_index_lines = []


# 获取该文件夹下所有的文件
def list_dir_and_files(dir_path):
    dir_list = os.listdir(dir_path)
    list_dir = []
    list_files = []
    for file_name in dir_list:
        file_path = os.path.join(dir_path, file_name)
        if os.path.isdir(file_path):
            list_dir.append(file_path)
        else:
            list_files.append(file_name)
    return list_dir, list_files


# 对图片文件进行重命名
def img_rename_dir(dir_path, img_files, out_path):
    # shuffle
    random.shuffle(img_files)
    # 输出路径创建子路径
    if not os.path.exists(os.path.join(out_path, dir_path)):
        os.makedirs(os.path.join(out_path, dir_path))
    for i, f in enumerate(img_files):
        old_path = os.path.join(dir_path, f)
        new_name = str(i + 1) + ".jpg"
        new_path = os.path.join(out_path, dir_path, new_name)
        shutil.copy(old_path, new_path)


def img_html_dir(dir_path, len_files, out_dir):
    if len_files == 0:
        return
    # js
    out_js_str = template_base_js.replace('_tmp_max_count', str(len_files))
    out_js_str = out_js_str.replace('_tmp_img_dir', dir_path)
    out_js_file_name = dir_path.replace("/", "_") + ".js"
    out_js_file = os.path.join(out_dir, 'js', out_js_file_name)
    with open(out_js_file, mode='w') as js_file:
        js_file.write(out_js_str)

    # html
    out_html_str = template_base_img.replace('_tmp_title', dir_path)
    out_html_str = out_html_str.replace('_tmp_js', out_js_file_name)
    out_html_file_name = dir_path.replace("/", "_") + ".html"
    out_html_file = os.path.join(out_dir, out_html_file_name)
    with open(out_html_file, mode='w') as html_file:
        html_file.write(out_html_str)

    # index
    t_index_lines.append('<a href="' + out_html_file_name + '" target="_blank">' + dir_path + '</a> </br>')


def img_rename_recursion(base_path, base_out_path):
    print("img_rename_recursion: ", base_path)
    list_dir, list_files = list_dir_and_files(base_path)
    # 重命名
    img_rename_dir(base_path, list_files, base_out_path)
    # html构造
    img_html_dir(base_path, len(list_files), base_out_path)

    for sub_dir in list_dir:
        img_rename_recursion(sub_dir, base_out_path)


def main():
    # 获取命令行参数列表
    args = sys.argv
    if len(args) != 3:
        print("error args: ", args)
        print("usage: python py_img_rename.py <img_path> <out_path>")
        sys.exit(1)

    # 指定要处理的文件夹
    base_img_path = args[1]
    base_out_path = args[2]

    base_out_path_css = os.path.join(base_out_path + "/css")
    base_out_path_js = os.path.join(base_out_path + "/js")
    base_out_path_index = os.path.join(base_out_path + "/index.html")

    # 输出路径
    if os.path.exists(base_out_path):
        shutil.rmtree(base_out_path)
    os.makedirs(base_out_path)
    os.makedirs(base_out_path_css)
    os.makedirs(base_out_path_js)
    shutil.copy(template_base_css, base_out_path_css)

    img_rename_recursion(base_img_path, base_out_path)

    # index
    out_index_str = template_base_index.replace('_tmp_index', '\n'.join(t_index_lines))
    with open(base_out_path_index, mode='w') as index_file:
        index_file.write(out_index_str)

    print("success: " + base_out_path_index)


if __name__ == '__main__':
    main()
