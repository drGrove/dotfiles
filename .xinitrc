# Load Global X settings (Terminal config, fonts, etc)
xrdb -merge ~/.Xresources

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

# Launch Browser
chromium &

# Terminal Setup
kitty &

# Setup Terminal defaults in window manager scope
source $HOME/.zshrc &

# Start Window Manager
exec i3
