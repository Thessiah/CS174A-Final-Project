var canvas;
var gl;
var length = 0.5;
var time = 0.0;
var timer = new Timer();
var omega = 200;
var counter = 0.0;
var i = 0.0;

var UNIFORM_mvpMatrix;
var UNIFORM_ambientProduct;
var UNIFORM_diffuseProduct;
var UNIFORM_specularProduct;
var UNIFORM_lightPosition;
var UNIFORM_shininess;
var ATTRIBUTE_position;
var ATTRIBUTE_normal;
var UNIFORM_useTexture;
var UNIFORM_adjustLight;
var UNIFORM_darken;
var UNIFORM_useNormal;
var UNIFORM_normalMap;

var positionBuffer; 
var normalBuffer;

var viewMatrix;
var projectionMatrix;
var orthoMatrix;
var mvpMatrix;

var lightAmbient = vec4(Math.random(), Math.random(), Math.random(), 1.0);
var materialAmbient = vec4(Math.random(), Math.random(), Math.random(), 1.0);
var ambientProduct = mult(lightAmbient, materialAmbient);

var lightDiffuse = vec4(0.6, 0.6, 0.6, 1.0);
var materialDiffuse = vec4(1.0, 0.0, 0.0, 1.0);
var diffuseProduct = mult(lightDiffuse, materialDiffuse);

var lightSpecular = vec4(0.4, 0.4, 0.4, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var specularProduct = mult(lightSpecular, materialSpecular);

var shininess = 50;
var lightPosition = vec3(0.0, 0.0, 0.0);

var eye = vec3(0, 0.5, 1.8);
var at = vec3(0, 0, 0);
var up = vec3(0, 1, 0);

var s = 11;
var t = 5;

var scale_enemies = vec3(0.2, 0.2, 0.2);
var scale_skybox = vec3(s, s, s);
var translate_gun = vec3(0.0, 0.0, 1.7);
var translate_enemies = [];
var direction_enemies = [];
var health_enemies = [];
var speed_enemies = vec3(0.05, 0.05, 0.05);
var switch_enemies = [];
var counter_enemies = [];
var AABB_enemies = [];
var AABB_enemies_prev = [];

var enemy_damage = 5;
var enemy_value = 5;
var enemy_health = 2;
						
var translate_bullets = [];
var direction_bullets = [];
var speed_bullets = vec3(.5, .5, .5);
var scale_bullets = vec3(.05, .05, .05);
var num_bullets = 0;
var bullet_damage = 2;
var material_bullet = vec4(0.2, 0.2, 0.2, 1.0);
var light_bullet = vec4(1.0, 1.0, 1.0, 1.0);
var AABB_bullets = [];

var scale_gun = vec3(0.1, 0.1, 1.0); 
var material_gun = vec4(1.0, 1.0, 1.0, 1.0);
var light_gun = vec4(.0, .0, .0, .0);

var translate_grenades = [];
var velocity_grenades = [];
var rotate_grenades = [];
var switch_grenades = [];
var scale_grenades = [];
var material_grenades = [];
var timer_grenades = [];
var num_grenades = 0;
var grenade_distance = .5;
var light_grenade = vec4(1.0, 1.0, 1.0, 1.0);
var grenade_damage = 100;
var AABB_grenades = [];

var translate_player = vec3(0, 0, 0);

var translate_skybox = [vec3(s, 0, 0),
			vec3(-s, 0, 0),
			vec3(0, 0, 0),
			vec3(0, t, 0),
			vec3(0, 0, 0),
			vec3(0, 0, -s)];
var skybox_PX;
var skybox_NX;
var skybox_PY;
var skybox_NY;
var skybox_PZ;
var skybox_NZ;
var skybox_NY_normal;

var myTexture;
var startTexture;
var optionTexture;
var HUDTexture;
var rulesTexture;
var jokeTexture;
var canvasTexture;
var grenTexture;
var deadTexture;
var rulesetTexture;
var deadTexture2;
var deadscoreTexture;

var x_test = 1.0;
var y_test = 1.0;
var deg = 0.0;

var num_enemies = 0;
var prev_dir = 0;
var degree = 0;
var axis = vec3(0, 1, 0);
var rotation = 0;
var player_health = 100;
var player_score = 0;
var level = 1;

var a_down = false;
var d_down = false;
var s_down = false;

var gravity_direction = vec3(0.0, -1.0, 0.0);
var gravity_magnitude = 9.8;

var selectColor = 1;
var gameMode = 0;

var startCounter = 0;

var healthAmount = 100;
var grenAmount = 5;
//cube points
    var cube_points = [];
    var cube_normals = [];
    var cube_uv = [];
///////////////////////////////////////////////////////////
var va = vec4(0.0, 0.0, -1.0, 1.0);
var vb = vec4(0.0, 0.942809, 0.333333, 1.0);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1.0);
var vd = vec4(0.816497, -0.471405, 0.333333, 1.0);

var texCoord = [
	vec2(0,0),
	vec2(0,1),
	vec2(1, 1)
];
var sun_points = [];
var sun_normals = [];
var sun_texCoordsArray = [];
generateSun(4, 0, sun_points, sun_normals, sun_texCoordsArray);

var sun_g = [];
var green = 0.3;
for (var i = 0; i < 360; i++){
	if (i < 90 || (i > 180 && i < 270))
		green+= 0.01;
	else
		green -= 0.01;
	sun_g.push(green);
	if (sun_g[i] > 1)
		sun_g[i] = 1;
}
var sun_values={
	lightPosition: vec3(0.0, 0.0, 0.0),
	ctm: mat4(),
	lm: mat4(),
	sun_theta: 0.0,
	sun_green: sun_g,
	materialAmbient: vec4( 1.0, 0.3, 0.0, 1.0 ),
	materialDiffuse: vec4( 1.0, 0.3, 0.0, 1.0 ),
	materialSpecular: vec4( 1.0, 0.3, 0.0, 1.0 ),
	materialShininess: 10.0,
	lightAmbient: vec4(0.3, 0.3, 0.3, 1.0),
	lightDiffuse: vec4(0.6, 0.6, 0.6, 1.0),
	lightSpecular: vec4(1.0, 1.0, 1.0, 1.0),
	projection: perspective(30,1,-1,1),
	diffuse: 0.3,
	spec: 0.3
}
var darkenSky = [];
var dark_value = 0.01;
for (var i = 0; i < 360; i++){
	if (i < 36 || i > 180-36)
		dark_value = 0.01;
	else if (i < 90)
		dark_value = Math.min(1.0, (dark_value+0.02));
	else
		dark_value = Math.max(0.01, (dark_value-0.02));
	darkenSky.push(dark_value);
}

var moon_points = [];
var moon_normals = [];
var moon_uv = [];
generateSphere(4, 0, moon_points, moon_normals, moon_uv);
var moon_ambient = vec4(1.0, 1.0, 1.0, 1.0);
var moon_diffuse = vec4(1.0, 1.0, 1.0, 1.0);
var moon_specular = vec4(1.0, 1.0, 1.0, 1.0);
//////////////////////////////////////////////////////////////////////


