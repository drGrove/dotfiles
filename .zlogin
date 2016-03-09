if [[ -z $DISPLAY && ! -e /tmp/.X11-unix/X0 && -x /usr/bin/startx ]] && (( EUID )); then
    exec startx
fi

eval $(keychain --nogui --eval --agents gpg,ssh id_rsa E6184E29)

[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm" # Load RVM into a shell session *as a function*
