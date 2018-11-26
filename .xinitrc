# Load Global X settings (Terminal config, fonts, etc)
xrdb -merge ~/.Xresources

# Load system specific configs
host_config="$HOME/.host_config/$(cat /etc/hostname)"
[[ -f "$host_config/screenlayout.sh" ]] && $("$host_config/screenlayout.sh")
[[ -f "$host_config/config.sh" ]] && source "$host_config/config.sh"

gpg-connect-agent updatestartuptty /bye

# Start pavucontrol
pauvcontrol &

# Start compositer
compton &

# Launch Browser
chromium &

# Terminal Setup
kitty &

# Setup Terminal defaults in window manager scope
source $HOME/.zshrc &

# Start Window Manager
i3
