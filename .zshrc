ZSH=$HOME/.oh-my-zsh
ZSH_THEME="odin"
DEFAULT_USER="groved"
DISABLE_AUTO_UPDATE="true"
COMPLETION_WAITING_DOTS="true"
plugins=(git tmux grow vi-mode docker systemd kubectl)
source $ZSH/oh-my-zsh.sh

# Path to your oh-my-zsh installation.
export ZSH=/home/groved/.oh-my-zsh

# Set name of the theme to load. Optionally, if you set this to "random"
# it'll load a random theme each time that oh-my-zsh is loaded.
# See https://github.com/robbyrussell/oh-my-zsh/wiki/Themes
ZSH_THEME="odin"

# If connected locally
if [ -z "$SSH_TTY" ]; then
  envfile="$HOME/.gnupg/gpg-agent.env"
fi

export GPG_TTY=$(tty)

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

# Uncomment the following line to display red dots whilst waiting for completion.
# COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
plugins=(git node nvm tmux vi-mode gpg systemd helm)

source $ZSH/oh-my-zsh.sh

if [ -d $HOME/.shellrc/zshrc.d ]; then
  for file in $HOME/.shellrc/zshrc.d/*.zsh; do
    source $file
  done
fi

# Set personal aliases, overriding those provided by oh-my-zsh libs,
# plugins, and themes. Aliases can be placed here, though oh-my-zsh
# users are encouraged to define aliases within the ZSH_CUSTOM folder.
# For a full list of active aliases, run `alias`.

alias source-host-config="source $HOME/.host_config/$(cat /etc/hostname)/config.sh"
alias cd-host-config="cd $HOME/.host_config/$(cat /etc/hostname)/"
alias set-wallpaper="bash $HOME/.host_config/ALL/wallpapers.sh"
alias sourcerc="source $HOME/.zshrc"
alias regen-host-config="gpg --output $HOME/.host_config/$(cat /etc/hostname)/config.sh -dq $HOME/.host_config/$(cat /etc/hostname)/config.sh.gpg"

[ -d "$HOME/.host_config/$(cat /etc/hostname)/bin" ] && export PATH=$PATH:"$HOME/.host_config/$(cat /etc/hostname)/bin"
if [[ $DISPLAY ]]; then
  if [ ! -f "$HOME/.host_config/$(cat /etc/hostname)/config.sh" ]; then
    echo "Generating a local copy of your encrypted file..."
    regen-host-config
  fi
  source "$HOME/.host_config/$(cat /etc/hostname)/config.sh"
fi
