var x_ball_dir = -1.0;
var y_ball_dir = -1.0;
var z_ball_dir = 0.0;

var initial_ball_pos = [0.0, 0.4, 0.0];
var initial_ball_speed = [0.0, 0.02, 0.0];
var initial_ball_accel = [0.0, -0.002, 0.0];

var ball_pos = initial_ball_pos.slice();
var ball_speed = initial_ball_speed.slice();
var ball_accel = initial_ball_accel.slice();

var ambientLightRGB_board = [0.8, 0.8, 0.8];
var ambientLightRGB_sphere = [0.3, 0.3, 0.3];

var board_shininess = 8.0;
var sphere_shininess = 128.0;


var BOARD_SIZE = 0.8;
var SPHERE_RADIUS = 0.5;

var gl = null;

var shaderProgram = null; 

var cubeVertexNormalsBuffer = null;
var cubeVertexPositionBuffer = null;
var cubeVertexIndexBuffer = null;
var cubeVertexTextureCoordBuffer;

var sphereVertexNormalsBuffer = null;
var sphereVertexPositionBuffer = null;
var sphereVertexTextureCoordBuffer = null;
var sphereVertexIndexBuffer = null;

// The global transformation parameters

// The translation vector

var tx = 0.0;
var ty = 0.0;
var tz = 0.0;

// The rotation angles in degrees
var initialyaw_set = false;
var initialyaw = 0;

var newAngleXX = 0.0;
var newAngleYY = 0.0;
var newAngleZZ = 0.0;

var angleXX = 0.0;
var angleYY = 0.0;
var angleZZ = 0.0;

var sphereRotationXX = 0.0;
var sphereRotationYY = 0.0;
var sphereRotationZZ = 0.0;


// The scaling factors

var sx = 1;
var sy = 1;
var sz = 1;
 

vertices = [
            // Front face
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0, -1.0, -1.0,

            // Top face
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,

            // Right face
             1.0, -1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0,  1.0,  1.0,
             1.0, -1.0,  1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0
];

 var normals = [
            // Front face
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0,

            // Back face
             0.0,  0.0, -1.0,
             0.0,  0.0, -1.0,
             0.0,  0.0, -1.0,
             0.0,  0.0, -1.0,

            // Top face
             0.0,  1.0,  0.0,
             0.0,  1.0,  0.0,
             0.0,  1.0,  0.0,
             0.0,  1.0,  0.0,

            // Bottom face
             0.0, -1.0,  0.0,
             0.0, -1.0,  0.0,
             0.0, -1.0,  0.0,
             0.0, -1.0,  0.0,

            // Right face
             1.0,  0.0,  0.0,
             1.0,  0.0,  0.0,
             1.0,  0.0,  0.0,
             1.0,  0.0,  0.0,

            // Left face
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0
        ];

// Texture coordinates for the quadrangular faces

var textureCoords = [

          // Front face
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,

          // Back face
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
          0.0, 0.0,

          // Top face
          0.0, 1.0,
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,

          // Bottom face
          1.0, 1.0,
          0.0, 1.0,
          0.0, 0.0,
          1.0, 0.0,

          // Right face
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
          0.0, 0.0,

          // Left face
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
];

// Vertex indices defining the triangles
        
var cubeVertexIndices = [

            0, 1, 2,      0, 2, 3,    // Front face

            4, 5, 6,      4, 6, 7,    // Back face

            8, 9, 10,     8, 10, 11,  // Top face

            12, 13, 14,   12, 14, 15, // Bottom face

            16, 17, 18,   16, 18, 19, // Right face

            20, 21, 22,   20, 22, 23  // Left face
];
         

function handleLoadedTexture(texture) {
	
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
}


var webGLTexture;
var sphereWebGLTexture;

function initTexture() {
	
	webGLTexture = gl.createTexture();
	webGLTexture.image = new Image();
	webGLTexture.image.onload = function () {
		handleLoadedTexture(webGLTexture)
	}

	webGLTexture.image.src = "madeira.jpg";
	
	sphereWebGLTexture = gl.createTexture();
	sphereWebGLTexture.image = new Image();
	sphereWebGLTexture.image.onload = function () {
		handleLoadedTexture(sphereWebGLTexture)
	}

	sphereWebGLTexture.image.src = "metal.jpg";
	
}

