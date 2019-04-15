# 安装 ArchLinux 到U盘（三）新建虚拟机

[annotation]: <id> (206f744b-1d67-4afa-b25b-76d66c78e95f)
[annotation]: <create_time> (2018-01-14 18:40:00)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (操作系统|Linux)
[annotation]: <status> (public)

## 新建虚拟机

打开VMware，选择菜单 File > New Virtual Machine

![01](https://upload-images.jianshu.io/upload_images/406169-09332cfb71843b47.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

选择Custom（Advanced）点击Next

![02](https://upload-images.jianshu.io/upload_images/406169-748106e9cf527083.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击 Next

![03](https://upload-images.jianshu.io/upload_images/406169-3aad43f8a57469d6.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击 Installer disc image file, 并且选择下载好的Archlinux镜像 点击 Next

![04](https://upload-images.jianshu.io/upload_images/406169-edcaf24bb9c81943.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

选择 Linux , Other Linux 3.x or later kernel 60-bit， 点击 Next

![05](https://upload-images.jianshu.io/upload_images/406169-4664b7396851f4ea.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入虚拟机名称和选择安装位置，点击 Next

![06](https://upload-images.jianshu.io/upload_images/406169-6189a2597ff2e317.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

选择CPU数量，点击 Next

![07](https://upload-images.jianshu.io/upload_images/406169-afa194cd1595bf2b.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

选择内存容量，点击 Next

![08](https://upload-images.jianshu.io/upload_images/406169-5fe16dc1750f0980.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

选择网络接入方式，点击 Next

![09](https://upload-images.jianshu.io/upload_images/406169-7846804807bd81ae.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

新建磁盘，点击 Next

![10](https://upload-images.jianshu.io/upload_images/406169-17fdac5df3019e2d.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

选择磁盘类型，点击 Next

![11](https://upload-images.jianshu.io/upload_images/406169-10075039f27b7916.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

选择 Create a new virtual disk，点击 Next

![12](https://upload-images.jianshu.io/upload_images/406169-9212455769e6ec2a.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

选择磁盘容量，点击 Next

![13](https://upload-images.jianshu.io/upload_images/406169-1cc709e9509e73df.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击 Next

![14](https://upload-images.jianshu.io/upload_images/406169-e78fcd6d5c651ffe.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击 Finish，完成新建虚拟机

![15](https://upload-images.jianshu.io/upload_images/406169-07fd7c65c1975f4d.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 必要的配置

如果U盘支持USB 3.0，请点击菜单 VM > Settings

![16](https://upload-images.jianshu.io/upload_images/406169-964c34655bd53fa7.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

在Hardware选项卡中选择 USB Controller，然后再右面选择USB 3.0，点击OK，确认设置

![17](https://upload-images.jianshu.io/upload_images/406169-6cc3c9e32c817688.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

因为VMWare默认设置是 USB 2.0，否则U盘将无法使用。如果没有该选项，请下载安装最新版VMWare，然后再试。