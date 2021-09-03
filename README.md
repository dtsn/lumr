# Lunr
Are you interested in building your own version of the Enchanted Tiki Shed, or create sound effects for your bar? We can help, lunr is flexible, however you will need some technical knowhow to get it working.

## Hardware
* Raspberry pi (any will do, the more powerful the better)
* Hub hub & lights
* USB sound card, we are using the CSL 7.1 external sound card ([Amazon UK](https://www.amazon.co.uk/gp/product/B01HM5KP5A/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1))
* Speaker setup, we are using a 5.1 PC speaker system

## Supported Platforms
Any platform with supports Node will work, however we are using `omxplayer` by default for audio files. This is only available on the Raspberry pi. Scroll to the bottom for info on how to change this.

## Setup
First download and install a version of Raspberry Pi Lite OS onto an SD card. This is going to be used in a train so we don’t need a desktop environment.

![](operating-system.png)

To setup a Wi-Fi connection on your headless Raspberry Pi, create a text file called `wpa_supplicant.conf`, and place it in the root directory of the microSD card. You will need the following text in the file.

```
country=GB
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
	scan_ssid=1
	ssid=“your_wifi_ssid”
	psk=“your_wifi_password”
}
```

Add an empty file named `ssh` to the root of the SD card we need that for SSH access.

Power on and we can ssh into the box, open up your preferred SSH client (terminal for Mac, putty for Windows). 

`ssh pi@IPADDRESS`

Where `IPADDRESS` is the IP address of your pi. There are lots of ways to find this out but the easiest is to log onto your router and see the address it was given. It would also be a good idea to give it a static up address.

## Configuring your sound-card
Please follow the guide as laid out in this great [stack exchange post](https://raspberrypi.stackexchange.com/questions/80072/how-can-i-use-an-external-usb-sound-card-and-set-it-as-default).  If you are using the default sound card (phono or HDMI) you can skip this step.

You should have an `.asoundrc` file which looks like the following afterwards:

```
pcm.!default {
        type hw
        card 1
}

ctl.!default {
        type hw
        card 1
}
```

## Installing Node and NPM
After you have logged onto your server the first thing to do is to install Node.

`sudo apt install nodejs`

## Installing Lumr
Install `git` if you don’t already have it. Then clone this repo

`git clone git@github.com:dtsn/lumr.git`

`cd` into your new directory `lumr` and start `lumr`:

`npm run start`

Navigate to `http://IPADDRESS:3000` and you should see the lump setup application. This will take you through the connection with your hue hub and setting up your lights.

## Location of your sound files

By default all the sound files are stored in ./sounds, however you can override this with the config option `soundFolder`.

```
{
	soundFolder: '/media/usb/effects'
}
```
Where the soundFolder is the full path to the folder containing all the sounds. In this example it's being held in a USB drive.
