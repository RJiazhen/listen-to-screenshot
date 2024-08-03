# listen-to-screenshot

通过监听接口请求，在电脑端进行安卓手机截图保存的简易demo。

## 快速开始

### 预先准备

本demo暂时只支持通过有线连接安卓手机，进行截图保存。

所以请先打开手机的开发者模式，开启“USB调试“，然后连接电脑，在手机上信任电脑。

### 启动项目

运行环境：

- node@20.14.0；
- pnpm@7.33.7；

在项目目录下执行以下命令安装依赖：

```bash
pnpm install
```

执行以下命令启动项目：

```bash
npm run dev
```

接下来可以看到控制台打印出类似以下的文字：

```bash
Server listening on port 3939
Go to the following url to take screenshot:
Local: http://localhost:3939/screenshot
On your network: http://192.168.110.186:3939/screenshot
```

即可通过访问http://localhost:3939/screenshot和http://192.168.110.186:3939/screenshot来触发截图。

## 其他

如果需要测量截图延迟，可以拉取[该项目](https://github.com/RJiazhen/react-examples)到本地启动，在手机上打开“SendBeaconExample”这一示例，在该页面进行请求时即可获得带有时间的手机截图。

详细启动说明请参考该项目中的`README.md`。