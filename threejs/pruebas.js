// Variables globales estandar
var renderer, scene, camera;
var camerao, camerap;


var player="";
var enemies=[];

var video, video_menu;

var state = "init_menu";

var direccional;



//Entorno
var m_grass, m_fence, m_ground;
  const gltfloader = new THREE.GLTFLoader();
  gltfloader.load ('models/environment/grass.glb', function ( grass_gltf){
	  gltfloader.load ('models/environment/ground.glb', function (ground_gltf){
		  gltfloader.load( 'models/environment/fence.glb', function ( fence_gltf ) {	
			  m_grass = grass_gltf.scene.children[0];

			  m_grass.receiveShadow=true;
  
			  m_ground = ground_gltf.scene.children[0];

			  m_ground.receiveShadow=true;
  
			  m_fence = fence_gltf.scene.children[0];

			  m_fence.castShadow = true;

			  if(state!= "init_menu")
			  {
				loadPlay();
			  }
		  })
	  })
  }, undefined, function (error){
	  console.error(error);
  });

material_text = new THREE.MeshPhongMaterial({color:0x49F03B, shininess: 0});

var title, text_win, text_lose;
var button_play;

new THREE.FontLoader().load( "fonts/Alphakind_Regular.json",function(font){
			//TITULO
			var geo_title = new THREE.TextGeometry( 
				'HARVEST DAY',
				{
					size: 0.3,
					height: 0.07,
					curveSegments: 8,
					style: "normal",
					font: font,
					bevelThickness: 0.01,
					bevelSize: 0.01,
					bevelEnabled: true
				});
			title = new THREE.Mesh( geo_title, material_text);
			title.position.set(-1.26,1,0);
			scene.add(title);

			//BOTTON
			var geo_title = new THREE.TextGeometry( 
				'JUGAR',
				{
					size: 0.2,
					height: 0.07,
					font:font,

				});
			var play = new THREE.Mesh( geo_title, material_text);
			play.position.set(-0.42,-0.1,0);
		
			var button_play_g = new THREE.BoxGeometry(1,0.4,0.1);
			button_play = new THREE.Mesh( button_play_g, material_button );
			button_play.name = 'button_play';
			button_play.position.z=0.1;
			button_play.add(play);
			button_play.position.y=0.2;

			scene.add(button_play);



			var geo_lose = new THREE.TextGeometry( 
				'PERDISTE',
				{
					size: 0.3,
					height: 0.07,
					curveSegments: 8,
					style: "normal",
					font: font,
					bevelThickness: 0.01,
					bevelSize: 0.01,
					bevelEnabled: true
				});
			text_lose = new THREE.Mesh( geo_lose, material_text);
			text_lose.name="text_lose";
			text_lose.position.set(-0.84,1,0);

			var geo_win = new THREE.TextGeometry( 
				'GANASTE',
				{
					size: 0.3,
					height: 0.07,
					curveSegments: 8,
					style: "normal",
					font: font,
					bevelThickness: 0.01,
					bevelSize: 0.01,
					bevelEnabled: true
				});
			text_win = new THREE.Mesh( geo_win, material_text);
			text_win.name="text_win;"
			text_win.position.set(-0.82,1,0);

});
var material_button = new THREE.MeshLambertMaterial( {
	color:0x1E5C1C,
	wireframe: false,
});



// Acciones
init();
loadInitMenu();
render();

function init() {
	// Funcion de inicializacion de motor, escena y camara
	// Motor de render
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( new THREE.Color(0x49F03B) );
	renderer.shadowMap.enabled = true;
	document.getElementById('container').appendChild(renderer.domElement);
	renderer.outputEncoding = THREE.sRGBEncoding;

	// Escena
	scene = new THREE.Scene();
	// Camara
	var aspectRatio = window.innerWidth/window.innerHeight;
	camerap = new THREE.PerspectiveCamera( 55, aspectRatio, 0.1, 100 );	// Perspectiva
	//camerao = new THREE.OrthographicCamera( -3,3, 3/aspectRatio, -3/aspectRatio, 0.1, 100); //Ortografica
	camera = camerap;
	scene.add(camera);
	// Atender al eventos
	window.addEventListener( 'resize', updateAspectRatio );

	//LUCES
	var ambiental = new THREE.AmbientLight(0x999999);
	scene.add(ambiental);


	direccional = new THREE.DirectionalLight( 0xffffff, 1 );
	direccional.castShadow = true;

	direccional.shadow.mapSize.width = 2048;
	direccional.shadow.mapSize.height = 2048;

	const d = 100;

	direccional.shadow.camera.left = - d;
	direccional.shadow.camera.right = d;
	direccional.shadow.camera.top = d;
	direccional.shadow.camera.bottom = - d;

	direccional.shadow.camera.far = 3500;
	direccional.shadow.bias = - 0.0001;

	scene.add( direccional );

	const direccional_help = new THREE.DirectionalLightHelper( direccional, d/2 );
	scene.add( direccional_help );
}


