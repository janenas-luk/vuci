import { rpc } from './rpc'

const mnfinfo = {
  name: undefined,
  serial: undefined,
  mac: undefined,
  macEth: undefined,
  batch: undefined,
  hwver: undefined
}

mnfinfo.load = async function () {
  const { mnfinfo } = await rpc.ubus('mnfinfo', 'get')
  Object.keys(mnfinfo).forEach(key => {
    this[key] = mnfinfo[key]
  })
  return mnfinfo
}

mnfinfo.loadOrLocal = async function (param) {
  if (!mnfinfo[param]) {
    await this.load()
  }
  return mnfinfo[param]
}

mnfinfo.getName = function () {
  return this.loadOrLocal('name')
}

mnfinfo.getSerial = function () {
  return this.loadOrLocal('serial')
}
mnfinfo.getMac = function () {
  return this.loadOrLocal('mac')
}

mnfinfo.getMacEth = function () {
  return this.loadOrLocal('macEtc')
}
mnfinfo.getBatch = function () {
  return this.loadOrLocal('batch')
}

mnfinfo.getHwver = function () {
  return this.loadOrLocal('hwver')
}

mnfinfo.getAll = function () {
  return new Promise(resolve => {
    this.load().then(resolve)
  })
}

export default {
  install (Vue) {
    Vue.prototype.$mnfinfo = mnfinfo
  }
}
