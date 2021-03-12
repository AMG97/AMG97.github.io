class Hay {
	static #model_hay;
	static anim_speed=150;

	static loadModels()
	{
		const gltfloader = new THREE.GLTFLoader();
		gltfloader.load( 'models/objects/hay.glb', function ( hay_gltf ) {
			Hay.#model_hay = new THREE.Object3D();
			Hay.#model_hay = hay_gltf.scene;
		}, undefined, function (error){
			console.error(error);
		});
	}

	constructor(x,z,scene,matrix)
	{
		this.m_hay = new THREE.Object3D();
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