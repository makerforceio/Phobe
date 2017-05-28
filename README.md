# Project Phobe
Project Phobe aims to create a replacement for CCTV cameras around the world as a mobile CCTV camera solution.
It implements this platform into IOT and enables control over a web interface. Through this interactive
design it is able to overcome user difficulties and provide a smooth and sleek user interface for control
of the robot.

Our design goals include
* Ease-of-use
* Affordability
* Simple control algorithms
* Multi-terrain navigation
* Interactive and intuitive UI

## Inspiration
We realised that many people were buying CCTV cameras for their homes recently due to the spike in terrorism fear and increase in crime rates. However, due to the high price of commercial CCTV cameras costing upwards of 250 dollars, many household can only afford one camera which is barely enough to cover a single room in a normal flat. Therefore, we decided to create a system which is low cost and ensures that a single camera can be used for surveillance throughout the entire house. And this of course led to us being inspired to build phobe.

## What it does
Phobe basically uses the Roomba system and IR sensors to navigate around the house. This allows for a camera to roam around the house autonomously detecting unknown obstacles or people. It combines this aspect of hardware with a Web UI to create a simple user interface for the user to access anywhere in the world. It also allows the user to take over manual control of the drone and drive it to wherever the person desires.

## How we built it
We built Phobe from a ZumoBot platform which we modified to include a raspberry pi as a primary processor. We also attached a camera to the raspberry pi and this allows Phobe to act as a IOT device.

Software-wise, we streamed mjpg video using . The bot also acts as a web server through the node.js running on the Raspberry Pi, serving a simple control page featuring the status of the bot, the video stream and an option to override the autonomous pathing in favour of manual control.

## Challenges
Most of the problems we ran into were those of the technical variety, such as the initial problems of an unreliable wifi and one of our motors burning out in the middle of the night, causing a mad rush to attain spares.