window.onload = function init()
{
	drawText();  
	drawText2();
	drawText3();
	
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    vertices = [
        vec3(  length,   length, length ), //vertex 0
        vec3(  length,  -length, length ), //vertex 1
        vec3( -length,   length, length ), //vertex 2
        vec3( -length,  -length, length ),  //vertex 3 
        vec3(  length,   length, -length ), //vertex 4
        vec3(  length,  -length, -length ), //vertex 5
        vec3( -length,   length, -length ), //vertex 6
        vec3( -length,  -length, -length )  //vertex 7   
    ];

    Cube(vertices, cube_points, cube_normals, cube_uv);
	
	//SKYBOX
	skybox_texture();
	menuTextures();
		
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    positionBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cube_points), gl.STATIC_DRAW );

    normalBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, normalBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cube_normals), gl.STATIC_DRAW );
	
    uvBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cube_uv), gl.STATIC_DRAW );

    ATTRIBUTE_position = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( ATTRIBUTE_position );

    ATTRIBUTE_normal = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray( ATTRIBUTE_normal );
	
	ATTRIBUTE_uv = gl.getAttribLocation( program, "vUV" );
    gl.enableVertexAttribArray( ATTRIBUTE_uv);
	
    gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
    gl.vertexAttribPointer( ATTRIBUTE_position, 3, gl.FLOAT, false, 0, 0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, normalBuffer );
    gl.vertexAttribPointer( ATTRIBUTE_normal, 3, gl.FLOAT, false, 0, 0 );
	
	gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );
	
    UNIFORM_mvMatrix = gl.getUniformLocation(program, "mvMatrix");
    UNIFORM_pMatrix = gl.getUniformLocation(program, "pMatrix");
    UNIFORM_ambientProduct = gl.getUniformLocation(program, "ambientProduct");
    UNIFORM_diffuseProduct = gl.getUniformLocation(program, "diffuseProduct");
    UNIFORM_specularProduct = gl.getUniformLocation(program, "specularProduct");
    UNIFORM_lightPosition = gl.getUniformLocation(program, "lightPosition");
    UNIFORM_shininess = gl.getUniformLocation(program, "shininess");
	UNIFORM_sampler = gl.getUniformLocation(program, "uSampler");
	UNIFORM_useTexture = gl.getUniformLocation(program, "useTexture");
	UNIFORM_adjustLight = gl.getUniformLocation(program, "adjustLight");
	UNIFORM_darken = gl.getUniformLocation(program, "darken");
	UNIFORM_useNormal = gl.getUniformLocation(program, "uUseNormal");
	UNIFORM_normalMap = gl.getUniformLocation(program, "uNormal");

	gl.uniform1i(UNIFORM_sampler, 0); 
	gl.uniform1i(UNIFORM_normalMap, 1); 

    viewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(90, 1, 0.001, 1000);
	orthoMatrix = ortho(-2, 2, -2, 2, -2, 2);

    timer.reset();
    gl.enable(gl.DEPTH_TEST);
	
	for(var i = 0; i < 5; i++) //spawn the initial 5 enemies
	{
		spawn_enemy();
	}
	
	canvas.onmousemove = function(e){ //mouse controls - ignore - under construction
	var x = e.clientX;
	var y = e.clientY;
	//degree = (x - canvas.width / 2)
	degree =2*(x - canvas.width/2)/canvas.width * 60;
	rotation += degree - prev_dir;
	prev_dir = degree;
	
	// for(var z = 0; z < 6; z++) {
	// translate_skybox[z] = vec3(rotation, 0, 0);
	// }	
	}
	//translate_gun[0] = degree;
    
    canvas.onmousedown = function(e){ //shoot on click - can also be used as a debug tool
	var audio = document.getElementById("shotSound");
	audio.currentTime = 0;
	audio.play();
	//temp = vec3(0, 0, 0);
	//spawn_enemy();
	//alert(counter);
	if(e.button == 0)
	{
		shoot();
	}
    };
    render();
};


