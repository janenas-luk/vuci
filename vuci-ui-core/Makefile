#
# Copyright (C) 2017 Jianhui Zhao <zhaojh329@gmail.com>
#
# This is free software, licensed under the MIT.
#

include $(TOPDIR)/rules.mk
include ../vuci.mk

PKG_NAME:=vuci-ui-core
PKG_VERSION:=$(strip $(call findrev))
PKG_RELEASE:=1
PKG_MAINTAINER:=Jianhui Zhao <zhaojh329@gmail.com>

PKG_LICENSE:=MIT

include $(INCLUDE_DIR)/package.mk

define Package/vuci-ui-core
  SECTION:=vuci
  CATEGORY:=Vuci
  TITLE:=Vuci ui core
  DEPENDS:=+vuci-httpd
  URL:=https://github.com/zhaojh329/vuci
endef

define Package/vuci-httpd/conffiles
/etc/config/vuci
endef

Build/Prepare=

Build/Compile=

define Package/vuci-ui-core/install
	$(INSTALL_DIR) $(1)/etc/config $(1)/usr/share/vuci/menu.d $(1)/www
	$(INSTALL_CONF) ./files/vuci.menu $(1)/usr/share/vuci/menu.d/vuci.json
	$(INSTALL_CONF) ./files/vuci.config $(1)/etc/config/vuci
	$(CP) ./files/i18n $(1)/www
	$(CP) ./vue/dist/* $(1)/www
endef

$(eval $(call BuildPackage,vuci-ui-core))
