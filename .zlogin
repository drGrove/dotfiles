if [[ -z $DISPLAY && ! -e /tmp/.X11-unix/X0 && -x /usr/bin/startx ]] && (( EUID )); then
    exec startx
fi

eval $(keychain --nogui --eval --agents gpg,ssh id_rsa C2E3276E)
