import { rpc } from './rpc'

export const log = {}

// params = { table: string, limit: number }
log.get = function (params) {
  return rpc.call('log', 'log', params)
}

export default {
  install (Vue) {
    Vue.prototype.$log = log
  }
}