function initBuffers() {	
	
	
	// Normals
	
	cubeVertexNormalsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	cubeVertexNormalsBuffer.itemSize = 3;
	cubeVertexNormalsBuffer.numItems = normals.length / 3;	
	
	// Coordinates
	
	cubeVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	cubeVertexPositionBuffer.itemSize = 3;
	cubeVertexPositionBuffer.numItems = vertices.length / 3;			

	// Textures
		
    cubeVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
 	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    cubeVertexTextureCoordBuffer.itemSize = 2;
    cubeVertexTextureCoordBuffer.numItems = 24;			

	// Vertex indices
	
    cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
    cubeVertexIndexBuffer.itemSize = 1;
    cubeVertexIndexBuffer.numItems = 36;
	
	

	var latitudeBands = 30;
	var longitudeBands = 30;
	var radius = SPHERE_RADIUS;

	var sphereVertexPositionData = [];
	var sphereNormalData = [];
	var sphereTextureCoordData = [];
	for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
		var theta = latNumber * Math.PI / latitudeBands;
		var sinTheta = Math.sin(theta);
		var cosTheta = Math.cos(theta);

		for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
			var phi = longNumber * 2 * Math.PI / longitudeBands;
			var sinPhi = Math.sin(phi);
			var cosPhi = Math.cos(phi);

			var x = cosPhi * sinTheta;
			var y = cosTheta;
			var z = sinPhi * sinTheta;
			var u = 1 - (longNumber / longitudeBands);
			var v = 1 - (latNumber / latitudeBands);

			sphereNormalData.push(x);
			sphereNormalData.push(y);
			sphereNormalData.push(z);
			sphereTextureCoordData.push(u);
			sphereTextureCoordData.push(v);
			sphereVertexPositionData.push(radius * x);
			sphereVertexPositionData.push(radius * y);
			sphereVertexPositionData.push(radius * z);
		}
	}

	var sphereIndexData = [];
	for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
		for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
			var first = (latNumber * (longitudeBands + 1)) + longNumber;
			var second = first + longitudeBands + 1;
			sphereIndexData.push(first);
			sphereIndexData.push(second);
			sphereIndexData.push(first + 1);

			sphereIndexData.push(second);
			sphereIndexData.push(second + 1);
			sphereIndexData.push(first + 1);
		}
	}

	sphereVertexNormalsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereNormalData), gl.STATIC_DRAW);
	sphereVertexNormalsBuffer.itemSize = 3;
	sphereVertexNormalsBuffer.numItems = sphereNormalData.length / 3;

	sphereVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereTextureCoordData), gl.STATIC_DRAW);
	sphereVertexTextureCoordBuffer.itemSize = 2;
	sphereVertexTextureCoordBuffer.numItems = sphereTextureCoordData.length / 2;

	sphereVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereVertexPositionData), gl.STATIC_DRAW);
	sphereVertexPositionBuffer.itemSize = 3;
	sphereVertexPositionBuffer.numItems = sphereVertexPositionData.length / 3;

	sphereVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphereIndexData), gl.STREAM_DRAW);
	sphereVertexIndexBuffer.itemSize = 1;
	sphereVertexIndexBuffer.numItems = sphereIndexData.length;
	
	
}

function drawCube( angleXX, angleYY, angleZZ, 
					sx, sy, sz,
					tx, ty, tz,
					mvMatrix, pMatrix) {

	mvMatrix = mult( mvMatrix, translationMatrix( tx, ty, tz ) );				 
	mvMatrix = mult( mvMatrix, rotationZZMatrix( angleZZ ) );
	mvMatrix = mult( mvMatrix, rotationYYMatrix( angleYY ) );
	mvMatrix = mult( mvMatrix, rotationXXMatrix( angleXX ) );
	mvMatrix = mult( mvMatrix, scalingMatrix( sx, sy, sz ) );
						 
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);  
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalsBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeVertexNormalsBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.uniform3f(shaderProgram.ambientColorUniform, ambientLightRGB_board[0], ambientLightRGB_board[1], ambientLightRGB_board[2]);
	gl.uniform3f(shaderProgram.pointLightingLocationUniform, 0.0, 0.1, -2.5);
	gl.uniform3f(shaderProgram.pointLightingSpecularColorUniform, 0.75, 0.75, 0.75);
	gl.uniform3f(shaderProgram.pointLightingDiffuseColorUniform, 0.6, 0.6, 0.6);
	
	gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, webGLTexture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);
	
    gl.uniform1f(shaderProgram.materialShininessUniform, board_shininess);
	
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
	
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, new Float32Array(flatten(pMatrix)));
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, new Float32Array(flatten(mvMatrix)));

	var normalMatrix = normalFromMat4(mvMatrix);
	
	gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, new Float32Array(flatten(normalMatrix)));
	
	
	gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);	
}

