# History configuration (oh-my-zsh used to provide this via lib/history.zsh).
[ -z "$HISTFILE" ] && HISTFILE="$HOME/.zsh_history"
HISTSIZE=50000
SAVEHIST=10000

setopt extended_history        # record timestamp of command in HISTFILE
setopt hist_expire_dups_first  # trim duplicates first when HISTFILE exceeds HISTSIZE
setopt hist_ignore_dups        # don't record a command run twice in a row
setopt hist_ignore_space       # ignore commands that start with a space
setopt hist_verify             # confirm history expansion before running
setopt share_history           # share history across running shells
