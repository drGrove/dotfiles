# Set Wallpaper
if [[ ! -z $HOST_WALLPAPER ]]; then
  MONITORS=$(xrandr --listmonitors | grep "Monitors:" | cut -d" " -f2)
  let MONITORS-=1
  for run in $(seq 0 $MONITORS); do
    nitrogen --head=$run --set-scaled $HOST_WALLPAPER
  done
else
  echo "No wallpaper set"
fi
