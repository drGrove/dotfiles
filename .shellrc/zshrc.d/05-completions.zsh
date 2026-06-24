# Completion bootstrap. Runs before any file that calls `compdef` (e.g. the git
# aliases). Distro completions for docker/kubectl/helm/pass already live in
# /usr/share/zsh/site-functions on the default fpath, so compinit alone wires
# them up - no per-tool oh-my-zsh plugin needed.

autoload -Uz compinit && compinit -u
autoload -Uz bashcompinit && bashcompinit

# Freshest dynamic completions for tools that generate their own.
command -v kubectl >/dev/null && source <(kubectl completion zsh)
command -v helm >/dev/null && source <(helm completion zsh)

# pipenv ships a bash-style argcomplete hook (needs bashcompinit above).
command -v pipenv >/dev/null && command -v register-python-argcomplete >/dev/null \
  && eval "$(register-python-argcomplete pipenv)"
