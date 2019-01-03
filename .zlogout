# If connected remote
if [ ! -z "$SSH_TTY" ]; then
    # cleanup remote gpg agent socket
    [ -e /var/run/user/1000/gnupg/S.gpg-agent ] && rm /var/run/user/1000/gnupg/S.gpg-agent
fi
