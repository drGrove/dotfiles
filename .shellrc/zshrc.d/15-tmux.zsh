# tmux aliases, vendored from oh-my-zsh's tmux plugin. Just the aliases - the
# autostart / fixterm / wrapper machinery is dropped.

(( $+commands[tmux] )) || return

: ${ZSH_TMUX_CONFIG:=$HOME/.tmux.conf}

alias tksv='tmux kill-server'
alias tl='tmux list-sessions'
alias tmuxconf='$EDITOR $ZSH_TMUX_CONFIG'

function _build_tmux_alias {
  eval "function $1 {
    if [[ -z \$1 ]]; then
      tmux $2
    else
      tmux $2 $3 \"\$@\"
    fi
  }"
}

_build_tmux_alias "ta" "attach" "-t"
_build_tmux_alias "tad" "attach -d" "-t"
_build_tmux_alias "ts" "new-session" "-s"
_build_tmux_alias "tkss" "kill-session" "-t"

unfunction _build_tmux_alias
