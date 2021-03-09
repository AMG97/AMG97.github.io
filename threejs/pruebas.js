// Variables globales estandar
var renderer, scene, camera;

var player;

class Enemy{

}



// Acciones
init();
loadScene();
render();

function init() {
	// Funcion de inicializacion de motor, escena y camara

	// Motor de render
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( new THREE.Color('grey') );
	renderer.shadowMap.enabled = true;
	document.getElementById('container').appendChild(renderer.domElement);
	renderer.outputEncoding = THREE.sRGBEncoding;

	// Escena
	scene = new THREE.Scene();

	// Camara
	var aspectRatio = window.innerWidth/window.innerHeight;
	camera = new THREE.PerspectiveCamera( 75, aspectRatio, 0.1, 100 );	// Perspectiva
	//camera = new THREE.OrthographicCamera( -10,10, 10/aspectRatio, -10/aspectRatio, 0.1, 100); //Ortografica
	camera.position.set( 18, 25, -18 );
	camera.lookAt( new THREE.Vector3( 12,0,-18 ) );

		// Control de camara
		//cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
		//cameraControls.target.set(12,0,-22 );
		//cameraControls.noZoom = false;

	// Atender al eventos
	window.addEventListener( 'resize', updateAspectRatio );
}

function loadScene() {
	const gltfloader = new THREE.GLTFLoader();

	//CARGAR SUELO
	gltfloader.load ('models/environment/grass.glb', function ( grass_gltf){
		gltfloader.load ('models/environment/ground.glb', function (ground_gltf){
			gltfloader.load( 'models/environment/fence.glb', function ( fence_gltf ) {	
				m_grass = new THREE.Object3D();
				m_grass = grass_gltf.scene;

				m_ground = new THREE.Object3D();
				m_ground = ground_gltf.scene;

				m_fence = new THREE.Object3D();
				m_fence = fence_gltf.scene;

				m_ground.add(m_fence);
				m_grass.add(m_ground);
				scene.add(m_grass);
			})
		})
	}, undefined, function (error){
		console.error(error);
	});

	gltfloader.load( 'models/cow/cow.glb', function ( cow_gltf ) {

		gltfloader.load('models/cow/cow_leg.glb', function (cow_leg_gltf){

			gltfloader.load('models/cow/cow_tail.glb', function (cow_tail_gltf){

				m_cow = new THREE.Object3D();
				m_cow = cow_gltf.scene;

				m_cow_tail= new THREE.Object3D();
				m_cow_tail = cow_tail_gltf.scene;
				m_cow_tail.translateZ(-0.95);
				m_cow_tail.translateY(0.15);

				m_cow_leg_1 = new THREE.Object3D();
				m_cow_leg_1 = cow_leg_gltf.scene;
				m_cow_leg_1.translateX(0.5);
				m_cow_leg_1.translateY(-0.5);

				m_cow_leg_2 = new THREE.Object3D();
				m_cow_leg_2 = m_cow_leg_1.clone();
				m_cow_leg_2.translateX(-1);
				m_cow_leg_2.rotateY(Math.PI);

				m_cow_leg_3 = new THREE.Object3D();
				m_cow_leg_3 = m_cow_leg_1.clone();
				m_cow_leg_3.translateZ(-0.8);

				m_cow_leg_4 = new THREE.Object3D();
				m_cow_leg_4 = m_cow_leg_2.clone();
				m_cow_leg_4.translateZ(0.8);

				m_cow.add(m_cow_leg_1);
				m_cow.add(m_cow_leg_2);
				m_cow.add(m_cow_leg_3);
				m_cow.add(m_cow_leg_4);
				m_cow.add(m_cow_tail);


				m_cow.position.set(0,1.3,0);
				scene.add(m_cow);
			});
		});
	}, undefined, function (error){
		console.error(error);
	});

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
	// Para la perspectiva
	camera.aspect = aspectRatio;
	// Para la ortografica
	// camera.top = 10/aspectRatio;
	// camera.bottom = -10/aspectRatio;

	// Hay que actualizar la matriz de proyeccion
	camera.updateProjectionMatrix();
}
function update()
{
	TWEEN.update();
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

		case 13: 
			player = new Player();
			player.loadPlayer(5,6,scene);
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
	}; // HACEER ROTACIONNNNNN
  }