import { uci } from './uci'
import { rpc } from './rpc'

(function () {
  if (process.env.NODE_ENV === 'production') { return }

  const vuci = window.vuci

  if (typeof (vuci.uci) === 'undefined') {
    vuci.uci = {
      load: conf => {
        uci.load(conf).then(() => {
          if (typeof (console) !== 'undefined') { console.log('Load complete.') }
        })
      },
      sections: (conf, type) => {
        return uci.sections(conf, type)
      },
      get: (conf, sid, opt) => {
        return uci.get(conf, sid, opt)
      }
    }
  }

  if (typeof (vuci.rpc) === 'undefined') {
    vuci.rpc = function (object, method, params) {
      rpc.call(object, method, params).then(r => {
        if (typeof (console) !== 'undefined') { console.log(r) }
      })
    }
  }
})()
