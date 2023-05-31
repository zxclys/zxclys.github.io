import os
import sys

from twt_img import twt_img


def main():
    # 获取命令行参数列表
    args = sys.argv
    if len(args) != 3:
        print("error args: ", args)
        print("usage: python py_action_twt_img.py <ak> <sk>")
        sys.exit(1)

    # 指定要处理的文件夹
    api_key = args[1]
    api_secret = args[2]

    conf_twt_user = "conf/twt_user.conf"
    img_twt = "img/twt/"
    with open(conf_twt_user, "r") as fp:
        twt_user_list = fp.readlines()
    print("twt_user_list len:", len(twt_user_list))

    print("init downloader...")
    downloader = twt_img.Downloader(api_key, api_secret)
    count = 0
    for twt_user in twt_user_list:
        count += 1
        print('process user:', twt_user, ' count:', count, '/', len(twt_user_list))
        dest = os.path.join(img_twt, twt_user)
        if not os.path.exists(dest):
            os.makedirs(dest)
        downloader.download_images(twt_user, dest, "orig", 1000, False)


if __name__ == '__main__':
    main()
