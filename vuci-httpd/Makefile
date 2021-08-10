#
# Copyright (C) 2020 Jianhui Zhao <zhaojh329@gmail.com>
#
# This is free software, licensed under the MIT.
#

include $(TOPDIR)/rules.mk
include ../vuci.mk

PKG_NAME:=vuci-httpd
PKG_VERSION:=$(strip $(call findrev))
PKG_RELEASE:=1

PKG_MAINTAINER:=Jianhui Zhao <zhaojh329@gmail.com>
PKG_LICENSE:=MIT

PKG_CONFIG_DEPENDS:=\
		CONFIG_VUCI_HTTPD_HTTP_PORT \
		CONFIG_VUCI_HTTPD_HTTPS_PORT \
		CONFIG_VUCI_HTTPD_API_UBUS \
		CONFIG_VUCI_HTTPD_NOSSL \
		CONFIG_VUCI_HTTPD_MBEDTLS \
		CONFIG_VUCI_HTTPD_WOLFSSL \
		CONFIG_VUCI_HTTPD_OPENSSL

include $(INCLUDE_DIR)/package.mk
include $(INCLUDE_DIR)/cmake.mk

define Package/vuci-httpd
  SECTION:=vuci
  CATEGORY:=Vuci
  TITLE:=Vuci rpc backend
  DEPENDS:=+libuci-lua +jansson +lsqlite3 +libiwinfo-lua +libpthread \
		+VUCI_HTTPD_API_UBUS:libubus-lua \
		+VUCI_HTTPD_NOSSL:libuhttpd-nossl \
		+VUCI_HTTPD_MBEDTLS:libuhttpd-mbedtls \
		+VUCI_HTTPD_WOLFSSL:libuhttpd-wolfssl \
		+VUCI_HTTPD_OPENSSL:libuhttpd-openssl
  URL:=https://github.com/zhaojh329/vuci
endef

define Package/vuci-httpd/config
if PACKAGE_vuci-httpd
config VUCI_HTTPD_HTTP_PORT
	int "Default http port"
	default 80

config VUCI_HTTPD_HTTPS_PORT
	int "Default https port"
	default 443

choice
prompt "Selected SSL library"
	default VUCI_HTTPD_NOSSL

	config VUCI_HTTPD_NOSSL
		bool "No SSL support"

	config VUCI_HTTPD_MBEDTLS
		bool "mbed TLS"

	config VUCI_HTTPD_WOLFSSL
		bool "wolfSSL"

	config VUCI_HTTPD_OPENSSL
		bool "OpenSSL"
endchoice

config VUCI_HTTPD_API_UBUS
	bool "Support call ubus"
	default y
endif
endef

define Package/vuci-httpd/conffiles
/etc/config/vuci-httpd
/etc/vuci-httpd/oh.db
/etc/vuci-httpd/ssl.crt
/etc/vuci-httpd/ssl.key
endef

define Build/Prepare
	$(INSTALL_DIR) $(PKG_BUILD_DIR)
	$(CP) ./src/. $(PKG_BUILD_DIR)
endef

define Package/vuci-httpd/install
	$(INSTALL_DIR) $(1)/usr/sbin $(1)/etc/init.d $(1)/etc/config \
		$(1)/usr/lib/vuci-httpd/rpc $(1)/etc/vuci-httpd $(1)/usr/lib/lua/vuci/utils
	$(INSTALL_CONF) ./files/vuci-httpd.config $(1)/etc/config/vuci-httpd
	$(INSTALL_BIN) ./files/vuci-httpd.init $(1)/etc/init.d/vuci-httpd
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/vuci-httpd $(1)/usr/sbin
	$(CP) $(PKG_BUILD_DIR)/lua/json.so $(1)/usr/lib/lua/vuci
	$(CP) $(PKG_BUILD_DIR)/lua/network.so $(1)/usr/lib/lua/vuci
	$(CP) $(PKG_BUILD_DIR)/lua/fs.so $(1)/usr/lib/lua/vuci
	$(CP) $(PKG_BUILD_DIR)/lua/system.so $(1)/usr/lib/lua/vuci
	$(CP) $(PKG_BUILD_DIR)/lua/utils.so $(1)/usr/lib/lua/vuci/utils
	$(INSTALL_DATA) $(PKG_BUILD_DIR)/lua/utils.lua $(1)/usr/lib/lua/vuci
	$(INSTALL_DATA) $(PKG_BUILD_DIR)/lua/rpc.lua $(1)/usr/lib/lua/vuci
	$(INSTALL_DATA) ./files/iwinfo.lua $(1)/usr/lib/lua/vuci
	for f in `ls ./files/rpc`; do \
		$(INSTALL_DATA) ./files/rpc/$$$$f $(1)/usr/lib/vuci-httpd/rpc/$$$${f%.*}; \
	done
ifeq ($(CONFIG_VUCI_HTTPD_API_UBUS),)
	rm $(1)/usr/lib/vuci-httpd/rpc/ubus
endif
	$(SED) "3,4 s/80/$(CONFIG_VUCI_HTTPD_HTTP_PORT)/" $(1)/etc/config/vuci-httpd
	$(SED) "7,8 s/443/$(CONFIG_VUCI_HTTPD_HTTPS_PORT)/" $(1)/etc/config/vuci-httpd
endef

$(eval $(call BuildPackage,vuci-httpd))
