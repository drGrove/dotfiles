# Set Wallpaper
MONITORS=$(xrandr --listmonitors | grep "Monitors:" | cut -d" " -f2)
let MONITORS-=1
for run in $(seq 0 $MONITORS); do
  nitrogen --head=$run --set-scaled $HOST_WALLPAPER
done

