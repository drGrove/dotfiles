local wibox = require("wibox")
local watch = require("awful.widget.watch")
local icon = wibox.widget {
  {
    id = "icon",
    image = os.getenv("HOME").."/.config/awesome/themes/default/icons/battery.png",
    widget = wibox.widget.imagebox,
    resize = false
  },
  layout = wibox.container.margin(battery_widget_icon, 5, 0, 5, 0),
}

local widget = wibox.widget.textbox()

watch(
  "acpi", 10,
  function(w, stdout)
    local batteryType
    local _, status, charge_str, time = string.match(stdout, '(.+): (%a+), (%d?%d%d)%%,? ?.*')
    local charge = tonumber(charge_str) or 100
    widget:set_text(" "..charge.."%")
  end
)

return { widget = widget, icon = icon }