function drawSphere( angleXX, angleYY, angleZZ, 
					sx, sy, sz,
					tx, ty, tz,
					mvMatrix, pMatrix) {

    
	mvMatrix = mult( mvMatrix, translationMatrix( tx, ty, tz ) );					 
	mvMatrix = mult( mvMatrix, rotationZZMatrix( angleZZ ) );
	mvMatrix = mult( mvMatrix, rotationYYMatrix( angleYY ) );
	mvMatrix = mult( mvMatrix, rotationXXMatrix( angleXX ) );
	mvMatrix = mult( mvMatrix, scalingMatrix( sx, sy, sz ) );
						 
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalsBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sphereVertexNormalsBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.uniform3f(shaderProgram.ambientColorUniform, ambientLightRGB_sphere[0], ambientLightRGB_sphere[1], ambientLightRGB_sphere[2]);
	gl.uniform3f(shaderProgram.pointLightingLocationUniform, 0.0, 1.0, 1.0);
	gl.uniform3f(shaderProgram.pointLightingSpecularColorUniform, 0.75, 0.75, 0.75);
	gl.uniform3f(shaderProgram.pointLightingDiffuseColorUniform, 0.7, 0.7, 0.7);
	
	gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sphereWebGLTexture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);
	
    gl.uniform1f(shaderProgram.materialShininessUniform, sphere_shininess);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
	
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, new Float32Array(flatten(pMatrix)));
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, new Float32Array(flatten(mvMatrix)));

	var normalMatrix = normalFromMat4(mvMatrix);
	
	gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, new Float32Array(flatten(normalMatrix)));
	
	
	gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);	
}

function drawScene() {
	
	var pMatrix;
	
	var mvMatrix = mat4();
	
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);
		
	pMatrix = perspective( 60, 1, 0.05, 10 );
	
	tz = -2.35;
	
	drawCube(angleXX, angleYY, angleZZ, 			// Draw the board
				sx*0.75, sy*0.75*0.025, sz*0.75,
				tx, ty-0.3, tz,
				mvMatrix, pMatrix);         	       
      
	mvMatrix = mat4();
	  
	drawSphere(sphereRotationXX, sphereRotationYY, sphereRotationZZ,	// Draw the sphere 
				sx*0.1, sy*0.1, sz*0.1,
				tx+ball_pos[0], ty+ball_pos[1], tz+ball_pos[2],
				mvMatrix, pMatrix);
	           	       
	  
}

var lastTime = 0;

