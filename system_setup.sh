#!/bin/bash

set -e

echo "Grabbing package list..."
PACKAGES="$(curl https://gist.githubusercontent.com/drGrove/d845f3905b411ac0da5e5921c60d1d6f/raw/5a188cb3942271619784f1c83a8a44648a79dcb8/packages.txt | xargs)"
sudo pacman -S $PACKAGES

echo "Installing ZSH Theme..."
git clone git@github.com:drGrove/odin $HOME/code/github.com/drGrove/odin
cd $HOME/code/github.com/drGrove/odin && make install

echo "Creating plugdev group..."
sudo groupadd plugdev
sudo usermod -aG plugdev $USER

echo "Installing Polybar..."
POLYBAR_VERSION=${POLYBAR_VERSION-3.3.0}
wget  https://github.com/jaagr/polybar/releases/download/${POLYBAR_VERSION}/polybar-${POLYBAR_VERSION}.tar
tar -xvf polybar-${POLYBAR_VERSION}.tar
cd polybar
mkdir build
cd build
cmake ..
make -j$(nproc)
sudo make install
rm $HOME/polybar-${POLYBAR_VERSION}
rm -r $HOME/polybar

echo "Updating rules for 70-u2f..."
curl https://raw.githubusercontent.com/Yubico/libu2f-host/master/70-u2f.rules | sudo tee /etc/udev/rules.d/70-u2f.rules

echo "Updating udev rules for 20-hw1"
echo "SUBSYSTEMS==\"usb\", ATTRS{idVendor}==\"2581\", ATTRS{idProduct}==\"1b7c\", MODE=\"0660\", GROUP=\"plugdev\"" >/etc/udev/rules.d/20-hw1.rules
echo "SUBSYSTEMS==\"usb\", ATTRS{idVendor}==\"2581\", ATTRS{idProduct}==\"2b7c\", MODE=\"0660\", GROUP=\"plugdev\"" >>/etc/udev/rules.d/20-hw1.rules
echo "SUBSYSTEMS==\"usb\", ATTRS{idVendor}==\"2581\", ATTRS{idProduct}==\"3b7c\", MODE=\"0660\", GROUP=\"plugdev\"" >>/etc/udev/rules.d/20-hw1.rules
echo "SUBSYSTEMS==\"usb\", ATTRS{idVendor}==\"2581\", ATTRS{idProduct}==\"4b7c\", MODE=\"0660\", GROUP=\"plugdev\"" >>/etc/udev/rules.d/20-hw1.rules
echo "SUBSYSTEMS==\"usb\", ATTRS{idVendor}==\"2581\", ATTRS{idProduct}==\"1807\", MODE=\"0660\", GROUP=\"plugdev\"" >>/etc/udev/rules.d/20-hw1.rules
echo "SUBSYSTEMS==\"usb\", ATTRS{idVendor}==\"2581\", ATTRS{idProduct}==\"1808\", MODE=\"0660\", GROUP=\"plugdev\"" >>/etc/udev/rules.d/20-hw1.rules
echo "SUBSYSTEMS==\"usb\", ATTRS{idVendor}==\"2c97\", ATTRS{idProduct}==\"0000\", MODE=\"0660\", GROUP=\"plugdev\"" >>/etc/udev/rules.d/20-hw1.rules
echo "SUBSYSTEMS==\"usb\", ATTRS{idVendor}==\"2c97\", ATTRS{idProduct}==\"0001\", MODE=\"0660\", GROUP=\"plugdev\"" >>/etc/udev/rules.d/20-hw1.rules

echo "Reloading Rules..."
sudo udevadm trigger
sudo udevadm control --reload-rules

echo "Pulling Deps..."
git submodule update --init --recursive

echo "Installing Node..."
LTS_VERSION=$(nvm version-remote --lts)
nvm install $LTS_VERSION
nvm alias default $LTS_VERSION

echo "Configuring Vim..."
cd .vim && \
  git checkout master && \
  git branch --set-upstream-to=origin/master master && \
  git pull && \
  make setup