function skybox_texture() //Generate textures for skybox
{
	skybox_PX = gl.createTexture();
    skybox_PX.image = new Image();
	
	skybox_PX.image.onload = function(){
		gl.bindTexture(gl.TEXTURE_2D, skybox_PX);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, skybox_PX.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
   
   skybox_PX.image.src = "./Images/fadeaway_right.jpg";
   
   skybox_NX = gl.createTexture();
   skybox_NX.image = new Image();
	
   skybox_NX.image.onload = function(){
		gl.bindTexture(gl.TEXTURE_2D, skybox_NX);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, skybox_NX.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
   
   skybox_NX.image.src = "./Images/fadeaway_left.jpg";
   
   skybox_PY = gl.createTexture();
   skybox_PY.image = new Image();
	
   skybox_PY.image.onload = function(){
		gl.bindTexture(gl.TEXTURE_2D, skybox_PY);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, skybox_PY.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
   
   skybox_PY.image.src = "./Images/fadeaway_top.jpg";
   
   
   skybox_NY = gl.createTexture();
   skybox_NY.image = new Image();
	
   skybox_NY.image.onload = function(){
		gl.bindTexture(gl.TEXTURE_2D, skybox_NY);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, skybox_NY.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
   
    skybox_NY.image.src = "./Images/snow_ground.jpg"
	
	skybox_NY_normal = gl.createTexture();
	skybox_NY_normal.image = new Image();

	skybox_NY_normal.image.onload = function(){
		gl.bindTexture(gl.TEXTURE_2D, skybox_NY_normal);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, skybox_NY_normal.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

	skybox_NY_normal.image.src = "./Images/snow_ground_normal.jpg"
	
	skybox_PZ = gl.createTexture();
    skybox_PZ.image = new Image();
	
   skybox_PZ.image.onload = function(){
		gl.bindTexture(gl.TEXTURE_2D, skybox_PZ);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, skybox_PZ.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
   
   skybox_PZ.image.src = "./Images/fadeaway_front.jpg";
   
   skybox_NZ = gl.createTexture();
   skybox_NZ.image = new Image();
	
   skybox_NZ.image.onload = function(){
		gl.bindTexture(gl.TEXTURE_2D, skybox_NZ);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, skybox_NZ.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
   
   skybox_NZ.image.src = "./Images/fadeaway_back.jpg";
}

function shoot()//generate a bullet to be shot
{
	translate_bullets[num_bullets] = subtract(vec3(0, 0, 0), translate_player);//starting location
	direction_bullets[num_bullets] = vec3(-.5 * Math.tan(-degree * Math.PI / 180), 0, -.5);//bullet direction
	AABB_bullets[num_bullets] = calculate_AABB(translate_bullets[num_bullets], length * scale_bullets[0]);
	num_bullets++;
}
function kill_bullet(i)//remove bullet actor
{
	translate_bullets.splice(i, 1); //remove data from the arrays
	direction_bullets.splice(i, 1);
	AABB_bullets.splice(i, 1);
	num_bullets--;
}

function throw_grenade(distance)
{
	translate_grenades[num_grenades] = subtract(vec3(0, .6, 1.4), translate_player);
	velocity_grenades[num_grenades] = vec3(distance * Math.tan(-degree * Math.PI / 180), -distance * 2, distance);
	rotate_grenades[num_grenades] = degree;
	switch_grenades[num_grenades] = 0;
	timer_grenades[num_grenades] = 0;
	scale_grenades[num_grenades] = vec3(.1, .1, .1);
	material_grenades[num_grenades] = vec4(0.0, .8, .2, 1.0);
	AABB_grenades[num_grenades] = calculate_AABB(translate_grenades[num_grenades], length * scale_grenades[num_grenades][0]);
	num_grenades++;
}

function kill_grenade(i)
{
	translate_grenades.splice(i, 1);
	velocity_grenades.splice(i, 1);
	rotate_grenades.splice(i, 1);
	switch_grenades.splice(i, 1);
	timer_grenades.splice(i, 1);
	scale_grenades.splice(i, 1);
	material_grenades.splice(i, 1);
	AABB_grenades.splice(i, 1);
	num_grenades--;

}

function spawn_enemy()//spawn an enemy with random movement
{
	var curr = translate_enemies.length;
	translate_enemies[curr] = vec3(Math.random() * 3 - 1.5, 0, -5);//starting location with a random x position
	//translate_enemies[curr] = vec3(0, 0, -5);
	direction_enemies[curr] = vec3(Math.random() / 2 + .2, 0, Math.random() / 4 + .1);//enemy direction with a random x and y direction
	//direction_enemies[curr] = vec3(0, 0, Math.random() / 4 + .1);
	if(Math.random() >= .5)//make the initial x direction 50/50
	{
		direction_enemies[curr][0] *= -1;
	}
	switch_enemies[curr] = true;
	counter_enemies[curr] = 0;
	AABB_enemies[curr] = calculate_AABB(translate_enemies[curr], length * scale_enemies[0]);
	AABB_enemies_prev[curr] = AABB_enemies[curr];
	health_enemies[curr] = enemy_health; //set health to the predetermined value
	num_enemies++;
}
function kill_enemy(i)//remove enemy actor
{
	translate_enemies.splice(i, 1);//remove data from the arrays
	direction_enemies.splice(i, 1);
	health_enemies.splice(i, 1);
	switch_enemies.splice(i, 1);
	counter_enemies.splice(i, 1);
	AABB_enemies.splice(i, 1);
	AABB_enemies_prev.splice(i, 1);
	num_enemies--;
}
function damage_enemy(i, damage)//damage enemy actor
{
	health_enemies[i] -= damage;//deduct the damage from the enemy's health
	if(health_enemies[i] <= 0)//if the enemy is dead
	{
		kill_enemy(i);//kill it
		player_score += enemy_value;//increment score based on the enemy's value
	}
}

function check_collision(AABB1, AABB2)
{
	if(AABB_collision(AABB1, AABB2))
	{
		return true;
	}
	else
	{
		return false;
	}
}

function check_bounce(enemy1, enemy2)
{
	if(check_collision(AABB_enemies[enemy1], AABB_enemies[enemy2]))
	{
		if(counter_enemies[enemy1] >= 20 || counter_enemies[enemy2] >= 20)
		{
			if(AABB_enemies_prev[enemy1][1][0] < AABB_enemies[enemy2][0][0] &&
			   AABB_enemies[enemy1][1][0] >= AABB_enemies[enemy2][0][0]) 
			{
				direction_enemies[enemy1][0] *= -1;
				direction_enemies[enemy2][0] *= -1;
			}
			else if(AABB_enemies_prev[enemy1][0][0] < AABB_enemies[enemy2][1][0]&&
			        AABB_enemies[enemy1][0][0] >= AABB_enemies[enemy2][1][0])
			{

				direction_enemies[enemy1][0] *= -1;
				direction_enemies[enemy2][0] *= -1;
			}
			else if(AABB_enemies_prev[enemy1][1][1] < AABB_enemies[enemy2][0][1] &&
			        AABB_enemies[enemy1][1][1] < AABB_enemies[enemy2][0][1])
			{
				direction_enemies[enemy1][2] *= -1;
				direction_enemies[enemy2][2] += direction_enemies[enemy1][2];
				
			}
			else if(AABB_enemies_prev[enemy1][0][1] < AABB_enemies[enemy2][1][1] &&
			        AABB_enemies[enemy1][0][1] < AABB_enemies[enemy2][1][1])
			{
				direction_enemies[enemy1][2] += direction_enemies[enemy2][2];
				direction_enemies[enemy2][2] *= -1;
				//direction_enemies[enemy2][2] *= -1;
			}
			counter_enemies[enemy1] = 0;
			counter_enemies[enemy2] = 0;
		}
	}
	if(switch_enemies[enemy1])
	{
		counter_enemies[enemy1]++;
		switch_enemies[enemy1] = false;
	}
	if(switch_enemies[enemy2])
	{
		counter_enemies[enemy2]++;
		switch_enemies[enemy2] = false;
	}
}


function AABB_collision(a, b)
{
	return !(a[1][0] < b[0][0] ||
	         b[1][0] < a[0][0] ||
			 a[1][1] < b[0][1] ||
			 b[1][1] < a[0][1]);
}

function calculate_AABB(position, width)
{
	 return [[position[0] - width, position[2] - width],
	        [position[0] + width, position[2] + width]];
}

function add1(v1, v2)
{
	return vec3(v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]);
}

function update_grenade(delta, i)
{
	var gravity = scale1(gravity_magnitude, gravity_direction);
	if(!(length1(velocity_grenades[i]) < .05 && (translate_grenades[i][1] - length * scale_grenades[i][0]) < 0))
	{
		velocity_grenades[i] = add1(velocity_grenades[i], scale1(delta, gravity));
		translate_grenades[i] = add1(translate_grenades[i], scale1(delta, velocity_grenades[i]));
		if(translate_grenades[i][1] <= length * scale_grenades[i][0] && switch_grenades[i] > 1)
		{
			velocity_grenades[i] = scale1(.6, velocity_grenades[i]);
			velocity_grenades[i][1] = -1 * velocity_grenades[i][1];
			switch_grenades[i] = 0;
		}
		else
		{
			switch_grenades[i]++;
		}
		return true;
	}
	else
	{
		return false;
	}
}

function menuTextures() //generate textures for menus
{
	startTexture = gl.createTexture();
    startTexture.image = new Image();
    startTexture.image.onload = function(){
	gl.bindTexture(gl.TEXTURE_2D, startTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, startTexture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
    }
	
    startTexture.image.src = "./Images/start.jpg";

	optionTexture = gl.createTexture();
    optionTexture.image = new Image();
    optionTexture.image.onload = function(){
	gl.bindTexture(gl.TEXTURE_2D, optionTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, optionTexture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
    }

	optionTexture.image.src = "./Images/options.jpg";

	jokeTexture = gl.createTexture();
    jokeTexture.image = new Image();
    jokeTexture.image.onload = function(){
	gl.bindTexture(gl.TEXTURE_2D, jokeTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, jokeTexture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
    }

	jokeTexture.image.src = "./Images/totallyavailableoptions.jpg";
/*
	HUDTexture = gl.createTexture();
    HUDTexture.image = new Image();
    HUDTexture.image.onload = function(){
	gl.bindTexture(gl.TEXTURE_2D, HUDTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, HUDTexture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
    }

	HUDTexture.image.src = "./Images/health.jpg";
*/
	rulesTexture = gl.createTexture();
    rulesTexture.image = new Image();
    rulesTexture.image.onload = function(){
	gl.bindTexture(gl.TEXTURE_2D, rulesTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rulesTexture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
    }

	rulesTexture.image.src = "./Images/rules.jpg";

	rulesetTexture = gl.createTexture();
    rulesetTexture.image = new Image();
    rulesetTexture.image.onload = function(){
	gl.bindTexture(gl.TEXTURE_2D, rulesetTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rulesetTexture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
    }

	rulesetTexture.image.src = "./Images/ruleset.jpg";

	deadTexture = gl.createTexture();
    deadTexture.image = new Image();
    deadTexture.image.onload = function(){
	gl.bindTexture(gl.TEXTURE_2D, deadTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, deadTexture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
    }

	deadTexture.image.src = "./Images/dead.jpg";

	deadTexture2 = gl.createTexture();
    deadTexture2.image = new Image();
    deadTexture2.image.onload = function(){
	gl.bindTexture(gl.TEXTURE_2D, deadTexture2);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, deadTexture2.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
    }

	deadTexture2.image.src = "./Images/death2.jpg";

	canvasTexture = gl.createTexture();
    	gl.bindTexture(gl.TEXTURE_2D, canvasTexture);
    	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('textureCanvas'));
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);

	grenTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, grenTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('textureCanvas2'));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);

	deadscoreTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, deadscoreTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('textureCanvas3'));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
}

function measureText(ctx, textToMeasure) {
	return ctx.measureText(textToMeasure).width;
}

function getPowerOfTwo(value, pow) {
      var pow = pow || 1;
      while(pow<value){
		      pow *= "2";
	      }
	      return pow;
}

function createMultilineText(ctx, textToWrite, maxWidth, text) {
    textToWrite = textToWrite.replace("\n"," ");
	var currentText = textToWrite;
	var futureText;
    var subWidth = 0;
    var maxLineWidth = 0;

        var wordArray = textToWrite.split(" ");
        var wordsInCurrent, wordArrayLength;
        wordsInCurrent = wordArrayLength = wordArray.length;

        while (measureText(ctx, currentText) > maxWidth && wordsInCurrent > 1) {
          wordsInCurrent--;
          var linebreak = false;

          currentText = futureText = "";
          for(var i = 0; i < wordArrayLength; i++) {
			      if (i < wordsInCurrent) {
				      currentText += wordArray[i];
				      if (i+1 < wordsInCurrent) { currentText += " "; }
			      }   
			      else {
				      futureText += wordArray[i];
				      if( i+1 < wordArrayLength) { futureText += " "; }
			      }
		      }
	      }
	      text.push(currentText);
	      maxLineWidth = measureText(ctx, currentText);
	
	      if(futureText) {
		      subWidth = createMultilineText(ctx, futureText, maxWidth, text);
		      if (subWidth > maxLineWidth) { 
			      maxLineWidth = subWidth;
		      }
	      }
	
	      return maxLineWidth;
}

function drawText() {
	      var canvasX, canvasY;
	      var textX, textY;

	      var text = [];
	      var textToWrite = "Health: " + player_health;
	
	      var maxWidth = 256;
	
	      var squareTexture = 1;
	
	      var textHeight = 256;
	      var textAlignment = "center";
	      var textColour = "white"
	      var fontFamily = "monospace";
	
	      var backgroundColour = "black";
	
	      var canvas = document.getElementById('textureCanvas');
	      var ctx = canvas.getContext('2d');
	
	      ctx.font = textHeight+"px "+fontFamily;
	      if (maxWidth && measureText(ctx, textToWrite) > maxWidth ) {
		      maxWidth = createMultilineText(ctx, textToWrite, maxWidth, text);
		      canvasX = getPowerOfTwo(maxWidth);
	      } else {
		      text.push(textToWrite);
		      canvasX = getPowerOfTwo(ctx.measureText(textToWrite).width);
	      }
	      canvasY = getPowerOfTwo(textHeight*(text.length+1)); 
	      if(squareTexture) {
		      (canvasX > canvasY) ? canvasY = canvasX : canvasX = canvasY;
	      }

	      canvas.width = canvasX;
	      canvas.height = canvasY;
	
	      switch(textAlignment) {
		      case "left":
			      textX = 0;
			      break;
		      case "center":
			      textX = canvasX/2;
			      break;
		      case "right":
			      textX = canvasX;
			      break;
	      }
	      textY = canvasY/2;
	
	      ctx.fillStyle = backgroundColour;
	      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	
	      ctx.fillStyle = textColour;
	      ctx.textAlign = textAlignment;
	
	      ctx.textBaseline = 'middle'; // top, middle, bottom
	      ctx.font = textHeight+"px "+fontFamily;
	
	      var offset = (canvasY - textHeight*(text.length+1)) * 0.5;
	
	      for(var i = 0; i < text.length; i++) {
		      if(text.length > 1) {
			      textY = (i+1)*textHeight + offset;
		      }
		      ctx.fillText(text[i], textX,  textY);
	      }
      }

function drawText2(){
		var canvasX, canvasY;
	      var textX, textY;

	      var text = [];
	      var textToWrite = "Grenades: " + grenAmount;
	
	      var maxWidth = 256;
	
	      var squareTexture = 1;
	
	      var textHeight = 256;
	      var textAlignment = "center";
	      var textColour = "white"
	      var fontFamily = "monospace";
	
	      var backgroundColour = "black";
	
	      var canvas = document.getElementById('textureCanvas2');
	      var ctx = canvas.getContext('2d');
	
	      ctx.font = textHeight+"px "+fontFamily;
	      if (maxWidth && measureText(ctx, textToWrite) > maxWidth ) {
		      maxWidth = createMultilineText(ctx, textToWrite, maxWidth, text);
		      canvasX = getPowerOfTwo(maxWidth);
	      } else {
		      text.push(textToWrite);
		      canvasX = getPowerOfTwo(ctx.measureText(textToWrite).width);
	      }
	      canvasY = getPowerOfTwo(textHeight*(text.length+1)); 
	      if(squareTexture) {
		      (canvasX > canvasY) ? canvasY = canvasX : canvasX = canvasY;
	      }

	      canvas.width = canvasX;
	      canvas.height = canvasY;
	
	      switch(textAlignment) {
		      case "left":
			      textX = 0;
			      break;
		      case "center":
			      textX = canvasX/2;
			      break;
		      case "right":
			      textX = canvasX;
			      break;
	      }
	      textY = canvasY/2;
	
	      ctx.fillStyle = backgroundColour;
	      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	
	      ctx.fillStyle = textColour;
	      ctx.textAlign = textAlignment;
	
	      ctx.textBaseline = 'middle'; // top, middle, bottom
	      ctx.font = textHeight+"px "+fontFamily;
	
	      var offset = (canvasY - textHeight*(text.length+1)) * 0.5;
	
	      for(var i = 0; i < text.length; i++) {
		      if(text.length > 1) {
			      textY = (i+1)*textHeight + offset;
		      }
		      ctx.fillText(text[i], textX,  textY);
	      }
}

function drawText3() {
	      var canvasX, canvasY;
	      var textX, textY;

	      var text = [];
	      var textToWrite = "Your Score: " + player_score;
	
	      var maxWidth = 256;
	
	      var squareTexture = 1;
	
	      var textHeight = 256;
	      var textAlignment = "center";
	      var textColour = "white"
	      var fontFamily = "monospace";
	
	      var backgroundColour = "black";
	
	      var canvas = document.getElementById('textureCanvas3');
	      var ctx = canvas.getContext('2d');
	
	      ctx.font = textHeight+"px "+fontFamily;
	      if (maxWidth && measureText(ctx, textToWrite) > maxWidth ) {
		      maxWidth = createMultilineText(ctx, textToWrite, maxWidth, text);
		      canvasX = getPowerOfTwo(maxWidth);
	      } else {
		      text.push(textToWrite);
		      canvasX = getPowerOfTwo(ctx.measureText(textToWrite).width);
	      }
	      canvasY = getPowerOfTwo(textHeight*(text.length+1)); 
	      if(squareTexture) {
		      (canvasX > canvasY) ? canvasY = canvasX : canvasX = canvasY;
	      }

	      canvas.width = canvasX;
	      canvas.height = canvasY;
	
	      switch(textAlignment) {
		      case "left":
			      textX = 0;
			      break;
		      case "center":
			      textX = canvasX/2;
			      break;
		      case "right":
			      textX = canvasX;
			      break;
	      }
	      textY = canvasY/2;
	
	      ctx.fillStyle = backgroundColour;
	      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	
	      ctx.fillStyle = textColour;
	      ctx.textAlign = textAlignment;
	
	      ctx.textBaseline = 'middle'; // top, middle, bottom
	      ctx.font = textHeight+"px "+fontFamily;
	
	      var offset = (canvasY - textHeight*(text.length+1)) * 0.5;
	
	      for(var i = 0; i < text.length; i++) {
		      if(text.length > 1) {
			      textY = (i+1)*textHeight + offset;
		      }
		      ctx.fillText(text[i], textX,  textY);
	      }
      }

window.addEventListener('keydown', function(event){
	if(event.keyCode == 73){		//i, move in
		myTexture.image.src = "./Images/test2.jpg";
		window.requestAnimFrame( render );
	}
	if (event.keyCode == 38){		//up arrow
		if (selectColor == 3){
			selectColor = 2;
		}
		else if (selectColor == 2){
			selectColor = 1;
		}
	}
	if (event.keyCode == 40){		//down arrow
		if (selectColor == 1){
			selectColor = 2;
		}
		else if (selectColor == 2){
			selectColor = 3;
		}
	}
	if (event.keyCode == 13){		//enter
		if (gameMode != 4){
			gameMode = selectColor;
		}
	}
	if (event.keyCode == 8){		//backspace
		if (gameMode != 0 && gameMode != 1 && gameMode != 4){
			gameMode = 0;			//if we are on the options or rules page, backspace will return us to main menu
		}
	}
	if (event.keyCode == 72){		//'h' for testing
		player_health -= 5;
		if (player_health == 0){
			gameMode = 4;
		}
		grenAmount += 1;
		drawText();
		drawText2();
		canvasTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, canvasTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('textureCanvas')); // This is the important line!
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
		grenTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, grenTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('textureCanvas2')); // This is the important line!
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
	if(event.keyCode == 65)
	{
		a_down = true;
	}
	if(event.keyCode ==  68)
	{
		d_down = true;
	}
	if(event.keyCode == 83 && grenAmount > 0)
	{
		s_down = true;
	}
});

window.addEventListener('keyup', function(event)
{
	if(event.keyCode == 65)
	{
		a_down = false;
	}
	if(event.keyCode ==  68)
	{
		d_down = false;
	}
	if(event.keyCode == 83 && grenAmount > 0)
	{
		throw_grenade(grenade_distance);
		grenAmount--;
		grenade_distance = .5;
		s_down = false;
		drawText2();
		grenTexture = gl.createTexture();
	gl.pixelStorei(gl.UNPACK_FLIP_X_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, grenTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('textureCanvas2')); // This is the important line!
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
	}
}, true);

function render_Skybox_Textures()
{
		gl.uniform1f(UNIFORM_darken,  darkenSky[Math.floor(sun_values.sun_theta)%360]);
	var ctm = mat4();
	
		//Skybox Right Side
		ctm = mult(ctm, viewMatrix);
		ctm = mult(ctm, translate(add(translate_player, translate_skybox[0])));
		ctm = mult(ctm, scale(scale_skybox));
		
		ctm = mult(ctm, rotate(90, vec3(0, -1, 0)));
		ctm = mult(rotate(degree, vec3(0, 1, 0)), ctm);

		gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(ctm));
		gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));

		gl.uniform1f(UNIFORM_useNormal, 0.0); // Not to use the normal texture
		
		gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, skybox_PX);
	
		gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
		gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
		gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
		gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		gl.uniform1f(UNIFORM_shininess,  shininess);
		gl.uniform1i(UNIFORM_sampler, 0);
		gl.uniform1f(UNIFORM_useTexture,  useTexture);

		gl.drawArrays( gl.TRIANGLES, 0, 8);
		
		//Skybox left Side
		ctm = mat4();
	   	ctm = mult(ctm, viewMatrix);
		ctm = mult(ctm, translate(add(translate_player, translate_skybox[1])));
		ctm = mult(ctm, scale(scale_skybox));
		
		ctm = mult(ctm, rotate(90, [0, 1, 0]));
		ctm = mult(rotate(degree, vec3(0, 1, 0)), ctm);

		gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(ctm));
		gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));
		
		gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, skybox_NX);
	
		gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
		gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
		gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
		gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		gl.uniform1f(UNIFORM_shininess,  shininess);
		gl.uniform1i(UNIFORM_sampler, 0);
		gl.uniform1f(UNIFORM_useTexture,  useTexture);

		gl.drawArrays( gl.TRIANGLES, 0, 8);
		
		//Skybox Top Side
		ctm = mat4();
		ctm = mult(ctm, viewMatrix);
		ctm = mult(ctm, translate(add(translate_player, translate_skybox[2])));
		ctm = mult(ctm, scale(scale_skybox));
		
		ctm = mult(ctm, rotate(90, [-1, 0, 0]));
		ctm = mult(rotate(degree, vec3(0, 1, 0)), ctm);

		gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(ctm));
		gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));
		
		gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, skybox_PY);
	
		gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
		gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
		gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
		gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		gl.uniform1f(UNIFORM_shininess,  shininess);
		gl.uniform1i(UNIFORM_sampler, 0);
		gl.uniform1f(UNIFORM_useTexture,  useTexture);

		gl.drawArrays( gl.TRIANGLES, 0, 8);
		
		//Skybox Bottom Side
		ctm = mat4();
		ctm = mult(ctm, viewMatrix);
		ctm = mult(ctm, translate(add(translate_player, translate_skybox[3])));
		//ctm = mult(ctm, scale(vec3(s,s,35)));
		ctm = mult(ctm, scale(scale_skybox));
		
		ctm = mult(ctm, rotate(90, vec3(1, 0, 0)));
		ctm = mult(rotate(degree, vec3(0, 1, 0)), ctm);

		gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(ctm));
		gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));

		gl.uniform1f(UNIFORM_useNormal, 1.0); // To use the normal texture
		
		gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, skybox_NY);
		gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, skybox_NY_normal);
	
		gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
		gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
		gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
		gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		gl.uniform1f(UNIFORM_shininess,  shininess);
		gl.uniform1i(UNIFORM_sampler, 0);
		gl.uniform1f(UNIFORM_useTexture,  useTexture);

		gl.drawArrays( gl.TRIANGLES, 0, 8);
		
		//Skybox front Side
		ctm = mat4();
		ctm = mult(ctm, viewMatrix);
		ctm = mult(ctm, translate(add(translate_player, translate_skybox[4])));
		ctm = mult(ctm, scale(scale_skybox));
		ctm = mult(rotate(degree, vec3(0, 1, 0)), ctm);
		
		gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(ctm));
		gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));

		gl.uniform1f(UNIFORM_useNormal, 0.0); // Not to use the normal texture
		
		gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, skybox_PZ);
	
		gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
		gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
		gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
		gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		gl.uniform1f(UNIFORM_shininess,  shininess);
		gl.uniform1i(UNIFORM_sampler, 0);
		gl.uniform1f(UNIFORM_useTexture,  useTexture);

		gl.drawArrays( gl.TRIANGLES, 0, 8);
		
		//Skybox Back Side
		ctm = mat4();
		ctm = mult(ctm, viewMatrix);
		ctm = mult(ctm, translate(add(translate_player, translate_skybox[5])));
		ctm = mult(ctm, scale(scale_skybox));
		ctm = mult(rotate(degree, vec3(0, 1, 0)), ctm);
		
		gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(ctm));
		gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));
		
		gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, skybox_NZ);
	
		gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
		gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
		gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
		gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		gl.uniform1f(UNIFORM_shininess,  shininess);
		gl.uniform1i(UNIFORM_sampler, 0);
		gl.uniform1f(UNIFORM_useTexture,  useTexture);


		gl.drawArrays( gl.TRIANGLES, 0, 8);
		gl.uniform1f(UNIFORM_darken,  1.0);
		
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	if (gameMode == 0){
	
	useTexture = 1.0;
	render_Skybox_Textures();
	//MENUS
		 var mvMatrix = viewMatrix;
		 mvMatrix = mult(translate(0, 1.0, 0), mvMatrix);

		 if (selectColor == 1){
			 startTexture.image.src = "./Images/startSelected.jpg";
		 }
		 else{
			 startTexture.image.src = "./Images/start.jpg";
		 }

		 gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
		 gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(orthoMatrix));

		 gl.activeTexture(gl.TEXTURE0);
		 gl.bindTexture(gl.TEXTURE_2D, startTexture);

		 gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		 gl.uniform1f(UNIFORM_shininess,  shininess);
		 gl.uniform1i(UNIFORM_sampler, 0);
		 gl.uniform1f(UNIFORM_useTexture,  useTexture);

		 gl.drawArrays( gl.TRIANGLES, 0, 8);

		 projectionMatrix = perspective(90, 1, 0.001, 1000);

		 mvMatrix = viewMatrix;
		 mvMatrix = mult(translate(0, 0, 0), mvMatrix);

		 if (selectColor == 2){
			 optionTexture.image.src = "./Images/optionsSelected.jpg";
		 }
		 else{
			 optionTexture.image.src = "./Images/options.jpg";
		 }

		 gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
		 gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(orthoMatrix));

		 gl.activeTexture(gl.TEXTURE0);
		 gl.bindTexture(gl.TEXTURE_2D, optionTexture);

		 gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		 gl.uniform1f(UNIFORM_shininess,  shininess);
		 gl.uniform1i(UNIFORM_sampler, 0);
		 gl.uniform1f(UNIFORM_useTexture,  useTexture);

		 gl.drawArrays( gl.TRIANGLES, 0, 8);

		 mvMatrix = viewMatrix;
		 mvMatrix = mult(translate(0, -1, 0), mvMatrix);

		 if (selectColor == 3){
			 rulesTexture.image.src = "./Images/rulesSelected.jpg";
		 }
		 else{
			 rulesTexture.image.src = "./Images/rules.jpg";
		 }

		 gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
		 gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(orthoMatrix));

		 gl.activeTexture(gl.TEXTURE0);
		 gl.bindTexture(gl.TEXTURE_2D, rulesTexture);

		 gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		 gl.uniform1f(UNIFORM_shininess,  shininess);
		 gl.uniform1i(UNIFORM_sampler, 0);
		 gl.uniform1f(UNIFORM_useTexture,  useTexture);

		 gl.drawArrays( gl.TRIANGLES, 0, 8);
	 }
	else if (gameMode == 1){		//
		if (startCounter == 0){
			timer.reset();
			level = 1;
			startCounter = 1;
		}
		////////////
		//DRAW SUN
		//
		setup_sun(sun_values);
		load_sun_to_GPU(sun_values);
		gl.drawArrays( gl.TRIANGLES, 0, sun_points.length);


		load_originals();
		////////////
		useTexture = 1.0;

		render_Skybox_Textures();
		
		var delta = timer.getElapsedTime() / 1000;
		time += delta;
		counter += delta;
		mvMatrix = viewMatrix;
		 mvMatrix = mult(mvMatrix, scale(-1, 1, 1));
		 mvMatrix = mult(translate(-1.5, -1.5, 0), mvMatrix);

		 gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
		 gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(orthoMatrix));

		 gl.activeTexture(gl.TEXTURE0);
		 gl.bindTexture(gl.TEXTURE_2D, canvasTexture);

		 gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		 gl.uniform1f(UNIFORM_shininess,  shininess);
		 gl.uniform1i(UNIFORM_sampler, 0);
		 gl.uniform1f(UNIFORM_useTexture,  useTexture);

		 gl.drawArrays( gl.TRIANGLES, 0, 8);

		 mvMatrix = viewMatrix;
		 mvMatrix = mult(mvMatrix, scale(-1, 1, 1));
		 mvMatrix = mult(translate(-0.5, -1.5, 0), mvMatrix);

		 gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
		 gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(orthoMatrix));

		 gl.activeTexture(gl.TEXTURE0);
		 gl.bindTexture(gl.TEXTURE_2D, grenTexture);

		 gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		 gl.uniform1f(UNIFORM_shininess,  shininess);
		 gl.uniform1i(UNIFORM_sampler, 0);
		 gl.uniform1f(UNIFORM_useTexture,  useTexture);

		 gl.drawArrays( gl.TRIANGLES, 0, 8);

		 	useTexture = 0.0;
	ambientProduct = mult(lightAmbient, materialAmbient);
	//var ctm = mat4()
	if(a_down == true && translate_player[0] <= 1)
	{
		translate_player = add(translate_player, vec3(.02, 0, 0));
	}
	if(d_down == true && translate_player[0] >= -1)
	{
		translate_player = subtract(translate_player, vec3(.02, 0, 0));
	}
	if(s_down == true && grenade_distance <= 2.5)
	{
		grenade_distance += .05;
	}
	for(var i = 0; i < num_enemies; i++)//loop through all the enemies and do the proper transformations and frame checks
	{
		//x-axis canvas boundaries
		if(translate_enemies[i][0] >= 2.5 || translate_enemies[i][0] <= -2.5 ){
        direction_enemies[i][0] = -(direction_enemies[i][0]);//have enemy bounce when they hit x boundaries
		if(translate_enemies[i][0] >= 2.5)
		{
			translate_enemies[i][0] = 2.5;
		}
		else
		{
			translate_enemies[i][0] = -2.5;
		}
		//direction_enemies[i][2] += 0.05;
		}
		if(translate_enemies[i][2] < -5)
		{
			direction_enemies[i][2] *= -1;
		}
		
		//y-axis canvas boundaries(if the enemies move in the y-axis
/*		if(translate_enemies[i][1] + length * scale_enemies[1] >= 2 || translate_enemies[i][1] - length * scale_enemies[1] <= -0.5){
        direction_enemies[i][1] = -direction_enemies[i][1];
		//direction_enemies[i][2] = 0.5;
		}*/
		
		translate_enemies[i] = add(translate_enemies[i], vec3(speed_enemies[0]*direction_enemies[i][0], speed_enemies[1]*direction_enemies[i][1], speed_enemies[2]*direction_enemies[i][2]));
		
		ctm = mat4();
		
		ctm = mult(ctm, viewMatrix);

		ctm = mult(ctm, translate(vec3(0, 0, 1.8)));
		ctm = mult(ctm, rotate(degree, [0, 1, 0]));

		ctm = mult(ctm, translate(add(translate_player, translate_enemies[i])));
		ctm = mult(ctm, scale(scale_enemies));
		
		ctm = mult(ctm, rotate(time*omega, [2, 3, 1]));

		gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(ctm));
		gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));
		
		// gl.activeTexture(gl.TEXTURE0);
        // gl.bindTexture(gl.TEXTURE_2D, myTexture);
	
		gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
		gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
		gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
		gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		gl.uniform1f(UNIFORM_shininess,  shininess);
		//gl.uniform1i(UNIFORM_sampler, 0);
		gl.uniform1f(UNIFORM_useTexture,  useTexture);

		gl.drawArrays( gl.TRIANGLES, 0, 36);
		AABB_enemies_prev[i] = AABB_enemies[i];
		AABB_enemies[i] = calculate_AABB(translate_enemies[i], length * scale_enemies[0]);
		for(var j = i + 1; j < num_enemies; j++)
		{
			check_bounce(i, j);
		}
		//z-axis canvas boundaries
		if(translate_enemies[i][2] + length * scale_enemies[2] >= 1.8 || translate_enemies[i][2] - length * scale_enemies[2] <= -10){
      		kill_enemy(i);//remove enemy when they hit the player
			player_health -= enemy_damage;//have the player take damage based on enemy damage
			if (player_health <= 0){
				gameMode = 4;
			}
			i--;//reloop
			drawText();
			gl.bindTexture(gl.TEXTURE_2D, canvasTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('textureCanvas')); // This is the important line!
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}
	for(var i = 0; i < num_enemies; i++)
	{
		switch_enemies[i] = true;
	}
	//useTexture = 0.0;
	ambientProduct = mult(light_bullet, material_bullet);
	//points
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(sun_points), gl.STATIC_DRAW);
	gl.vertexAttribPointer( ATTRIBUTE_position, 3, gl.FLOAT, false, 0, 0 );
		//normals
		gl.bindBuffer( gl.ARRAY_BUFFER, normalBuffer);
		gl.bufferData( gl.ARRAY_BUFFER, flatten(sun_points), gl.STATIC_DRAW );
		gl.vertexAttribPointer( ATTRIBUTE_normal, 3, gl.FLOAT, false, 0, 0 );
	//texture
	gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(sun_texCoordsArray), gl.STATIC_DRAW );
	gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );
	for(var i = 0; i < num_bullets; i++)//loop through all the bullets and do the proper transformations and frame checks
	{
		translate_bullets[i] = add(translate_bullets[i], vec3(speed_bullets[0]*direction_bullets[i][0], speed_bullets[1]*direction_bullets[i][1], speed_bullets[2]*direction_bullets[i][2]));
		ctm = mat4();
		
		ctm = mult(ctm, viewMatrix);
		ctm = mult(ctm, translate(vec3(0, 0, 1.8)));
		ctm = mult(ctm, rotate(degree, [0, 1,0]));
		ctm = mult(ctm, translate(vec3(0, 0, 0)));
		ctm = mult(ctm, translate(add(translate_bullets[i], translate_player)));
		ctm = mult(ctm, scale(scale_bullets));
		ctm = mult(ctm, rotate(time*omega, [2, 3, 1]));

		gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(ctm));
		gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));
		
		gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
		gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
		gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
		gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		gl.uniform1f(UNIFORM_shininess,  shininess);
		gl.uniform1f(UNIFORM_useTexture,  useTexture);

		gl.drawArrays( gl.TRIANGLES, 0, sun_points.length);
		if(translate_bullets[i][2] <= -8)//if bullet reaches edge of map
		{
			kill_bullet(i);//remove it
			i--;//reloop
		}
		else
		{
			AABB_bullets[i] = calculate_AABB(translate_bullets[i], length * scale_bullets[0]);
			for(var j = 0; j < num_enemies; j++)
			{
				if(check_collision(AABB_bullets[i], AABB_enemies[j]))//otherwise check the bullet with every enemy for a collision
				{
					kill_bullet(i);//remove bullet
					damage_enemy(j, bullet_damage);//damage enemy
					i--;
					break;//if we get a successful collision then stop checking enemies because the bullet is dead and reloop
					
				}
			}
		}
	}

	for(var i = 0; i < num_grenades; i++)
	{
		ambientProduct = mult(light_grenade, material_grenades[i]);
		ctm = mat4();
		ctm = mult(ctm, viewMatrix);
		ctm = mult(ctm, translate(vec3(0, 0, 1.4)));
		ctm = mult(ctm, rotate(degree, [0, 1,0]));
		ctm = mult(ctm, translate(vec3(0, 0, -1.4)));
		ctm = mult(ctm, translate(add(translate_grenades[i], translate_player)));
		ctm = mult(ctm, rotate(-rotate_grenades[i], [0, 1, 0]));
		ctm = mult(ctm, scale(scale_grenades[i]));
		

		gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(ctm));
		gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));
		
		gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
		gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
		gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
		gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		gl.uniform1f(UNIFORM_shininess,  shininess);
		gl.uniform1f(UNIFORM_useTexture,  useTexture);

		gl.drawArrays( gl.TRIANGLES, 0, sun_points.length);

		
		if(!update_grenade(-delta, i))
		{
			if(timer_grenades[i] == 6)
			{
				material_grenades[i] = vec4(1, 1, 0, 0);
				scale_grenades[i] = vec3(1, 1, 1);
			}
			if(timer_grenades[i] >= 6)
			{
				material_grenades[i][1] -= .1;
				AABB_grenades[i] = calculate_AABB(add(translate_grenades[i], vec3(0, 0, -1.4)), length * scale_grenades[i][0]);
				for(var j = 0; j < num_enemies; j++)
				{
					if(check_collision(AABB_grenades[i], AABB_enemies[j]))
					{
						damage_enemy(j, grenade_damage);
					}
				}
			}
			if(timer_grenades[i] <= 8)
			{
				scale_grenades[i] = add(scale_grenades[i], vec3(.2, .2, .2));
			}
			if (timer_grenades[i] >= 8){
				document.getElementById("grenadeSound").play();
			}
			if(timer_grenades[i] >= 20)
			{
				kill_grenade(i);
				i--;
			}
			timer_grenades[i]++;
		}
	}

		load_originals();
	var hours = Math.floor(time.toFixed(1)/3600);
	var minutes = Math.floor((time.toFixed(1)/60) % 60);
	var seconds = Math.floor(time.toFixed(1) % 60);
	
	//generate enemies
	if(counter >= 1)
	{
		spawn_enemy();
		counter = 0;
	}
	//calculate all the values that scale with the level
	//ALL VALUES ARE SUBJECT TO CHANGE AND ARE CURRENTLY FOR TESTING PURPOSES
	enemy_damage = 4 + level;
	enemy_value = 4 + level;
	if(enemy_health <= 6)
	{
		enemy_health = 1 + level / 2;
	}
	
	if(time >= 15.0 * level)
	{
		level++;
		lightAmbient = vec4(Math.random(), Math.random(), Math.random(), 1.0);
      	materialAmbient = vec4(Math.random(), Math.random(), Math.random(), 1.0);
	}
	
	//GUN
	
	// var rotategun = rotate(40*time, vec3(0, 1, 0));
	// var makeTranslation = translate(vec3(0.5, 0, 0.5));
	// var moveToRotationPoint  = rotate(deg, vec3(x_test, y_test, 0));
	//lightAmbient = vec4(0.0, 0.7, 0.0, 1.0);
	//materialAmbient = vec4(0.0, 1.0, 0.0, 1.0);
	ambientProduct = mult(light_gun, material_gun);
		
	ctm = mat4();
    ctm = mult(ctm, viewMatrix);
	ctm = mult(ctm, translate(translate_gun));
    ctm = mult(ctm, scale(scale_gun));
    ctm = mult(ctm, rotate(deg, [1, 0, 0]));
	
    gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(ctm));
	gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix) );
   
    gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
    gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
    gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
    gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
    gl.uniform1f(UNIFORM_shininess,  shininess);
	gl.uniform1f(UNIFORM_useTexture,  useTexture);
	
    gl.drawArrays( gl.TRIANGLES, 0, 36);
	
	document.getElementById('time').innerHTML = hours + ":" + minutes + ":" + seconds;
    document.getElementById('player_score').innerHTML = player_score;
	document.getElementById('player_health').innerHTML = player_health;
	document.getElementById('level').innerHTML = level;
	 }
	 else if (gameMode == 2){		//options
		 useTexture = 1.0;
		 render_Skybox_Textures();
		 mvMatrix = viewMatrix;
		 mvMatrix = mult(mvMatrix, scale(3.5, 3.5, 3.5));
		 mvMatrix = mult(translate(0, 0.5, 0), mvMatrix);

		 gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
		 gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(orthoMatrix));

		 gl.activeTexture(gl.TEXTURE0);
		 gl.bindTexture(gl.TEXTURE_2D, jokeTexture);

		 gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		 gl.uniform1f(UNIFORM_shininess,  shininess);
		 gl.uniform1i(UNIFORM_sampler, 0);
		 gl.uniform1f(UNIFORM_useTexture,  useTexture);

		 gl.drawArrays( gl.TRIANGLES, 0, 8);
	 }
	 else if (gameMode == 3){		//rules
		 useTexture = 1.0;
		 render_Skybox_Textures();

		 mvMatrix = viewMatrix;
		 mvMatrix = mult(mvMatrix, scale(3.5, 3.5, 3.5));
		 mvMatrix = mult(translate(0, 0.5, 0), mvMatrix);

		 gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
		 gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(orthoMatrix));

		 gl.activeTexture(gl.TEXTURE0);
		 gl.bindTexture(gl.TEXTURE_2D, rulesetTexture);

		 gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		 gl.uniform1f(UNIFORM_shininess,  shininess);
		 gl.uniform1i(UNIFORM_sampler, 0);
		 gl.uniform1f(UNIFORM_useTexture,  useTexture);

		 gl.drawArrays( gl.TRIANGLES, 0, 8);
	 }
	 else if (gameMode == 4){		//ded
		 useTexture = 1.0;
		 render_Skybox_Textures();
		 mvMatrix = viewMatrix;
		 mvMatrix = mult(translate(0, 1.0, 0), mvMatrix);

		 gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
		 gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(orthoMatrix));

		 gl.activeTexture(gl.TEXTURE0);
		 gl.bindTexture(gl.TEXTURE_2D, deadTexture);

		 gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		 gl.uniform1f(UNIFORM_shininess,  shininess);
		 gl.uniform1i(UNIFORM_sampler, 0);
		 gl.uniform1f(UNIFORM_useTexture,  useTexture);

		 gl.drawArrays( gl.TRIANGLES, 0, 8);

		 drawText3();

		 deadscoreTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, deadscoreTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('textureCanvas3'));
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);

		 mvMatrix = viewMatrix;
		 mvMatrix = mult(mvMatrix, scale(-1, 1, 1));

		 gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
		 gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(orthoMatrix));

		 gl.activeTexture(gl.TEXTURE0);
		 gl.bindTexture(gl.TEXTURE_2D, deadscoreTexture);

		 gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		 gl.uniform1f(UNIFORM_shininess,  shininess);
		 gl.uniform1i(UNIFORM_sampler, 0);
		 gl.uniform1f(UNIFORM_useTexture,  useTexture);

		 gl.drawArrays( gl.TRIANGLES, 0, 8);

		 mvMatrix = viewMatrix;
		 mvMatrix = mult(translate(0, -1.0, 0), mvMatrix);

		 gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
		 gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(orthoMatrix));

		 gl.activeTexture(gl.TEXTURE0);
		 gl.bindTexture(gl.TEXTURE_2D, deadTexture2);

		 gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		 gl.uniform1f(UNIFORM_shininess,  shininess);
		 gl.uniform1i(UNIFORM_sampler, 0);
		 gl.uniform1f(UNIFORM_useTexture,  useTexture);

		 gl.drawArrays( gl.TRIANGLES, 0, 8);
	 }
	useTexture = 1.0;
		
    window.requestAnimFrame( render );
}

