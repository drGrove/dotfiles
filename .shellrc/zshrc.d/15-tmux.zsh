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

# tmux is aliased in ~/.zshenv, so compinit won't auto-bind _tmux. Register it.
compdef _tmux tmux

# The ta/tad/tkss shortcuts take a session name; complete from running sessions.
_tmux_sessions() {
  local -a sessions
  sessions=(${(f)"$(tmux list-sessions -F '#S' 2>/dev/null)"})
  compadd -a sessions
}
compdef _tmux_sessions ta tad tkss

