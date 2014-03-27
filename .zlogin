if [[ -z $DISPLAY && ! -e /tmp/.X11-unix/X0 && -x /usr/bin/startx ]] && (( EUID )); then
    exec startx
else
    eval $(keychain --eval id_rsa)
fi
