import { rpc } from './rpc'

const wireless = {}

wireless.getDevices = function () {
  return new Promise(resolve => {
    if (this.devices) {
      resolve(this.devices)
      return
    }

    rpc.call('iwinfo', 'devices').then(r => {
      this.devices = r.devices || []
      resolve(this.devices)
    })
  })
}

wireless.info = function (device) {
  return new Promise((resolve, reject) => {
    this.getDevices().then(devices => {
      if (!devices.includes(device)) {
        reject(new Error(`Device "${device}" does not exist.`))
        return
      }
      rpc.ubus('iwinfo', 'info', { device }).then(r => resolve(r))
    })
  })
}

wireless.scan = function (device) {
  return new Promise((resolve, reject) => {
    this.getDevices().then(devices => {
      if (!devices.includes(device)) {
        reject(new Error(`Device "${device}" does not exist.`))
        return
      }
      rpc.ubus('iwinfo', 'scan', { device }).then(r => resolve(r))
    })
  })
}

wireless.getAssoclist = function () {
  return new Promise(resolve => {
    this.getDevices().then(devices => {
      const promises = []

      if (devices.length < 1) {
        resolve([])
        return
      }

      devices.forEach(dev => {
        promises.push(rpc.call('iwinfo', 'assoclist', { device: dev }))
      })

      Promise.all(promises).then(rs => {
        const assoclist = []

        rs.forEach(r => {
          if (Array.isArray(r)) r = {}
          for (const mac in r) {
            const sta = r[mac]
            sta.mac = mac
            assoclist.push(sta)
          }
        })

        resolve(assoclist)
      })
    })
  })
}

export default {
  install (Vue) {
    Vue.prototype.$wireless = wireless
  }
}
