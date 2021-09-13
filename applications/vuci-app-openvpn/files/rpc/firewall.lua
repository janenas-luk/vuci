local rpc = require 'vuci.rpc'
local uci = require 'uci'

local M = {
  ERROR_NAME_EXISTS = "Such firewall rule name already exists!"
}

function M.addToFirewall(params)
  -- papildoma patikra
  return uci.add{}
end

function M.addRule(params)
  local c = uci.cursor()
  local name = params.name
  c:foreach("firewall", "rule", function (s)
    if s.name == name then 
      return M.ERROR_NAME_EXISTS
    end
  end)
  params.type = "rule"
  return M.addToFirewall{params}
end

function M.addForward(params)
  local c = uci.cursor()
  local src = params.src
  local dest = params.dest
  c:foreach("firewall", "forwarding", function (s)
    if s.src == src and s.dest == dest then
      return M.ERROR_NAME_EXISTS
    end
  end)
  params.type = "forwarding"
  return M.addToFirewall(params)
end

function M.addZone(params)
  local c = uci.cursor()
  local name = params.name
  c:foreach("firewall", "zone", function(s)
    if s.name == name then 
      return M.ERROR_NAME_EXISTS
    end
  end)
  params.type = "zone"
  return M.addToFirewall(params)
end

return M