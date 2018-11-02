# Load Global X settings (Terminal config, fonts, etc)
xrdb -merge ~/.Xresources

# Set screenlayout
#$($HOME/.screenlayout/3screen.sh)

# Start pulseaudio
pulseaudio --daemonize=true &

# Start pavucontrol
pauvcontrol &

# Launch Browser
chromium &

# Terminal Setup
kitti &

# Setup Terminal defaults in window manager scope
source $HOME/.zshrc &

# Start Window Manager
i3