function detectCollision() {
	var a = vec3(Math.cos(radians(angleZZ)) * Math.cos(radians(angleYY)), Math.sin(radians(angleZZ)), -(Math.cos(radians(angleZZ)) * Math.sin(radians(angleYY))));
	normalize(a);
	var b = vec3(Math.cos(radians(angleZZ)) * Math.cos(radians(angleYY+90)), Math.sin(radians(angleXX)), -(Math.cos(radians(angleXX)) * Math.cos(radians(angleYY))));
	normalize(b);
	var normal = vectorProduct(a, b);
	var planepoint = vec3(0.0, -0.3, 0.0);
	normalize(normal);
	
	var MIN_BACK = vec3(b[0]*BOARD_SIZE-a[0]*BOARD_SIZE, -0.3+b[1]*BOARD_SIZE-a[1]*BOARD_SIZE, b[2]*BOARD_SIZE-a[2]*BOARD_SIZE);
	var MAX_BACK = vec3(b[0]*BOARD_SIZE+a[0]*BOARD_SIZE, -0.3+b[1]*BOARD_SIZE+a[1]*BOARD_SIZE, b[2]*BOARD_SIZE+a[2]*BOARD_SIZE);
	var MIN_FRONT = vec3(-b[0]*BOARD_SIZE-a[0]*BOARD_SIZE, -0.3-b[1]*BOARD_SIZE-a[1]*BOARD_SIZE, -b[2]*BOARD_SIZE-a[2]*BOARD_SIZE);
	var MAX_FRONT = vec3(-b[0]*BOARD_SIZE+a[0]*BOARD_SIZE, -0.3-b[1]*BOARD_SIZE+a[1]*BOARD_SIZE, -b[2]*BOARD_SIZE+a[2]*BOARD_SIZE);	
	
	var MIN_F_MIN_B = vec3(MIN_BACK[0]-MIN_FRONT[0], MIN_BACK[1]-MIN_FRONT[1], MIN_BACK[2]-MIN_FRONT[2])
	var MAX_F_MAX_B = vec3(MAX_BACK[0]-MAX_FRONT[0], MAX_BACK[1]-MAX_FRONT[1], MAX_BACK[2]-MAX_FRONT[2])
	var MIN_F_MAX_F = vec3(MAX_FRONT[0]-MIN_FRONT[0], MAX_FRONT[1]-MIN_FRONT[1], MAX_FRONT[2]-MIN_FRONT[2])
	var MIN_B_MAX_B = vec3(MAX_BACK[0]-MIN_BACK[0], MAX_BACK[1]-MIN_BACK[1], MAX_BACK[2]-MIN_BACK[2])
	var MIN_F_POINT = vec3(ball_pos[0]-MIN_FRONT[0], ball_pos[1]-MIN_FRONT[1], ball_pos[2]-MIN_FRONT[2])
	var MAX_F_POINT = vec3(ball_pos[0]-MAX_FRONT[0], ball_pos[1]-MAX_FRONT[1], ball_pos[2]-MAX_FRONT[2])
	var MIN_B_POINT = vec3(ball_pos[0]-MIN_BACK[0], ball_pos[1]-MIN_BACK[1], ball_pos[2]-MIN_BACK[2])
	
	var LIMIT_LEFT = vectorProduct(MIN_F_MIN_B, MIN_F_POINT);
	var LIMIT_RIGHT = vectorProduct(MAX_F_MAX_B, MAX_F_POINT);
	var LIMIT_BACK = vectorProduct(MIN_B_MAX_B, MIN_B_POINT);
	var LIMIT_FRONT = vectorProduct(MIN_F_MAX_F, MIN_F_POINT);

	var ball_to_plane = normal[0] * ball_pos[0] + normal[1] * ball_pos[1] + normal[2] * ball_pos[2] - dotProduct(normal, planepoint);

	var thickness_adjust = (0.12 * SPHERE_RADIUS);
	if (SPHERE_RADIUS > 1) thickness_adjust -= SPHERE_RADIUS * 0.01;
	if (SPHERE_RADIUS > 2.5) thickness_adjust -= SPHERE_RADIUS * 0.004;
	if (SPHERE_RADIUS < 1) thickness_adjust += SPHERE_RADIUS * 0.02;
	
	
	if (ball_to_plane > 0 && ball_to_plane <= thickness_adjust && LIMIT_LEFT[1] < 0 && LIMIT_RIGHT[1] > 0 && LIMIT_BACK[1] < 0 && LIMIT_FRONT[1] > 0) {
		ball_pos[1] += thickness_adjust - ball_to_plane;
		return true;
	}
	return false;
}

function recover() {
	ball_pos = initial_ball_pos.slice();
	ball_speed = initial_ball_speed.slice();
	ball_accel = initial_ball_accel.slice();
}

function animate() {
	
	var timeNow = new Date().getTime();
	
	if( lastTime != 0 ) {
		
		var elapsed = timeNow - lastTime;
		
		if (newAngleZZ >= -60 && newAngleZZ <= 60) {	
			angleXX = newAngleXX;
			angleYY = newAngleYY;
			angleZZ = newAngleZZ;
		}
		
		if (ball_pos[1] < -2) recover();
		
	
		ball_speed[0] = ball_speed[0] + ball_accel[0]
		ball_speed[1] = ball_speed[1] + ball_accel[1]
		ball_speed[2] = ball_speed[2] + ball_accel[2]
		
		if (detectCollision()) {
			if (Math.abs(ball_speed[1]) < 0.008) ball_speed[1] = 0;
			ball_speed[1] =  -ball_speed[1] * 0.3;
			ball_accel[0] = -Math.sin(radians(angleZZ)) * 0.001;
			ball_accel[2] = Math.sin(radians(angleXX)) * 0.001;
		}
		
		ball_pos[0] = ball_pos[0] + ball_speed[0];
		ball_pos[1] = ball_pos[1] + ball_speed[1];
		ball_pos[2] = ball_pos[2] + ball_speed[2];

		sphereRotationXX += (ball_speed[2] * 1000) % 360;
		sphereRotationZZ -= (ball_speed[0] * 1000) % 360;
		sphereRotationYY = angleYY*2;

		
	}
	
	lastTime = timeNow;
}

function tick() {
	
	requestAnimFrame(tick);
	
	drawScene();
	
	animate();
}


function initWebGL( canvas ) {
	try {
		
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");	
		gl.enable( gl.DEPTH_TEST );
		
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}        
}

//----------------------------------------------------------------------------


