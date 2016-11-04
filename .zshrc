# Path to your oh-my-zsh configuration.
ZSH=$HOME/.oh-my-zsh

# Set name of the theme to load.
# Look in ~/.oh-my-zsh/themes/
# Optionally, if you set this to "random", it'll load a random theme each
# time that oh-my-zsh is loaded.
ZSH_THEME="odin"
DEFAULT_USER="dgrove"
# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"
source ~/.bash-aliases
export BROWSER="google-chrome-beta"
export EDITOR="vim"
# Set to this to use case-sensitive completion
# CASE_SENSITIVE="true"

# Uncomment this to disable bi-weekly auto-update checks
# DISABLE_AUTO_UPDATE="true"

# Uncomment to change how often before auto-updates occur? (in days)
# export UPDATE_ZSH_DAYS=13

# Uncomment following line if you want to disable colors in ls
# DISABLE_LS_COLORS="true"

# Uncomment following line if you want to disable autosetting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment following line if you want to disable command autocorrection
# DISABLE_CORRECTION="true"

# Uncomment following line if you want red dots to be displayed while waiting for completion
# COMPLETION_WAITING_DOTS="true"

# Uncomment following line if you want to disable marking untracked files under
# VCS as dirty. This makes repository status check for large repositories much,
# much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment following line if you want to  shown in the command execution time stamp
# in the history command output. The optional three formats: "mm/dd/yyyy"|"dd.mm.yyyy"|
# yyyy-mm-dd
# HIST_STAMPS="mm/dd/yyyy"

# Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
plugins=(git ssh-agent rails nvm npm node postgres sudo supervisor tmux docker ember-cli git-flow git-extras github grunt mvn redis-cli bower yeoman grow)

source $ZSH/oh-my-zsh.sh

# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# ssh
# export SSH_KEY_PATH="~/.ssh/dsa_id"

# Wearscript Support
export WEARSCRIPT_ENDPOINT="ws://udderweb.com:8042/ws/client/4Xj1egh3dP9qKLfR"

# Android Home
export ANDROID_HOME="$HOME/android-sdk"

source ~/.profile

export EDITOR='vim'
export GOPATH=$HOME/.go
export BROWSER="google-chrome"
#export _JAVA_OPTIONS='-Dawt.useSystemAAFontSettings=setting'
export PATH="$HOME/.local/bin:$PATH"
export PATH="/usr/local/bin:$PATH"
export CLIENT_NAME='drgrovellc-registry'
export CLIENT_IP='192.168.1.135:5000'
alias arduino='sh ~/arduino/arduino'
alias v='vim'
export CHROME_BIN="$(which google-chrome)"

# Load all files from .shell/zshrc.d directory
if [ -d $HOME/.shellrc/zshrc.d ]; then
  for file in $HOME/.shellrc/zshrc.d/*.zsh; do
    source $file
  done
fi

# Powerline
#source `pip show powerline | grep Location | sed 's/Location: //g'`/powerline/bindings/zsh/powerline.zsh

# added by travis gem
[ -f /home/dgrove/.travis/travis.sh ] && source /home/dgrove/.travis/travis.sh

export PATH=$PATH:$HOME/.bin:$HOME/bin

export NVM_DIR="/home/dgrove/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

export PATH="$PATH:$HOME/.rvm/bin" # Add RVM to PATH for scripting
export rvm_ignore_gemrc_issues=1

export PATH="$PATH:$HOME/.rvm/bin" # Add RVM to PATH for scripting
[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm" # Load RVM into a shell session *as a function*
