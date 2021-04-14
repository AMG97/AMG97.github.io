class Hay {
	static #model_hay;
	static anim_speed=100;

	static loadModels()
	{
		const gltfloader = new THREE.GLTFLoader();
		gltfloader.load( 'models/objects/hay.glb', function ( hay_gltf ) {
			Hay.#model_hay = hay_gltf.scene;
			Hay.#model_hay.traverse(function(child){
				child.castShadow = true;
			});
			create_hay = new Hay(13.5,11.5,"");
		}, undefined, function (error){
			console.error(error);
		});
	}

	constructor(x,z,scene,matrix)
	{
		if(scene != "")
		{
			this.m_hay = Hay.#model_hay.clone();

			this.m_hay.position.set(x*grid_size,0,-z*grid_size);
			this.matrix=matrix;
			this.matrix.changePosition(x,z,grid_hay,this);

			this.m_hay.scale.set(0,0,0);
			this.scene=scene;
			this.scene.add(this.m_hay);

			this.a_grow = new TWEEN.Tween(this.m_hay.scale)
						.to({x:0.9,y:0.9,z:0.9},Hay.anim_speed);
			this.a_grow.start();	
		}	
		else
		{
			this.m_hay = Hay.#model_hay.clone();
			this.m_hay.traverse(function(child){
				child.name = "hay";
			});
			this.m_hay.name="hay";
	
			this.m_hay.position.set(x*grid_size,0,-z*grid_size);
		}

	}

	destroy()
	{
		this.a_grow.from(this.m_hay.scale);
		this.a_grow.to({x:0.01, y:0.01, z:0.01}, Hay.anim_speed);
		this.a_grow.start();

		setTimeout(()=>{
			this.scene.remove(this.m_hay);
		},Hay.anim_speed);
	}

}

Hay.loadModels();