function Cube(vertices, points, normals, uv){
    Quad(vertices, points, normals, 0, 1, 2, 3, vec3(0, 0, 1), uv);
    Quad(vertices, points, normals, 4, 0, 6, 2, vec3(0, 1, 0), uv);
    Quad(vertices, points, normals, 4, 5, 0, 1, vec3(1, 0, 0), uv);
    Quad(vertices, points, normals, 2, 3, 6, 7, vec3(1, 0, 1), uv);
    Quad(vertices, points, normals, 6, 7, 4, 5, vec3(0, 1, 1), uv);
    Quad(vertices, points, normals, 1, 5, 3, 7, vec3(1, 1, 0 ), uv);
//        Quad(vertices, points, normals, 2, 3, 6, 7, vec3(-1, 0, 0), uv);
//    Quad(vertices, points, normals, 6, 7, 4, 5, vec3(0, 0, -1), uv);
//    Quad(vertices, points, normals, 1, 5, 3, 7, vec3(0, -1, 0 ), uv);
}

function Quad( vertices, points, normals, v1, v2, v3, v4, normal, uv){

    normals.push(normal);
    normals.push(normal);
    normals.push(normal);
    normals.push(normal);
    normals.push(normal);
    normals.push(normal);
	
    uv.push(vec2(0,0));
    uv.push(vec2(1,0));
    uv.push(vec2(1,1));
    uv.push(vec2(0,0));
    uv.push(vec2(1,1));
    uv.push(vec2(0,1));
	
    points.push(vertices[v1]);
    points.push(vertices[v3]);
    points.push(vertices[v4]);
    points.push(vertices[v1]);
    points.push(vertices[v4]);
    points.push(vertices[v2]);
}
/*
function tetrahedron(a, b, c, d, points, normals, n)
{
	divideTriangle(a, b, c, points, normals, n);
	divideTriangle(d, c, b, points, normals, n);
	divideTriangle(a, d, b, points, normals, n);
	divideTriangle(a, c, d, points, normals, n);
}

function divideTriangle(a, b, c, points, normals, count)
{
	if(count > 0)
	{
		var ab = mix(a, b, 0.5);
		var ac = mix(a, c, 0.5);
		var bc = mix(b, c, 0.5);
		ab = normalize (ab, true);
		ac = normalize (ac, true);
		bc = normalize (bc, true);
		divideTriangle(a, ab, ac, points, normals, count - 1);
		divideTriangle(ab, b, bc, points, normals, count - 1);
		divideTriangle(bc, c, ac, points, normals, count - 1);
		divideTriangle(ab, bc, ac, points, normals, count - 1);
	}
	else
	{
		triangle(a, b, c, points, normals);
	}
}

function triangle(a, b, c, points, normals)
{
	var t1 = subtract(b, a);
	var t2 = subtract(c, a);
	var normal;
	normals.push(negate(a));
	normals.push(negate(b));
	normals.push(negate(c));

	points.push(a);
	points.push(b);
	points.push(c);
}*/

