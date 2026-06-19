export EDITOR=nvim
export TZ='America/Los_Angeles'
export BROWSER='chromium'
export GOPATH=$HOME/.go
export CHROME_BIN="$(which google-chrome)"

alias tmux='TERM=screen-256color-bce tmux'
alias arduino="sh $HOME/arduino/arduino"
alias v='vim'

export ANDROID_HOME="$HOME/android-sdk"

export TERM=xterm-256color
export XDG_CONFIG_HOME="$HOME/.config"
if command -v hostname > /dev/null; then
  export HOSTNAME=${HOSTNAME:-$(hostname)}
fi
if command -v hostnamectl > /dev/null; then
  export HOSTNAME=${HOSTNAME:-$(hostnamectl hostname)}
fi

[[ -f "$host_config/screenlayout.sh" ]] && $("$host_config/screenlayout.sh")

if [ -d  "$HOME/.host_config/$hostname" ]; then
[ ! -d "$HOME/.host_config/current" ] && ln -s "$HOME/.host_config/$hostname" "$HOME/.host_config/current"
[ -d "$HOME/.host_config/current/bin" ] && export PATH=$PATH:"$HOME/.host_config/current/bin"
if [ ! -f "$HOME/.host_config/current/config.sh" ]; then
  echo "Generating a local copy of your encrypted file..."
  regen-host-config
fi
[ -f "$HOME/.host_config/ALL/config.sh" ] && source "$HOME/.host_config/ALL/config.sh"
[ -f "$HOME/.host_config/current/config.sh" ] && source "$HOME/.host_config/current/config.sh"
fi

# Set Wallpaper
# [[ -f "$HOME/.host_config/ALL/wallpapers.sh" ]] && $("$HOME/.host_config/ALL/wallpapers.sh")

# Path
export PATH="$HOME/.local/bin:$PATH"
export PATH="/usr/local/bin:$PATH"
export PATH="$PATH:$HOME/.rvm/bin" # Add RVM to PATH for scripting
export PATH=$PATH:$HOME/.bin:$HOME/bin
