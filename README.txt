RUNNING THE PROJECT

We opened the file game.html in chrome using the --allow-file-access-from-files option.

SUMMARY OF PROJECT

We implemented a first-person shooter game where you shoot enemies to increase your score until your health is negative. Then you die. You don't get any lives, you don't get to restart. You have died and that is the end for you.

The first screen is a menu that shows start, options, and rules. You can switch between these options by using the up and down keys. Hit enter to select. In the options and rules screens, you can press backspace in order to go back to the first screen. Hit start to begin the game.

During the game, you can move the camera by moving the mouse around the canvas. Clicking will fire a bullet from the gun, and hitting the 's' key will throw a grenade into the field. Holding down the 's' key will throw the grenade further. Both these actions are accompanied by a sound. You can also move side-to side with the A and D keys to allow a greater range of freedom while shooting.

When your health is 0 or below, a screen appears showing a
message with your final score. Again, you don't get any other chances, because this is life and death, man.

As the game progresses, the levels increase which cause the enemies to gain health, deal more damage, but also grant higher score values. At the same time, you will gain a minimal amount of health and a grenade as the levels pass. The passage of the sun from east to west indicates the progress through the level.

ADVANCED TOPICS

1)BUMP MAPPING
	Normal mapping is applied to the floor of the environment.

2)PHYSICS
	Physics is used to determine the trajectory and bouncing 	of the grenade.

3)COLLISION DETECTION
	AABB collision detection has been impelmented to determine 	if the bullets or grenade explosion have hit enemies and 	also to tell if enemies have collided to allow them to 	bounce off of each other. There is also collision 	detection between the grenade and the ground.


EXPERIENCE

Because everybody has their own schedules it was really difficult to actually manage to get everybody together to work on the code. As a result most of our early group meetings were simply to divy up tasks, and then we would all work on the code individually. However, this made it difficult when we came together to actually integrate what we had worked on, because everybody had their own style of coding. Because of the density of our code, it was also difficult to change things once we had put everything together - we found that our new ideas often clashed with what we had already written. It was a good experience on the general nature of large projects.

At the beginning the difficulty of code integration was compounded by the fact that everybody was working on their own little piece of code, so we were all working separately. We eventually managed to get a core build up on Github, allowing us all to work on the same general code. We still ran into a few difficulties because we were all concurrently making our own changes, making the synchronization of those changes a bit of a pain. Communication was really important and allowed us to resolve a lot of the changes, for instance holding back on committing code to allow somebody else to synchronize their changes first.

As time went on and the deadline loomed we learned how to streamline our efforts and valued efficiency and functionality over aesthetics. At the end we were able to fine-tune some things, but overall we learned how to determine what was important and what wasn't when it came to our code. Some things looked neat or were nice ideas but would ultimately take too much time to implement and didn't make the final cut.

In the end it was a very good experience in regards to collaborating with a team on a (relatively) large project.