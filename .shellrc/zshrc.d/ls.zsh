# Colorized ls (oh-my-zsh used to provide this via its core lib).
if [[ "$DISABLE_LS_COLORS" != "true" ]] && command -v dircolors > /dev/null; then
  [[ -z "$LS_COLORS" ]] && eval "$(dircolors -b)"
  alias ls='ls --color=auto'
fi
