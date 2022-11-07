local sqlite3 = require "lsqlite3"
local rpc = require "vuci.rpc"

local M = {}

local tables = {
    "CONNECTIONS",
    "EVENTS",
    "NETWORK",
    "SYSTEM"
}

function isInTable(table, element)
    for _, value in pairs(table) do
        if value == element then return true end
    end
    return false
end

function allQuery()
    local query = ""

    for i, table in ipairs(tables) do
        query = query .. "SELECT * FROM " .. table
        if i < #tables then
            query = query .. " UNION ALL "
        end
    end

    return query
end

function readData(data, cols, values, names)
    local row = {}
    for i=1, cols do
        row[names[i]] = values[i]
    end
    table.insert(data, row)
    return 0
end

function M.log(params)
    local db = sqlite3.open("/log/log.db")
    local query
    local log = {}

    if not params.table then
        query = allQuery()
    else
        if not isInTable(tables, params.table) then return rpc.ERROR_CODE_INVALID_PARAMS end
        query = "SELECT * FROM " .. params.table
    end

    if params.order then
        if type(params.order) ~= "string" then return rpc.ERROR_CODE_INVALID_PARAMS end
        if (string.upper(params.order) == "ASC" or string.upper(params.order) == "DESC") then
        query = query ..  ' ORDER BY TIME ' .. string.upper(params.order)
        else
            return rpc.ERROR_CODE_INVALID_PARAMS
        end
    else
        query = query ..  ' ORDER BY TIME DESC '
    end

    if params.limit then
        if type(params.limit) ~= "number" then return rpc.ERROR_CODE_INVALID_PARAMS end
        query = query ..  ' LIMIT ' .. params.limit
    end

    db:exec(query, readData, log)

    return { log = log }
end

return M