//sphere generation

function triangle(a, b, c, flat, pointsArray, normalsArray, texCoordsArray){
	var a3 = vec3(a);
	var b3 = vec3(b);
	var c3 = vec3(c);
	if (flat){
		var t1 = subtract(b, a);
		var t2 = subtract(c, a);
		var normal = normalize(cross(t1, t2));
		normal = vec4(normal);
		var normal3 = vec3(normal);

		normalsArray.push(normal3);
		normalsArray.push(normal3);
		normalsArray.push(normal3);	
	}
	else{
		normalsArray.push(a3);
		normalsArray.push(b3);
		normalsArray.push(c3);	
	}
	pointsArray.push(a3);
	pointsArray.push(b3);
	pointsArray.push(c3);

	texCoordsArray.push(texCoord[0]);
	texCoordsArray.push(texCoord[1]);
	texCoordsArray.push(texCoord[2]);

};

function divideTriangle(a, b, c, count, flat, pointsArray, normalsArray, texCoordsArray){
	if ( count > 0 ) {
        	var ab = mix( a, b, 0.5);
        	var ac = mix( a, c, 0.5);
        	var bc = mix( b, c, 0.5);
                
        	ab = normalize(ab, true);
        	ac = normalize(ac, true);
        	bc = normalize(bc, true);
                                
        	divideTriangle( a, ab, ac, count - 1, flat, pointsArray, normalsArray, texCoordsArray);
        	divideTriangle( ab, b, bc, count - 1, flat, pointsArray, normalsArray, texCoordsArray);
       		divideTriangle( bc, c, ac, count - 1, flat, pointsArray, normalsArray, texCoordsArray);
        	divideTriangle( ab, bc, ac, count - 1, flat, pointsArray, normalsArray, texCoordsArray);
	}
	else
		triangle( a, b, c, flat, pointsArray, normalsArray, texCoordsArray);
};

