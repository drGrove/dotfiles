local wibox = require("wibox")
local watch = require("awful.widget.watch")
local timer = require("gears.timer")

local icon = wibox.widget {
  {
    id = "icon",
    image = os.getenv("HOME").."/.config/awesome/themes/default/icons/memory.png",
    widget = wibox.widget.imagebox,
    resize = false
  },
  layout = wibox.container.margin(memory_widget_icon, 5, 0, 5, 0),
}
local widget = wibox.widget.textbox()
local function update_widget()
    local mem_free, mem_total, mem_c, mem_b
    local mem_percent, swap_percent, line, f, count
    count = 0
    f = io.open("/proc/meminfo")
    line = f:read()
    while line and count < 4 do
        if line:match("MemFree:") then
            mem_free = string.match(line, "%d+")
            count = count + 1;
        elseif line:match("MemTotal:") then
            mem_total = string.match(line, "%d+")
            count = count + 1;
        elseif line:match("Cached:") then
            mem_c = string.match(line, "%d+")
            count = count + 1;
        elseif line:match("Buffers:") then
            mem_b = string.match(line, "%d+")
            count = count + 1;
        end
        line = f:read()
    end
    io.close(f)
    widget:set_text(" " .. math.floor(100 * (mem_total - mem_free - mem_b - mem_c ) / mem_total).. "%" .. " ")
end
update_widget()
local widget_timer = timer({ timeout = 30 })
widget_timer:connect_signal("timeout", update_widget)
widget_timer:start()

return { widget = widget, icon = icon }
