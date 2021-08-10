# vuci([中文](/README_ZH.md))

[1]: https://img.shields.io/badge/license-MIT-brightgreen.svg?style=plastic
[2]: /LICENSE
[3]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=plastic
[4]: https://github.com/zhaojh329/vuci/pulls
[5]: https://img.shields.io/badge/Issues-welcome-brightgreen.svg?style=plastic
[6]: https://github.com/zhaojh329/vuci/issues/new
[7]: https://travis-ci.org/zhaojh329/vuci.svg?branch=master
[8]: https://travis-ci.org/zhaojh329/vuci
[9]: https://img.shields.io/badge/Support%20vuci-Donate-blueviolet.svg
[10]: https://paypal.me/zjh329

[![license][1]][2]
[![PRs Welcome][3]][4]
[![Issue Welcome][5]][6]
[![Build Status][7]][8]
![visitors](https://visitor-badge.laobi.icu/badge?page_id=zhaojh329.vuci)
[![Support vuci][9]][10]

[vue.js]: https://github.com/vuejs/vue
[Ant Design of Vue]: https://github.com/vueComponent/ant-design-vue
[json-rpc]: https://www.jsonrpc.org/

![](/demo.gif)

![](/diagram.png)

OpenWrt web user interface implemented in [vue.js] and [Ant Design of Vue].

Vuci uses [json-rpc] to communicate with OpenWrt subsystems and support ACL.

Vuci is especially suitable for enterprise custom development.

# How to build
## Add feeds

	echo "src-git vuci https://github.com/janenas-luk/vuci.git" >> feeds.conf.default
	./scripts/feeds update vuci
	./scripts/feeds install -a -p vuci

## Configure

	Vuci  --->
		Applications  --->
			<*> vuci-app-admin............................................. Administration
			<*> vuci-app-diagnostics.......................................... Diagnostics
			<*> vuci-app-firewall................................................ Firewall
			<*> vuci-app-home.......................................... Built-in home page
			<*> vuci-app-interfaces.................................... Network Interfaces
			<*> vuci-app-login........................................ Built-in login page
			<*> vuci-app-system............................................ System Setting
			<*> vuci-app-upgrade......................................... Backup / Upgrade
			<*> vuci-app-wireless................................................ Wireless
		-*- vuci-bwm........................................ Bandwidth Monitor for vuci
		-*- vuci-httpd................................................ Vuci rpc backend
		-*- vuci-ui-core.................................................. Vuci ui core
	
## Compile

	make V=s

# Jsonrpc example
## General

	{
		"jsonrpc": "2.0",
		"id": 27,
		"method": "call",
		"params": ["sid", "network", "dhcp_leases", {}]
	}

## Ubus

	{
		"jsonrpc": "2.0",
		"id": 7,
		"method": "call",
		"params": ["sid", "ubus", "call", { "object": "system", "method": "board" }]
	}

#  How to modify vue
## vuci-ui-core
1. Modify
2. Enter directory 'vuci/vuci-ui-core/vue' and run the follow commands
```
	npm install
	npm run build
```
## application
1. Modify
2. Enter your application directory(e.g. 'vuci-app-example') and run the follow commands
```
	cp vue/app.vue ../../build-app/src/
```
3. Enter directory vuci/build-app and run the follow commands
```
	npm install
	npm run build
	cp dist/app.common.js ../applications/vuci-app-example/vue/dist/app.js
```
# How to debug vue for application(e.g. vuci-app-example)
1. Copy vuci-app-example/vue/app.vue to vuci-ui-core/vue/src/views/vuci-app-example.vue
2. Enter directory 'vuci/vuci-ui-core/vue' and run the follow commands
```
	npm install
	npm run serve
```

# Contributing
If you would like to help making [vuci](https://github.com/zhaojh329/vuci) better,
see the [CONTRIBUTING.md](/CONTRIBUTING.md) file.
