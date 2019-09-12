source setdpi

# Load Global X settings (Terminal config, fonts, etc)
xrdb -merge ~/.Xresources

# Render i3 config
bash "${HOME}/.local/bin/build_i3_config"
sleep 5

# Load system specific configs
host_config="$HOME/.host_config/$(cat /etc/hostname)"
[[ -f "$host_config/screenlayout.sh" ]] && $("$host_config/screenlayout.sh")

# Set Wallpaper
[[ -f "$HOME/.host_config/ALL/wallpapers.sh" ]] && $("$HOME/.host_config/ALL/wallpapers.sh")

gpg-connect-agent updatestartuptty /bye

# Start compositer
compton &

# Start pavucontrol
pauvcontrol &

# Setup Terminal defaults in window manager scope
source $HOME/.zshrc &

# Launch Chromium
chromium &

# Launch Firefox
firefox &

# Terminal Setup
kitty &

# Start USBGuard
usbguard-applet-qt &

# Start Window Manager
exec i3
