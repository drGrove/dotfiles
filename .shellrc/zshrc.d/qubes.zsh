# Apply QubesOS specific configuration
if command -v qubesdb-read &> /dev/null; then
	export QUBES_GPG_DOMAIN="vault";
  export SSH_AUTH_SOCK="${XDG_RUNTIME_DIR:-/var/run/user/$(id -u)}/gnupg/S.gpg-agent.${QUBES_GPG_DOMAIN}.ssh"
	ln -sf /bin/qubes-gpg-client-wrapper ~/.local/bin/gpg
	ln -sf /bin/qubes-gpg-client-wrapper ~/.local/bin/gpg2
fi
