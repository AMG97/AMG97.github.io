function loadInitMenu(scene)
{
    //Vaciar escena
    for( var i = scene.children.length - 1; i >= 0; i--) { 
        obj = scene.children[i];
        scene.remove(obj); 
   }

   camera = new THREE.OrthographicCamera( -10,10, 10/aspectRatio, -10/aspectRatio, 0.1, 100); //Ortografica
   scene.add(camera);
   camera.position.set(0,0,5);
   camera.lookAt(new THREE.Vector3(0,0,0));

   	// Control de camara
	cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
	cameraControls.target.set( 0, 0, 0 );
	cameraControls.noZoom = false;

    // PRUEBA TEXTO
	var font_loader = new THREE.FontLoader();
	material_title = new THREE.MeshPhongMaterial({color:'red',
                                                   specular: 'red',
                                                   shininess: 50 });
	font_loader.load( "fonts/GREEN NATURE_Regular.json",function(font){
        var geo_title = new THREE.TextGeometry( 
            'HARVEST DAY',
            {
                size: 0.5,
                height: 0.1,
                style: "normal",
                font: font,
                curveSegments: 8,
            });
        var texto = new THREE.Mesh( geo_title, material_title);
        texto.name = 'Titulo';
        texto.position.set(-1.95,1.5,0);
        scene.add( texto );
    });

    var ambiental = new THREE.AmbientLight(0x222222);
	scene.add(ambiental);

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
      cubo.position.z = -2;

      scene.add(cubo);

}