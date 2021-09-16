local ucis = require 'ucis'
local firewall = require 'firewall'

local M = {}
local vpn_type = "openvpn"
local port = 1194

M.vpnRule = {
  name = 'Allow-'..vpn_type..'-traffic',
  target = 'ACCEPT',
  src = 'wan',
  family = 'ipv4',
  dest_port = port,
  proto = 'tcp udp',
  vpn_type = vpn_type
}
M.zone_opt = {
  name = vpn_type,
  input= "ACCEPT",
  forward = "REJECT",
  output  = "ACCEPT",
  network = vpn_type,
  masq = '1',
  device  = 'tun_+'
}

M.forwards = {
  {
    dest = "lan",
    src = "openvpn"
  },
  {
    dest = "openvpn",
    src = "lan"
  }
}

function M.delete_vpn_rules()
  
end

function M.delete_vpn_keys(params)
  os.execute('rm -fr "/etc/openvpn/keys/' ..params.name..'"');
end

function M.add_vpn_config(params)
  local tmp_port = params.port
  if tmp_port and M.vpnRule.dest_port ~= tmp_port then
    M.vpnRule.dest_port = tmp_port
  end
  local rule = firewall.add_rule(M.vpnRule)
  local zone = firewall.add_zone(M.zone_opt)
  local forwardings = {}
  for index, value in ipairs(M.forwards) do
    forwardings[index] = firewall.add_forward(value)
  end
  ucis.apply()
  return {rule, zone, forwardings }
end

return M