function buttonHover(event)
{

	if(button_play!=undefined)
	{
		// Localizar la posicion del doble click en coordenadas de ventana
		var x = event.clientX;
		var y = event.clientY;

		// Normalizar al espacio de 2x2 centrado
		x = x * 2/window.innerWidth - 1;
		y = -y * 2/window.innerHeight + 1;

		// Construir el rayo que pasa por el punto de vista y el punto x,y
		var rayo = new THREE.Raycaster();
		rayo.setFromCamera( new THREE.Vector2(x,y), camera);

		// Calcular interseccion con objetos de la escena
		var interseccion = rayo.intersectObjects( scene.children, false );
		if( interseccion.length > 0){
			if(interseccion[0].object.name == 'button_play'){
				button_play.material.color.setHex( 0xE0A839 );
			}
			else
			{
				button_play.material.color.setHex( 0x1E5C1C );
			}
		}
		else
		{
			button_play.material.color.setHex( 0x1E5C1C );
		}
	}
}

function buttonClick(event)
{
	var x = event.clientX;
    var y = event.clientY;
	x = x * 2/window.innerWidth - 1;
	y = -y * 2/window.innerHeight + 1;
	var rayo = new THREE.Raycaster();
	rayo.setFromCamera( new THREE.Vector2(x,y), camera);

	var interseccion = rayo.intersectObjects( scene.children, false );
	if( interseccion.length > 0){
		if(interseccion[0].object.name == 'button_play'){
			loadPlay();
		}
	}
}

function loadInitMenu()
{
   	renderer.domElement.addEventListener('mousemove',buttonHover);
   	renderer.domElement.addEventListener('click',buttonClick);

	direccional.position.set( 0,1,1 );
	direccional.intensity=0.7;

  	camera.position.set(0,0,3);
   	camera.lookAt(new THREE.Vector3(0,0,0));

	if(state!= "init_menu")
	{
		state = "init_menu";
		scene.add(title);
		scene.add(button_play);
	}

	if(video_menu == undefined)
	{
      // 1. Crear el elemento de video en el documento
      video = document.createElement('video');
      video.src = "videos/title.mp4";
      video.muted = true;
      video.load();
      video.play();

	  video.addEventListener('ended', (event) => {
		  video.pause();
		  video.currenTime=0;
		  video.play();
	  });
  
      // 2. Asociar la imagen de video a un canvas
      videoImage = document.createElement('canvas');
      videoImage.width = 1920;
      videoImage.height = 1080;
      videoImageContent = videoImage.getContext('2d');
      videoImageContent.fillRect( 0,0,videoImage.width,videoImage.height);
  
      // 3. Crear la textura
      videoTexture = new THREE.Texture(videoImage);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.maxFilter = THREE.LinearFilter;
  
      var materialVideo = new THREE.MeshLambertMaterial( {
          color:'white',
          wireframe: false,
          map: videoTexture
      });
  
      var geoCubo = new THREE.BoxGeometry(1.920*3.3,1.080*3.3,0.1);
      video_menu = new THREE.Mesh( geoCubo, materialVideo );
      video_menu.name = 'video_menu';
	}

    scene.add(video_menu);

}

function loadPlayEndMenu(win_game)
{
	state = "playend_menu";
	lose=0;
	win=0;

	grid_pruebas.deleteAll();
	//hacer algo para eliminar todas las cosas del play
	player.destroy();
	player=undefined;
	enemies=[];

	for( obj in scene.children) { 
		scene.remove(obj); 
   }

	scene.remove(m_fence);
	scene.remove(m_ground);
	scene.remove(m_grass);

	scene.add(video_menu);
	if(win_game)
		scene.add(text_win);
	else
   		scene.add(text_lose);
	scene.add(button_play);

	direccional.position.set( 0,1,1 );
	direccional.intensity=0.7;

  	camera.position.set(0,0,3);
   	camera.lookAt(new THREE.Vector3(0,0,0));
}

