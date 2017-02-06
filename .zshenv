export EDITOR=vim
export TZ='America/Los_Angeles'
export BROWSER='chromium'
export GOPATH=$HOME/.go
export CHROME_BIN="$(which google-chrome)"

alias tmux='TERM=screen-256color-bce tmux'
alias arduino="sh $HOME/arduino/arduino"
alias v='vim'

export ANDROID_HOME="$HOME/android-sdk"

# Path
export PATH="$HOME/.local/bin:$PATH"
export PATH="/usr/local/bin:$PATH"
export PATH="$PATH:$HOME/.rvm/bin" # Add RVM to PATH for scripting
export PATH=$PATH:$HOME/.bin:$HOME/bin
