RUNNING THE PROJECT

We opened the file game.html in chrome using the
--allow-file-access-from-files option.


SUMMARY OF PROJECT

We implemented a first-person shooter game where you shoot
enemies to increase your score until your health is negative.

The first screen is a menu that shows start, options, and rules.
You can switch between these options by using the up and down
keys. Hit enter to select.

During the game, you can shift the navigation of enemies by
moving the mouse around the canvas. Clicking will fire a bullet
from the gun, and hitting the 's' key will throw a grenade into
the field. Both these actions are accompanied by a sound. You can
also move side-to-side with the A and D keys to allow a greater
range of freedom while shooting.

When your health is 0 or below, a screen appears showing a
message with your final score.

As the game progresses, the levels increase which cause the enemies
to gain health, deal more damage, but grant higher score values.

ADVANCED TOPICS

1)BUMP MAPPING
	Normal mapping is applied to the floor of the environment.

2)PHYSICS
	Physics is used to determine the trajectory and bouncing
	of the grenade.

3)COLLISION DETECTION
	AABB collision detection has been impelmented to determine 
	if the bullets or grenade explosion have hit enemies and also 
	to tell if enemies have collided to allow them to bounce off 
	of each other. There is also collision detection between the
	grenade and the ground.


EXPERIENCE