function loadPlay() {

	if(m_fence != undefined && m_grass != undefined && m_ground!=undefined)
	{
		if(state == "init_menu")
		{
			scene.remove(button_play);
			scene.remove(video_menu);
			scene.remove(title);
		}
		if(state == "playend_menu")
		{
			scene.remove(button_play);
			scene.remove(video_menu);
			scene.remove(text_win);
			scene.remove(text_lose);
		}
		state="play";
		camera.position.set( 30, 30, -18 );
		camera.lookAt( new THREE.Vector3( 14,0,-18 ) );

			// Control de camara
		/*cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
		cameraControls.target.set( 0, 3, 0 );
		cameraControls.noZoom = false;*/

		direccional.position.set( 30,30,-18 ); // Cambiar esto pa que las sombras se vean mas
		direccional.intensity=0.9;

		scene.add(m_fence);
		scene.add(m_ground);
		scene.add(m_grass);

		setupKeyControls();	

		//CREAR NIVEL DE PRUEBA
		player = new Player(5,9,scene,grid_pruebas);
		createHay(0,4,true);
		createHay(1,4,true);
		createHay(2,4,true);
		createHay(3,4,true);
		createHay(4,4,true);
		createHay(4,0,true);
		createHay(4,1,true);
		createHay(4,2,true);
		createHay(4,3,true);
		enemies.push(new Cow(2,2,"right",scene,grid_pruebas));


		createHay(11,15,true);
		createHay(10,15,true);
		createHay(9,15,true);
		createHay(8,15,true);
		createHay(7,15,true);
		createHay(7,16,true);
		createHay(7,17,true);
		createHay(7,18,true);
		createHay(7,19,true);
		enemies.push(new Cow(9,17,"right",scene,grid_pruebas));

		new Carrot(11,0,scene,grid_pruebas);
		new Carrot(11,1,scene,grid_pruebas);

		new Carrot(10,0,scene,grid_pruebas);
		new Carrot(10,1,scene,grid_pruebas);

		new Carrot(0,18,scene,grid_pruebas);
		new Carrot(0,19,scene,grid_pruebas);

		new Carrot(1,18,scene,grid_pruebas);
		new Carrot(1,19,scene,grid_pruebas);
	}
}

function createHay(x,y,carrot)
{
	if(carrot)
		new Carrot(x,y,scene,grid_pruebas);
	new Hay(x,y,scene,grid_pruebas);
}

function updateAspectRatio()
{
	// Mantener la relacion de aspecto entre marco y camara
	var aspectRatio = window.innerWidth/window.innerHeight;
	// Renovar medidas de viewport
	renderer.setSize( window.innerWidth, window.innerHeight );
	
	/*if(state == "init_menu" || state == "playend_menu")
	{
		camera.top = 3/aspectRatio;
		camera.bottom = -3/aspectRatio;
	}
	else*/
		camera.aspect = aspectRatio;


	// Hay que actualizar la matriz de proyeccion
	camera.updateProjectionMatrix();
}

function update()
{
	TWEEN.update();

	switch (state)
	{
		case "playend_menu":
		case "init_menu":
			if(video.readyState === video.HAVE_ENOUGH_DATA){
				videoImageContent.drawImage(video,0,0);
				if(videoTexture) videoTexture.needsUpdate = true;
			}
			break;
		case "play":
			if(player!="")
			{
				player_pos = player.getPos();
				for (enemy of enemies)
				{
					enemy.move(player_pos);
				}
			}
			if(win)
				loadPlayEndMenu(true);
			else if(lose)
				loadPlayEndMenu(false);
		break;
	}
}

function render() {
	// Blucle de refresco
	requestAnimationFrame( render );
	update();
	renderer.render( scene, camera );
}

function setupKeyControls() {
	document.onkeydown = function(e) {
		if (state=="play")
		{
			switch (e.keyCode) {
				case 32:
					player.modifyHay();
				break;
				
				case 65:
					player.move('left');
				break;
				
				case 87:
					player.move('up');
				break;
				case 68:
					player.move('right');
				break;
				case 83:
					player.move('down');
				break;
			}
		}
	};
  }