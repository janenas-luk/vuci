local utils = require "vuci.utils"

local M = {}

function M.md5sum(params)
    return { md5 = utils.md5sum(params.path) }
end

function M.remove(params)
    os.remove(params.path)
end

function M.makeDirectory(params)
    os.execute('mkdir '..params.path)
end

function M.removeWildcard(params)
    os.execute('rm  -fr "' ..params.path..'"')
end

return M
