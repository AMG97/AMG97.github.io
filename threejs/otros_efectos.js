/*
** Seminario #4: Otros_efectos
** Picking, video y multivista
** @author: rvivo@upv.es
** @date: 3-03-2021
** @dependencies: OrbitControls.js, Tween.js, dat.gui.min.js
*/

"use strict";

// Variables globales estandar
var renderer, scene, camera;

// Objetos
var esfera, conjunto, cubo;
var materialUsuario;

// Control
var cameraControls, effectControls;

// Temporales
var angulo = 0;
var antes = Date.now();

// Variables para video --------------------------------------
var video, videoImage, videoImageContent, videoTexture;
// -----------------------------------------------------------

// Movimiento del soldado ++++++++++++++++++++++++++++++++++++
var salto, volver;
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Minicamara ................................................
var minicam

// Acciones
init();
loadScene();
setupGUI();
render();

function init() {
	// Funcion de inicializacion de motor, escena y camara

	// Motor de render
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( new THREE.Color(0x000000) );
	renderer.shadowMap.enabled = true;
    renderer.autoClear = false; // <.......................
	document.getElementById('container').appendChild(renderer.domElement);

	// Escena
	scene = new THREE.Scene();

	// Camara
	var aspectRatio = window.innerWidth/window.innerHeight;
	//camera = new THREE.PerspectiveCamera( 75, aspectRatio, 0.1, 100 );	// Perspectiva
	camera = new THREE.OrthographicCamera( -10,10, 10/aspectRatio, -10/aspectRatio, 0.1, 100); //Ortografica
	camera.position.set( 0.5, 2, 5 );
	camera.lookAt( new THREE.Vector3( 0,0,0 ) );
    scene.add(camera);

	// Control de camara
	cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
	cameraControls.target.set( 0, 3, 0 );
	cameraControls.noZoom = false;

    // Minicam .....................................................
    minicam = new THREE.OrthographicCamera(-10,10, 10,-10, -10,100);
    minicam.position.set(0,1,0);
    minicam.up.set(0,0,-1);
    minicam.lookAt(0,-1,0);
    scene.add(minicam);
    // .............................................................

	// Luces 
	//direccional = new THREE.Focal

	/*// FUNCIONA MEDIO BIEN LO DE LAS SOMBRAS CON ESTO
	var direccional = new THREE.DirectionalLight( 0xFFFFFF, 1);
	direccional.position.set( 0,5,1 );
	direccional.castShadow = true;
	direccional.shadow.camera.far = 3500;


	direccional.shadow.mapSize.width = 2048;
	direccional.shadow.mapSize.height = 2048;

	const d = 80;

	direccional.shadow.camera.left = - d;
	direccional.shadow.camera.right = d;
	direccional.shadow.camera.top = d;
	direccional.shadow.camera.bottom = - d;*/

	scene.add( direccional );


	//scene.add( focal );

	// Atender al eventos
	window.addEventListener( 'resize', updateAspectRatio );
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++
    renderer.domElement.addEventListener('dblclick',saltar);
}