function generateSphere(n, flat, pointsArray, normalsArray, texCoordsArray){
	divideTriangle(va, vb, vc, n, flat, pointsArray, normalsArray, texCoordsArray);
	divideTriangle(vd, vc, vb, n, flat, pointsArray, normalsArray, texCoordsArray);
	divideTriangle(va, vd, vb, n, flat, pointsArray, normalsArray, texCoordsArray);
	divideTriangle(va, vc, vd, n, flat, pointsArray, normalsArray, texCoordsArray);
};


function generateSun(n, flat, pointsArray, normalsArray, texCoordsArray){
	generateSphere(n, flat, pointsArray, normalsArray, texCoordsArray)
	for (var j = 0; j < normalsArray.length; j++){
		normalsArray[j] = negate(normalsArray[j]);
	}
};

function setup_sun(sun){
	sun.materialAmbient = vec4( 1.0, sun.sun_green[Math.floor(sun.sun_theta)%360], 0.0, 1.0 );
	sun.materialDiffuse = vec4( 1.0, sun.sun_green[Math.floor(sun.sun_theta)%360], 0.0, 1.0 );
	sun.materialSpecular = vec4( 1.0, sun.sun_green[Math.floor(sun.sun_theta)%360], 0.0, 1.0 );

	var translate_x = 11;
	var translate_y = 0;
	var translate_z = -30;
	var translationMatrix = translate(translate_x, translate_y, translate_z);

	if (sun.sun_theta >= 180)
		sun.sun_theta = 0;
	sun.sun_theta += 0.1;
	var rotationMatrix = rotate(sun.sun_theta, vec3(0, 0, 1));

	var ctm = mat4();
	ctm = mult(translationMatrix, ctm);
	ctm = mult(rotationMatrix, ctm);
	ctm = mult(translate(0, -4, 0), ctm);
	sun.ctm = ctm;

	if (sun.sun_theta < 180 && sun.sun_theta > 35.9){
		//slowly increase diffuse to 0.6
		sun.diffuse = Math.min(0.6, sun.diffuse+0.01);
		//slowly increase specular to 1.0
		sun.spec = Math.min(1.0, sun.spec+0.01);
	}
	else if (sun.sun_theta >= 180-35.9){
		//slowly decrease diffuse and specular to 0.3
		sun.diffuse = Math.max(0.3, sun.diffuse-0.01);
		sun.spec = Math.max(0.3, sun.spec-0.01);
	}
	var diffuse = sun.diffuse;
	var spec = sun.spec;
	sun.lightDiffuse = vec4(diffuse, diffuse, diffuse, 1.0);
	sun.lightSpecular = vec4(spec, spec, spec, 1.0);

	//adjust light position to sun position
	var lm = mat4();
	lm = mult(translationMatrix, lm);
	lm = mult(rotationMatrix, lm);
	lm = mult(translate(0, -4, 0), lm);
	sun_values.lm = lm;
}
function load_sun_to_GPU(sun){
	//points
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(sun_points), gl.STATIC_DRAW);
	gl.vertexAttribPointer( ATTRIBUTE_position, 3, gl.FLOAT, false, 0, 0 );
		//normals
		gl.bindBuffer( gl.ARRAY_BUFFER, normalBuffer);
		gl.bufferData( gl.ARRAY_BUFFER, flatten(sun_normals), gl.STATIC_DRAW );
		gl.vertexAttribPointer( ATTRIBUTE_normal, 3, gl.FLOAT, false, 0, 0 );

		//lighting
	gl.uniform3fv( UNIFORM_lightPosition, flatten(sun_values.lightPosition) );
	gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(sun_values.projection));
		ambientProduct = mult(sun.lightAmbient, sun.materialAmbient);
		diffuseProduct = mult(sun.lightDiffuse, sun.materialDiffuse);
		specularProduct = mult(sun.lightSpecular, sun.materialSpecular);

		gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
		gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
		gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
		
		gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(sun.ctm));
		gl.uniformMatrix4fv(UNIFORM_adjustLight, false, flatten(sun.lm));
		gl.uniform1f( UNIFORM_shininess, sun.materialShininess );
	//texture
	gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(sun_texCoordsArray), gl.STATIC_DRAW );
	gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );
		
}

