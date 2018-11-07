# Load Global X settings (Terminal config, fonts, etc)
xrdb -merge ~/.Xresources

# Load system specific configs
host_config="$HOME/.host_config/$(cat /etc/hostname)"
[[ -f "$host_config/screenlayout.sh" ]] && source "$host_config/screenlayout.sh"
[[ -f "$host_config/config.sh" ]] && source "$host_config/config.sh"

gpg-connect-agent updatestartuptty /bye

# Start pulseaudio
pulseaudio --daemonize=true &

# Start pavucontrol
pauvcontrol &

# Start compositer
compton &

# Set Wallpaper
MONITORS=$(xrandr --listmonitors | grep "Monitors:" | cut -d" " -f2)
for run in $(seq 0 $MONITORS); do
  nitrogen --head=$run --set-scaled $HOST_WALLPAPER
done

# Launch Browser
chromium &

# Terminal Setup
kitty &

# Setup Terminal defaults in window manager scope
source $HOME/.zshrc &

# Start Window Manager
i3
