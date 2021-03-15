// Variables globales estandar
var renderer, scene, camera;

var player="";

var enemies=[];

var video;

var state = "init_menu";

var init_menu="";

var m_grass, m_fence, m_ground;
  //Entorno
  const gltfloader = new THREE.GLTFLoader();
  gltfloader.load ('models/environment/grass.glb', function ( grass_gltf){
	  gltfloader.load ('models/environment/ground.glb', function (ground_gltf){
		  gltfloader.load( 'models/environment/fence.glb', function ( fence_gltf ) {	
			  m_grass = new THREE.Object3D();
			  m_grass = grass_gltf.scene;
  
			  m_ground = new THREE.Object3D();
			  m_ground = ground_gltf.scene;
  
			  m_fence = new THREE.Object3D();
			  m_fence = fence_gltf.scene;
		  })
	  })
  }, undefined, function (error){
	  console.error(error);
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
	camera = new THREE.PerspectiveCamera( 55, aspectRatio, 0.1, 100 );	// Perspectiva
	scene.add(camera);
	// Atender al eventos
	window.addEventListener( 'resize', updateAspectRatio );

	//LUCES
	var ambiental = new THREE.AmbientLight(0x999999);
	scene.add(ambiental);


	var direccional = new THREE.DirectionalLight( 0xFFFFFF, 0.7 );
	direccional.position.set( 0,1,1 );
	scene.add( direccional );
}


function buttonHover(event)
{
	var button_play = scene.getObjectByName( "button_play" );

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
		var interseccion = rayo.intersectObjects( init_menu.children, false );
		if( interseccion.length > 0){
			if(interseccion[0].object.name == 'button_play'){
				button_play.material.color.setHex( 0xE0A839 );
			}
			else
			{
				button_play.material.color.setHex( 0x1E5C1C );
			}
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

	var interseccion = rayo.intersectObjects( init_menu.children, false );
	if( interseccion.length > 0){
		if(interseccion[0].object.name == 'button_play'){
			console.log("botton click");
			scene.remove(init_menu);
			state="play";
			loadPlay();
		}
	}
}

function loadInitMenu()
{
   	renderer.domElement.addEventListener('mousemove',buttonHover);
   	renderer.domElement.addEventListener('click',buttonClick);

  	camera.position.set(0,0.5,3);
   	camera.lookAt(new THREE.Vector3(0,0,0));

	//Objeto padre del menu
	init_menu = new THREE.Object3D();
	scene.add(init_menu);

	// TEXTO
	var material_button = new THREE.MeshLambertMaterial( {
		color:0x1E5C1C,
		wireframe: false,
	});

	var material_title = new THREE.MeshPhongMaterial({color:0x49F03B, shininess: 0});


	var font_loader = new THREE.FontLoader();
	font_loader.load( "fonts/Alphakind_Regular.json",function(font){

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
		var title = new THREE.Mesh( geo_title, material_title);
		title.position.set(-1.27,1,0);
		init_menu.add( title );
		
		//BOTTON
		var geo_title = new THREE.TextGeometry( 
			'JUGAR',
			{
				size: 0.2,
				height: 0.07,
				font:font,

			});
		var play = new THREE.Mesh( geo_title, material_title);
		play.position.set(-0.42,-0.1,0);
	
		var button_play_g = new THREE.BoxGeometry(1,0.4,0.1);
		var button_play = new THREE.Mesh( button_play_g, material_button );
		button_play.name = 'button_play';
		button_play.position.z=0.1;
		button_play.add(play);
		button_play.position.y=0.2;
  
		init_menu.add(button_play);
	});


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
      cubo = new THREE.Mesh( geoCubo, materialVideo );
      cubo.name = 'video_init';

      init_menu.add(cubo);

}

function loadPlay() {
	camera.position.set( 30, 30, -18 );
	camera.lookAt( new THREE.Vector3( 14,0,-18 ) );

	m_ground.add(m_fence);
	m_grass.add(m_ground);
	scene.add(m_grass);

	setupKeyControls();

	const light = new THREE.AmbientLight("white" ); // soft white light
	scene.add( light );

	// Grafo
	scene.add( new THREE.AxesHelper(3) );
}

function updateAspectRatio()
{
	// Mantener la relacion de aspecto entre marco y camara
	var aspectRatio = window.innerWidth/window.innerHeight;
	// Renovar medidas de viewport
	renderer.setSize( window.innerWidth, window.innerHeight );
	camera.aspect = aspectRatio;

	// Hay que actualizar la matriz de proyeccion
	camera.updateProjectionMatrix();
}

function update()
{
	TWEEN.update();

	switch (state)
	{
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
	  switch (e.keyCode) {

		case 13: //ENTER
			player = new Player(1,3,scene,grid_pruebas);
			new Carrot(4,4,scene,grid_pruebas);
			enemies.push(new Cow(8,8,"down",scene,grid_pruebas));
		break;

		case 32:
			player.modifyHay();
		break;

		case 37:
			player.move('left');
		break;
		case 38:
			player.move('up');
		break;
		case 39:
			player.move('right');
		break;
		case 40:
			player.move('down');
		break;
	  }
	};
  }