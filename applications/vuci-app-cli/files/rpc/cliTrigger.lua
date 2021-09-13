local M = {}

local CGI_PATH = '/www/cgi-bin/'

function M.runCGI (file)
        local handle = io.popen(CGI_PATH .. file)
        if handle == nil then
                return error()
        end
        local result = handle:read("*a")
        return { result }
end


function M.stringsplit(inputstr, sep)
	if sep == nil then
		sep = "%s"
	end
	local t={}
	i=1
	for str in string.gmatch(inputstr, "([^"..sep.."]+)") do
		t[i] = str i = i + 1
	end
	return t
end

function M.runCLI()
  local message = M.runCGI('cli')[1]
  local html = M.getCliHTML(message)
  local cutTo = string.find(message, 'Content-type',1,true)
  local headerText = string.sub(message, 0, cutTo-2)
  local headerValues = {}
  for str in string.gmatch(headerText, "([^"..'\r\n'.."]+)") do
        local substr = M.stringsplit(str, ": ")
        headerValues[substr[1]] = substr[2]
  end
  return { headerValues, html }
end

function M.getCliHTML(input)
  if (input == nil) or (input == '') then
          return error()
  end
  local index = string.find(input, '<html',1,true)
  input = string.sub(input, index, #input)
  input = string.gsub(input, 'document.location','window.top.location')
  return { input }
end

return M
