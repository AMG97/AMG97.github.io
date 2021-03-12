class Carrot {
	static #model_carrot;
	static anim_speed=150;

	static loadModels()
	{
		const gltfloader = new THREE.GLTFLoader();
		gltfloader.load( 'models/objects/carrot.glb', function ( carrot_gltf ) {
			Carrot.#model_carrot = new THREE.Object3D();
			Carrot.#model_carrot = carrot_gltf.scene;
		}, undefined, function (error){
			console.error(error);
		});
	}

	constructor(x,z,scene,matrix)
	{
		this.m_carrot = new THREE.Object3D();
		this.m_carrot = Carrot.#model_carrot.clone();

		this.m_carrot.position.set(x*grid_size,0,-z*grid_size);
		this.matrix=matrix;
		this.matrix.addCarrot(x,z,this);


		this.scene=scene;
		this.scene.add(this.m_carrot);

		this.a_up = new TWEEN.Tween(this.m_carrot.position);	
	}

	destroy()
	{
		this.a_disappear = new TWEEN.Tween(this.m_carrot.scale);
		this.a_disappear.to({x:0.01, y:0.01, z:0.01}, Carrot.anim_speed);
		this.a_disappear.start();

		setTimeout(()=>{
			this.scene.remove(this.m_carrot);
		},Carrot.anim_speed);
	}

}

Carrot.loadModels();