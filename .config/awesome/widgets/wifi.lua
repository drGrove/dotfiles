local wibox = require("wibox")
local watch = require("awful.widget.watch")

local icon_image = os.getenv("HOME").."/.config/awesome/themes/default/icons/wifi.png"

local icon = wibox.widget {
  {
    id = "icon",
    image = icon_image,
    widget = wibox.widget.imagebox,
    resize = false,
  },
  layout = wibox.container.margin(icon, 5, 0, 5, 0),
}

local widget = wibox.widget.textbox()

local function hide_icon()
  icon.visible = false
  icon:emit_signal("widget::redraw_needed")
  icon:emit_signal("widget::layout_changed")
end

local function show_icon()
  icon.visible = true
  icon:emit_signal("widget::redraw_needed")
  icon:emit_signal("widget::layout_changed")
end

watch(
  "iwconfig", 10,
  function(widget, stdout, stderr, exitreason, exitcode)
    if wireless_dev ~= "" then
      local f = io.popen("iwconfig")
      if f then
        local iwOut = f:read('*a')
        f:close()
				local txt = " " -- why surround with spaces?
        local essid = iwOut:match('.*ESSID[=:]"(.+)" ')
        if essid then
          txt = txt .. essid .. " "
        end
        local linkq1, linkq2 = iwOut:match('Link Quality[=:](%d+)/(%d+)')
        if linkq1 then
          local quality = math.floor(100*tonumber(linkq1)/tonumber(linkq2))
          txt = string.format("%s%d%%", txt, quality)
        end
        local bitrate = iwOut:match('Bit Rate[=:]([%s%w%.]*%/%a+)')
        if bitrate then
          bitrate = bitrate:gsub("%s", "") -- seems unnecessary
          txt = txt .. bitrate .. " "
        end
				if txt == " " then
					hide_icon()
				else
					show_icon()
				end
        widget:set_text(txt)
      end
    end
  end
)

return { widget = widget, icon = icon }
