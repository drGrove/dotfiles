# Minimal vi keybindings (replaces oh-my-zsh vi-mode plugin). No cursor-shape or
# mode-indicator machinery - just vi editing plus the common emacs-style binds.

bindkey -v

bindkey '^P' up-history
bindkey '^N' down-history
bindkey '^r' history-incremental-search-backward
bindkey '^s' history-incremental-search-forward
bindkey '^?' backward-delete-char
bindkey '^h' backward-delete-char
bindkey '^w' backward-kill-word
bindkey '^a' beginning-of-line
bindkey '^e' end-of-line
