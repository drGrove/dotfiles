ZSH=$HOME/.oh-my-zsh
ZSH_CUSTOM="$HOME/.zsh_custom"
ZSH_THEME="odin"
DEFAULT_USER="groved"
DISABLE_AUTO_UPDATE="true"
COMPLETION_WAITING_DOTS="true"
plugins=(tmux vi-mode docker systemd kubectl node nvm helm gpg-agent pass git dotenv pipenv)
setopt HIST_IGNORE_SPACE
source $ZSH/oh-my-zsh.sh

autoload -Uz compinit
compinit -u

# Local bin takes precidence
export PATH="$HOME/.local/bin:$PATH"

# Set name of the theme to load. Optionally, if you set this to "random"
# it'll load a random theme each time that oh-my-zsh is loaded.
# See https://github.com/robbyrussell/oh-my-zsh/wiki/Themes
ZSH_THEME="odin"

# If connected locally
if [ -z "$SSH_TTY" ]; then
  envfile="$HOME/.gnupg/gpg-agent.env"
  export SSH_AGENT_PID=""
  export SSH_AUTH_SOCK="${XDG_RUNTIME_DIR:-/var/run/user/$(id -u)}/gnupg/S.gpg-agent.ssh"
else
  export SSH_AUTH_SOCK="${XDG_RUNTIME_DIR:-/var/run/user/$(id -u)}/gnupg/S.gpg-agent.remote.ssh"

fi
export GPG_TTY=$(tty)
gpg --card-status > /dev/null 2>&1

export PATH=$PATH:$HOME/.go/bin

# Uncomment the following line to disable bi-weekly auto-update checks.
# DISABLE_AUTO_UPDATE="true"

# Uncomment the following line to change how often to auto-update (in days).
# export UPDATE_ZSH_DAYS=13

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

if [ -d $HOME/.shellrc/zshrc.d ]; then
  for file in $HOME/.shellrc/zshrc.d/*.zsh; do
    source $file
  done
fi

export TERM=xterm-256color
export XDG_CONFIG_HOME="$HOME/.config"
if command -v hostname > /dev/null; then
  export HOSTNAME=${HOSTNAME:-$(hostname)}
fi
if command -v hostnamectl > /dev/null; then
  export HOSTNAME=${HOSTNAME:-$(hostnamectl hostname)}
fi

alias source-host-config="source $HOME/.host_config/$HOSTNAME/config.sh"
alias cd-host-config="cd $HOME/.host_config/$HOSTNAME/"
alias set-wallpaper="bash $HOME/.host_config/ALL/wallpapers.sh"
alias sourcerc="source $HOME/.zshrc"
alias regen-host-config="gpg --output $HOME/.host_config/$HOSTNAME/config.sh -dq $HOME/.host_config/$HOSTNAME/config.sh.gpg"

hostname=$(cat /etc/hostname 2>/dev/null || echo $HOST)
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

alias jrnl=" jrnl"
# compdef gpg2=gpg
