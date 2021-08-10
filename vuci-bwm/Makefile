#
# Copyright (C) 2019 Jianhui Zhao <zhaojh329@gmail.com>
#
# This is free software, licensed under the MIT.
#

include $(TOPDIR)/rules.mk
include $(INCLUDE_DIR)/kernel.mk

PKG_NAME:=vuci-bwm
PKG_RELEASE:=2

include $(INCLUDE_DIR)/package.mk

define KernelPackage/vuci-bwm
  SUBMENU:=Network Support
  TITLE:=Bandwidth Monitor for vuci
  FILES:=$(PKG_BUILD_DIR)/vuci-bwm.ko
  AUTOLOAD:=$(call AutoLoad,30,vuci-bwm,1)
  KCONFIG:=
endef

define Build/Prepare
	$(INSTALL_DIR) $(PKG_BUILD_DIR)
	$(CP) ./src/. $(PKG_BUILD_DIR)
endef

MAKE_OPTS:= \
	$(KERNEL_MAKE_FLAGS) \
	M="$(PKG_BUILD_DIR)"

define Build/Compile
	$(MAKE) -C "$(LINUX_DIR)" \
		$(MAKE_OPTS) \
		modules
endef

define KernelPackage/vuci-bwm/install
	$(INSTALL_DIR) $(1)/etc/init.d $(1)/etc/config
	$(INSTALL_CONF) ./files/vuci-bwm.config $(1)/etc/config/vuci-bwm
	$(INSTALL_BIN) ./files/vuci-bwm.init $(1)/etc/init.d/vuci-bwm
endef

$(eval $(call KernelPackage,vuci-bwm))
