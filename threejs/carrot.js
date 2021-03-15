class Carrot {
	static #model_carrot;
	static anim_speed=2500;
	static anim_speed_disapear=150;

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

		this.m_carrot.position.set(x*grid_size,0.2,-z*grid_size);
		this.m_carrot.scale.set(0.8,0.8,0.8);
		this.matrix=matrix;
		this.matrix.addCarrot(x,z,this);


		this.scene=scene;
		this.scene.add(this.m_carrot);

		this.a_rot = new TWEEN.Tween(this.m_carrot.rotation)
					.to({y:this.m_carrot.rotation.y+Math.PI*2},Carrot.anim_speed)
					.repeat(Infinity)
					.start();

		this.a_pos = new TWEEN.Tween(this.m_carrot.position)
					.to({y:[0.7,0.2]},Carrot.anim_speed/1.2)
					.repeat(Infinity)
					.start();

		this.a_down = new TWEEN.Tween(this.m_carrot.position)
					.to({y:'-'+1.2},Cow.speed/2);
		this.a_up = new TWEEN.Tween(this.m_carrot.position)
					.to({y:'+'+1.2},Cow.speed/2);

	}

	animPause()
	{
		this.a_rot.pause();
		this.a_pos.pause();
	}

	animResume()
	{
		this.a_rot.resume();
		this.a_pos.resume();
	}

	animDown()
	{
		if(!this.a_rot.isPaused())
		{
			this.animPause();
			this.a_down.start();
		}

	}

	animUp()
	{
		this.a_up.start();
		setTimeout(this.animResume(),Cow.speed/2);
	}

	destroy()
	{
		this.a_disappear = new TWEEN.Tween(this.m_carrot.scale);
		this.a_disappear.to({x:0.01, y:0.01, z:0.01}, Carrot.anim_speed_disapear);
		this.a_disappear.start();

		this.a_disappear2 = new TWEEN.Tween(this.m_carrot.position);
		this.a_disappear2.to({y:1}, Carrot.anim_speed_disapear);
		this.a_disappear2.start();

		setTimeout(()=>{
			this.scene.remove(this.m_carrot);
		},Carrot.anim_speed);
	}

}

Carrot.loadModels();