function loadScene() {
	// Construye el grafo de escena
	// - Objetos (geometria, material)
	// - Transformaciones 
	// - Organizar el grafo

	var path = "images/";

	// Objeto contenedor de cubo y esfera
	conjunto = new THREE.Object3D();
    conjunto.name = 'conjunto';
	conjunto.position.y = 1;

	// Cubo ---------------------------------------------------------

    // 1. Crear el elemento de video en el documento
    video = document.createElement('video');
    video.src = "videos/pixar.mp4";
    video.muted = true;
    video.load();
    video.play();

    // 2. Asociar la imagen de video a un canvas
    videoImage = document.createElement('canvas');
    videoImage.width = 632;
    videoImage.height = 256;
    videoImageContent = videoImage.getContext('2d');
    videoImageContent.fillStyle = '#0000FF';
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

    var geoCubo = new THREE.BoxGeometry(2,2,2);
    cubo = new THREE.Mesh( geoCubo, materialVideo );
    cubo.name = 'cubo';
    cubo.position.x = 2;
    cubo.receiveShadow = cubo.castShadow = true;

    // --------------------------------------------------------------

	// Esfera
	var entorno = [ path+"posx.jpg" , path + "negx.jpg",
	                path+"posy.jpg" , path + "negy.jpg",
	                path+"posz.jpg" , path + "negz.jpg"];

	var texEsfera = new THREE.CubeTextureLoader().load( entorno );
	                
	var geoEsfera = new THREE.SphereGeometry( 1, 30, 30 );
	var matEsfera = new THREE.MeshPhongMaterial( {color:'yellow',
                                                  specular: 'gray',
                                                  shininess: 40,
                                                  envMap: texEsfera } );
	esfera = new THREE.Mesh( geoEsfera, matEsfera );
    esfera.name = 'esfera';
	esfera.receiveShadow = esfera.castShadow = true;
//Entorno
var m_grass, m_fence;
	const gltfloader = new THREE.GLTFLoader();
	gltfloader.load ('models/environment/ground.glb', function ( grass_gltf){
				m_grass = grass_gltf.scene.children[0];
				m_grass.receiveShadow = true;

				scene.add(m_grass);

	});



	// Objeto importado
	var loader = new THREE.ObjectLoader();
	loader.load( 'models/soldado/soldado.json', 
		         function (objeto){
                    objeto.name = 'soldado';
		         	objeto.position.y = 1;
					var txsoldado = new THREE.TextureLoader().load('models/soldado/soldado.png');
					objeto.material.setValues({map:txsoldado});
					objeto.castShadow = true;
		         	// Movimiento interpolado del objeto
                    // +++
		         	salto = new TWEEN.Tween( objeto.position ).
		         	            to( {x: [0.2,0.3,0.5],
		         	            	 y: [2.1,2.3,1.0],
		         	            	 z: [0,0,0]}, 1000);
		         	salto.easing( TWEEN.Easing.Bounce.Out );
		         	salto.interpolation( TWEEN.Interpolation.Bezier );
		         	//salto.start();

                    // +++
		         	volver = new TWEEN.Tween( objeto.position );
		         	volver.to( {x:0,y:1,z:0}, 2000);
		         	//salto.chain( volver );
		         	//volver.chain( salto );

					 scene.add(objeto);
					 objeto.rotation.set(0,Math.PI,0);
					 objeto.scale.set(5,5,5);

		         });

	// Texto
	var fontLoader = new THREE.FontLoader();
	materialUsuario = new THREE.MeshPhongMaterial({color:'red',
                                                   specular: 'red',
                                                   shininess: 50 });
	fontLoader.load( 'fonts/GREEN NATURE_Regular.json',
		             function(font){
		             	var geoTexto = new THREE.TextGeometry( 
		             		'Harvest Day',
		             		{
		             			size: 0.5,
		             			height: 0.1,
		             			style: "normal",
		             			font: font,

		             		});
		             	var texto = new THREE.Mesh( geoTexto, materialUsuario );
		             	texto.name = 'texto';
                        texto.receiveShadow = texto.castShadow = true;
		             	scene.add( texto );
		             	texto.position.y = 3;
		             });

	// Habitacion
	var shader = THREE.ShaderLib.cube;
	shader.uniforms.tCube.value = texEsfera;

	var matParedes = new THREE.ShaderMaterial( {
						vertexShader: shader.vertexShader,
						fragmentShader: shader.fragmentShader,
						uniforms: shader.uniforms,
						depthWrite: false,
						side: THREE.BackSide
	} );

	var habitacion = new THREE.Mesh( new THREE.CubeGeometry(30,30,30), matParedes );
    habitacion.name = 'habitacion';

	// Grafo
	scene.add( new THREE.AxesHelper(3) );

var m_fence;
	gltfloader.load( 'models/environment/fence.glb', function ( fence_gltf ) {	

		m_fence = fence_gltf.scene;
		m_fence.position.y=2;

		m_fence.traverse( function( child ) { 

			if ( child.isMesh ) {
		
				child.castShadow = true;
		
			}
		});
		m_fence.castShadow = true;

		scene.add(m_fence);

	});
}

function updateAspectRatio()
{
	// Mantener la relacion de aspecto entre marco y camara

	var aspectRatio = window.innerWidth/window.innerHeight;
	// Renovar medidas de viewport
	renderer.setSize( window.innerWidth, window.innerHeight );
	// Para la perspectiva
	//camera.aspect = aspectRatio;
	//Para la ortografica
	 camera.top = 10/aspectRatio;
	 camera.bottom = -10/aspectRatio;

	// Hay que actualizar la matriz de proyeccion
	camera.updateProjectionMatrix();
}

function setupGUI()
{
	// Interfaz grafica de usuario 

	// Controles
	effectControls = {
		mensaje: "Interfaz",
		posY: 1.0,
		separacion: [],
		caja: true,
		color: "rgb(255,0,0)"
	};

	// Interfaz
	var gui = new dat.GUI();
	var folder = gui.addFolder("Interfaz Soldado World");
	folder.add( effectControls, "mensaje" ).name("App");
	folder.add( effectControls, "posY", 1.0, 3.0, 0.1 ).name("Subir/Bajar");
	folder.add( effectControls, "separacion", {Ninguna:0, Media:1, Maxima:2} ).name("Separacion");
	folder.add( effectControls, "caja" ).name("Ver al soldado");
	folder.addColor( effectControls, "color" ).name("Color texto");
}

function update()
{
	// Cambiar propiedades entre frames

	// Tiempo transcurrido
	var ahora = Date.now();
	// Incremento de 20º por segundo
	angulo += Math.PI/9 * (ahora-antes)/1000;
	antes = ahora;

	esfera.rotation.y = angulo;
	conjunto.rotation.y = angulo/10;

	// Cambio por demanda de usuario
	conjunto.position.y = effectControls.posY;
	esfera.position.x = -effectControls.separacion;
	cubo.visible = effectControls.caja;
	materialUsuario.setValues( {color:effectControls.color} );

	// Actualizar interpoladores
	TWEEN.update();

    // ACtualizar video ----------------------------------------------

    // 4. Poner el frame en la textura
    if(video.readyState === video.HAVE_ENOUGH_DATA){
        videoImageContent.drawImage(video,0,0);
        if(videoTexture) videoTexture.needsUpdate = true;
    }

    // --------------------------------------------------------------
}

function saltar(event) // ++++++++++++++++++++++++++++++++++++++++
{
    // Callback de atencion al doble click

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
    var interseccion = rayo.intersectObjects( scene.children, true );
    if( interseccion.length > 0){
        // Ver si es el soldado
        if(interseccion[0].object.name == 'soldado'){
            salto.chain(volver);
            salto.start();
        }
    }

}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


function render() {
	// Blucle de refresco
	requestAnimationFrame( render );
	update();

    renderer.clear();

    renderer.setViewport(0,0,window.innerWidth,window.innerHeight);
	renderer.render( scene, camera );

    renderer.setViewport( 10,10,200,200 );
    renderer.render( scene, minicam );
}
