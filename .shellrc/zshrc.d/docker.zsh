alias fig='docker-compose'
alias docker-rm-exited="docker rm $(docker ps -a | grep 'Exited' | awk '{ print $1 }')"
export DOCKER_CONTENT_TRUST=1