function setColorBoard(){
	var resultElement = document.getElementById('resultboard'),
	sliders = document.getElementsByClassName('board');
	var r = Math.round(sliders[0].noUiSlider.get());
	var g = Math.round(sliders[1].noUiSlider.get());
	var b = Math.round(sliders[2].noUiSlider.get());
	
	var color = 'rgb(' +
		r + ',' +
		g + ',' +
		b + ')';

	resultElement.style.background = color;
	resultElement.style.color = color;
	
	ambientLightRGB_board[0] = r/255.0;
	ambientLightRGB_board[1] = g/255.0;
	ambientLightRGB_board[2] = b/255.0;
	
	
}


function setColorSphere(){
	var resultElement = document.getElementById('resultsphere'),
	sliders = document.getElementsByClassName('sphere');
	var r = Math.round(sliders[0].noUiSlider.get());
	var g = Math.round(sliders[1].noUiSlider.get());
	var b = Math.round(sliders[2].noUiSlider.get());
	
	var color = 'rgb(' +
		r + ',' +
		g + ',' +
		b + ')';

	resultElement.style.background = color;
	resultElement.style.color = color;
	
	ambientLightRGB_sphere[0] = r/255.0;
	ambientLightRGB_sphere[1] = g/255.0;
	ambientLightRGB_sphere[2] = b/255.0;
	
	
}




function initGUI() { // Sliders belong to the noUiSlider library
	var resultElement = document.getElementById('resultboard'),
		sliders = document.getElementsByClassName('board');

	for ( var i = 0; i < sliders.length; i++ ) {

		noUiSlider.create(sliders[i], {
			start: 204,
			connect: [true, false],
			orientation: "vertical",
			range: {
				'min': 0,
				'max': 255
			}
		});

		sliders[i].noUiSlider.on('slide', setColorBoard);
	}
	
	resultElement = document.getElementById('resultsphere'),
		sliders = document.getElementsByClassName('sphere');

	for ( var i = 0; i < sliders.length; i++ ) {

		noUiSlider.create(sliders[i], {
			start: 77,
			connect: [true, false],
			orientation: "vertical",
			range: {
				'min': 0,
				'max': 255
			}
		});
		
		sliders[i].noUiSlider.on('slide', setColorSphere);
	}
	
	var sliderShininessBoard = document.getElementById('slidershinyboard');
	var sliderShininessBoardValue = document.getElementById('slidershinyboardvalue');
	noUiSlider.create(sliderShininessBoard, {
	start: [ 8 ],
	range: {
		'min': [   2,  2 ],
		'2': [   4,  4 ],
		'4': [  8, 8 ],
		'8': [  16, 16 ],
		'16': [  32, 32 ],
		'32': [  64, 64 ],
		'64': [  128, 128 ],
		'128': [  256, 256 ],
		'max': [ 256 ]
	}
	});
	
	sliderShininessBoard.noUiSlider.on('update', function( values, handle ) {
		sliderShininessBoardValue.innerHTML = "<b>Value:</b> " + values[handle];
		board_shininess = values[handle];
	});
	
	var sliderShininessSphere = document.getElementById('slidershinysphere');
	var sliderShininessSphereValue = document.getElementById('slidershinyspherevalue');
	noUiSlider.create(sliderShininessSphere, {
	start: [ 128 ],
	range: {
		'min': [   2,  2 ],
		'2': [   4,  4 ],
		'4': [  8, 8 ],
		'8': [  16, 16 ],
		'16': [  32, 32 ],
		'32': [  64, 64 ],
		'64': [  128, 128 ],
		'128': [  256, 256 ],
		'max': [ 256 ]
	}
	});
	
	sliderShininessSphere.noUiSlider.on('update', function( values, handle ) {
		sliderShininessSphereValue.innerHTML = "<b>Value:</b> " + values[handle];
		sphere_shininess = values[handle];
	});

	var sliderRadiusSphere = document.getElementById('sliderradiussphere');
	var sliderRadiusSphereValue = document.getElementById('sliderradiusspherevalue');
	noUiSlider.create(sliderRadiusSphere, {
	start: [ 1 ],
	range: {
		'min': [ 0.5 ],
		'max': [ 3]
	}
	});
	
	sliderRadiusSphere.noUiSlider.on('update', function( values, handle ) {
		sliderRadiusSphereValue.innerHTML = "<b>Value:</b> " + values[handle];
		SPHERE_RADIUS = values[handle];
		if (gl) initBuffers();
		recover();
	});
	
	
}

function runWebGL() {
	
	var canvas = document.getElementById("my-canvas");
	
	initGUI();
	
	initWebGL( canvas );

	shaderProgram = initShaders( gl );
	
	initBuffers();
	
	initTexture();
	
	tick();   
}


