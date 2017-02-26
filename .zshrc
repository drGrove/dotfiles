ZSH=$HOME/.oh-my-zsh
ZSH_THEME="odin"
DEFAULT_USER="dgrove"
DISABLE_AUTO_UPDATE="true"
COMPLETION_WAITING_DOTS="true"
plugins=(git tmux grow vi-mode)
source $ZSH/oh-my-zsh.sh


# {{{ GPG Agent Setup

# Always use GPG2
[ -f /usr/bin/gpg2 ] && alias gpg="/usr/bin/gpg2"

# If connected locally
if [ -z "$SSH_TTY" ]; then
  envfile="$HOME/.gnupg/gpg-agent.env"

  if [[ ! -e "$envfile" ]] || ( \
      # deal with changing socket path in gnupg 2.1.13
      [[ ! -e "$HOME/.gnupg/S.gpg-agent" ]] && \
      [[ ! -e "/var/run/user/$(id -u)/gnupg/S.gpg-agent" ]]
    );
	then
    killall gpg-agent
    gpg-agent --daemon --enable-ssh-support > $envfile
  fi

  eval "$(cat "$envfile")" && export SSH_AUTH_SOCK

  # Wake up smartcard to avoid races
  gpg --card-status > /dev/null 2>&1
fi

# If running remote via SSH
if [ ! -z "$SSH_TTY" ]; then
	# Copy gpg-socket forwarded from ssh to default location
    # This allows local gpg to be used on the remote system transparently.
    # Strongly discouraged unless GPG managed with a touch-activated GPG
    # smartcard such as a Yubikey 4.
    # Also assumes local .ssh/config contains host block similar to:
    # Host someserver.com
    #     ForwardAgent yes
    #     StreamLocalBindUnlink yes
    #     RemoteForward /home/user/.gnupg/S.gpg-agent.ssh /home/user/.gnupg/S.gpg-agent
    if [ -e $HOME/.gnupg/S.gpg-agent.ssh ]; then
        mv $HOME/.gnupg/S.gpg-agent{.ssh,}
    elif [ -e "/var/run/user/$(id -u)/gnupg/S.gpg-agent" ]; then
        mv /var/run/user/$(id -u)/gnupg/S.gpg-agent{.ssh,}
    fi

		# Ensure existing sessions like screen/tmux get latest ssh auth socket
    # Use fixed location updated on connect so in-memory location always works
    if [ ! -z "$SSH_AUTH_SOCK" -a \
        "$SSH_AUTH_SOCK" != "$HOME/.ssh/agent_sock" ];
    then
					unlink "$HOME/.ssh/agent_sock" 2>/dev/null
        ln -s "$SSH_AUTH_SOCK" "$HOME/.ssh/agent_sock"
    fi
    export SSH_AUTH_SOCK="$HOME/.ssh/agent_sock"
fi

# }}}

# added by travis gem
[ -f /home/dgrove/.travis/travis.sh ] && source /home/dgrove/.travis/travis.sh

# NVM
export NVM_DIR="/home/dgrove/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

# RVM
export rvm_ignore_gemrc_issues=1
export PATH="$PATH:$HOME/.rvm/bin" # Add RVM to PATH for scripting
[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm" # Load RVM into a shell session *as a function*

# Load all files from .shell/zshrc.d directory
if [ -d $HOME/.shellrc/zshrc.d ]; then
  for file in $HOME/.shellrc/zshrc.d/*.zsh; do
    source $file
  done
fi
