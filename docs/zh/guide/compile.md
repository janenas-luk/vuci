# 编译

## 添加feed

``` bash
echo "src-git vuci https://gitee.com/zhaojh329/vuci.git" >> feeds.conf.default
```

如果存在feeds.conf
``` bash
echo "src-git vuci https://gitee.com/zhaojh329/vuci.git" >> feeds.conf
```

## 更新feed

``` bash
./scripts/feeds update vuci
./scripts/feeds install -a -p vuci
```

## 配置

```
VUCI  --->
  <*>  vuci-ui..................... vuci web interface
```

## 编译

``` bash
make V=s
```

或者只编译vuci
``` bash
make package/feeds/vuci/vuci-ui/compile V=s
```
