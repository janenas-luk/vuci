# Compile

## Add feed

``` bash
echo "src-git vuci https://github.com/zhaojh329/vuci.git" >> feeds.conf.default
```

If there is feeds.conf
``` bash
echo "src-git vuci https://github.com/zhaojh329/vuci.git" >> feeds.conf
```

## Update feed

``` bash
./scripts/feeds update vuci
./scripts/feeds install -a -p vuci
```

## Configure

```
VUCI  --->
  <*>  vuci-ui..................... vuci web interface
```

## Compile

``` bash
make V=s
```

Or just compile vuci
``` bash
make package/feeds/vuci/vuci-ui/compile V=s
```
