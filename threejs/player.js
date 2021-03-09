class Player {
	constructor(){
		this.speed=800;
		this.last_rot='down';
	}

	static #model_body;
	static #model_arm;
	static #model_leg;

	static loadModels()
	{
		const gltfloader = new THREE.GLTFLoader();
		gltfloader.load( 'models/farmer/farmer.glb', function ( farmer_gltf ) {

			gltfloader.load('models/farmer/farmer_leg.glb', function (farmer_leg_gltf){

				gltfloader.load('models/farmer/farmer_arm.glb', function (farmer_arm_gltf){


					Player.#model_body = new THREE.Object3D();
					Player.#model_body = farmer_gltf.scene;

					Player.#model_arm = new THREE.Object3D();
					Player.#model_arm  = farmer_arm_gltf.scene;

					Player.#model_leg = new THREE.Object3D();
					Player.#model_leg = farmer_leg_gltf.scene;

				});
			});
		}, undefined, function (error){
			console.error(error);
		});
	}

	loadPlayer(x,z,scene)
	{
		this.m_player = new THREE.Object3D();
		this.m_player = Player.#model_body.clone();

		this.m_farmer_arm_1 = new THREE.Object3D();
		this.m_farmer_arm_1 = Player.#model_arm.clone();
		this.m_farmer_arm_1.position.set(-0.1,0.45,-0.35);

		this.m_farmer_arm_2 = new THREE.Object3D();
		this.m_farmer_arm_2 =this.m_farmer_arm_1.clone();
		this.m_farmer_arm_2.position.z=0.35;
		this.m_farmer_arm_2.rotateY(Math.PI);

		this.m_player.add(this.m_farmer_arm_1);
		this.m_player.add(this.m_farmer_arm_2);

		this.m_farmer_leg_1 = new THREE.Object3D();
		this.m_farmer_leg_1 = Player.#model_leg;
		this.m_farmer_leg_1.position.set(0,-0.5,-0.35);

		this.m_farmer_leg_2 = new THREE.Object3D();
		this.m_farmer_leg_2 = this.m_farmer_leg_1.clone();
		this.m_farmer_leg_2.position.z=0.35;

		this.m_player.add(this.m_farmer_leg_1);
		this.m_player.add(this.m_farmer_leg_2);

		this.m_player.position.set(x*3,1.5,-z*3);
		scene.add(this.m_player);

		this.a_walk = new TWEEN.Tween(this.m_player.position);
		this.a_rot_y = new TWEEN.Tween(this.m_player.rotation);
		this.a_rot_y.chain(this.a_walk);
	}

	move(dir)
	{	
		if(this.m_player)
		{
			if(!this.a_walk.isPlaying() && !this.a_rot_y.isPlaying())
			{
				var pos = this.m_player.position;
				var new_rot=0;
				var changex=0, changez=0;

				switch (dir)
				{
					case 'up':
						changex= -3;

						if(this.last_rot=='left')
							new_rot=-Math.PI/2;
						else if(this.last_rot=='right')
							new_rot=Math.PI/2;
						else if(this.last_rot=='down')
							new_rot=Math.PI;
					break;
					case 'down':
						changex= 3;
						if(this.last_rot=='left')
							new_rot=Math.PI/2;
						else if(this.last_rot=='right')
							new_rot=-Math.PI/2;
						else if(this.last_rot=='up')
							new_rot=Math.PI;
					break;
					case 'left':
						changez=3;
						if(this.last_rot=='up')
							new_rot=Math.PI/2;
						else if(this.last_rot=='down')
							new_rot=-Math.PI/2;
						else if(this.last_rot=='right')
							new_rot=Math.PI;
					break;
					case 'right':
						changez=-3;
						if(this.last_rot=='up')
							new_rot=-Math.PI/2;
						else if(this.last_rot=='down')
							new_rot=Math.PI/2;
						else if(this.last_rot=='left')
							new_rot=Math.PI;
					break;
				}

				this.last_rot = dir;

				this.a_walk.from(this.m_player.position);	
				this.a_walk.to( {x:pos.x+changex,y:pos.y,z:pos.z+changez}, this.speed);

				if(new_rot !=0)
				{
					this.a_rot_y.from(this.m_player.rotation);
					this.a_rot_y.to({x:0,y:this.m_player.rotation.y+new_rot,z:0},this.speed/6);
					this.a_rot_y.start();
				}
				else
					this.a_walk.start();
			}
		}
	}
}

Player.loadModels();