function draw_moon(){
	materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
	materialDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
	materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
	materialShininess = 100.0;

	var translate_x = 11;
	var translate_y = 0;
	var translate_z = -30;
	var translationMatrix = translate(translate_x, translate_y, translate_z);

	var rotationMatrix = rotate(sun_values.sun_theta+180, vec3(0, 0, 1));

	ctm = mat4();
	ctm = mult(translationMatrix, ctm);
	ctm = mult(rotationMatrix, ctm);
	ctm = mult(translate(0, -4, 0), ctm);

	//adjust light position to moon position
	lm = mat4();
	lm = mult(translationMatrix, lm);
	lm = mult(rotationMatrix, lm);
	lm = mult(translate(0, -4, 0), lm);

	ambientProduct = moon_ambient;
	diffuseProduct = moon_diffuse;
	specularProduct = moon_specular;

	//LOAD TO GPU	
	//points
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(sun_points), gl.STATIC_DRAW);
	gl.vertexAttribPointer( ATTRIBUTE_position, 3, gl.FLOAT, false, 0, 0 );

	//normals
	gl.bindBuffer( gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(moon_normals), gl.STATIC_DRAW );
	gl.vertexAttribPointer( ATTRIBUTE_normal, 3, gl.FLOAT, false, 0, 0 );
	
	//lighting
	gl.uniform3fv( UNIFORM_lightPosition, flatten(sun_values.lightPosition) );
	gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(sun_values.projection));

	ambientProduct = mult(vec4(0.5, 0.5, 0.5, 1.0), materialAmbient);
	diffuseProduct = mult(vec4(0.5, 0.5, 0.5, 1.0), materialDiffuse);
	specularProduct = mult(vec4(0.5, 0.5, 0.5, 1.0), materialSpecular);

	gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
	gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
	gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
		
	gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(ctm));
	gl.uniformMatrix4fv(UNIFORM_adjustLight, false, flatten(lm));
		
	gl.uniform1f( UNIFORM_shininess, 0.0 );
	
	//texture
	gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(sun_texCoordsArray), gl.STATIC_DRAW );
	gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );
	//gl.enableVertexAttribArray( ATTRIBUTE_uv );
	//gl.bindTexture( gl.TEXTURE_2D, blankTexture );
	//gl.uniform1i(UNIFORM_sampler, 0);

	gl.drawArrays(gl.TRIANGLES, 0, moon_points.length);
}

function load_originals(){
    gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cube_points), gl.STATIC_DRAW );
    gl.vertexAttribPointer( ATTRIBUTE_position, 3, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, normalBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cube_normals), gl.STATIC_DRAW );
    gl.vertexAttribPointer( ATTRIBUTE_normal, 3, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cube_uv), gl.STATIC_DRAW );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );
}
