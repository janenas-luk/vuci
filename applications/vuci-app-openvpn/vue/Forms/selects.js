export const protocols = [
  {
    name: 'UDP',
    value: 'udp'
  },
  {
    name: 'TCP',
    value: 'tcp'
  },
  {
    name: 'TCP6',
    value: 'tcp6'
  },
  {
    name: 'UDP6',
    value: 'udp6'
  }
]
export const authAlgorithms = [
  {
    name: 'None',
    value: 'none'
  },
  {
    name: 'MD5',
    value: 'md5'
  },
  {
    name: 'SHA1',
    value: 'sha1'
  },
  {
    name: 'SHA256',
    value: 'sha256'
  },
  {
    name: 'SHA512',
    value: 'sha512'
  },
  {
    name: 'BF-CBC 128 (default)',
    value: 'BF-CBC'
  }
]
export const authMethods = [
  {
    name: 'Static Key',
    value: 'skey'
  },
  {
    name: 'TLS',
    value: 'tls'
  }
]
export const connectionType = [
  {
    name: 'TUN (tunnel)',
    value: 'tun'
  },
  {
    name: 'TAP (bridge)',
    value: 'tap'
  }
]

export default {
  connectionType,
  authMethods,
  authAlgorithms,
  protocols
}
