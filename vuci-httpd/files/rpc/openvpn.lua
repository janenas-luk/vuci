local ucis = require 'ucis'
local firewall = require 'firewall'
local uci = require 'uci'

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

function M.delete_vpn_firewall_rules()
  local forwardings_res = {}
  for key, value in pairs(M.forwards) do
    forwardings_res = firewall.delete_forwarding(value)
  end
  local rule_res = firewall.delete_rule(M.vpnRule)
  local zone_res = firewall.delete_zone(M.zone_opt)
  return {rule_res, zone_res, forwardings_res}
end

function M.delete_vpn_config(params)
  local c = uci.cursor()
  local vpn_count = 0
  local name = params.name
  if name ~= 'string' then
    return "no name provided!" --error
  end
  M.delete_vpn_keys(params)
  c:foreach('openvpn', 'openvpn', function(s)
    vpn_count = vpn_count + 1
    os.execute("echo "..s._name.." "..s['.name'].." "..s['.type']..">> /tmp/failas.txt")
    if s._name == name then
      c:delete('openvpn', name)
      vpn_count = vpn_count - 1
    end
  end)
  if vpn_count == 0 then
    M.delete_vpn_firewall_rules()
  end
end

return M