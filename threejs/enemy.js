class Enemy {
	static #model_body;
	static #model_arm;
	static #model_leg;

	static #arm_leg_rot = 0.4;
	static #body_rot = 0.15;

	last_place=[0,0];
	new_place=[0,0];

	speed=700;
	last_rot='left';
	moving = 0;

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

	loadPlayer(x,z,scene,matrix)
	{
		this.m_player = new THREE.Object3D();

		this.m_body = new THREE.Object3D();
		this.m_body = Player.#model_body.clone();

		this.m_arm_1 = new THREE.Object3D();
		this.m_arm_1 = Player.#model_arm.clone();
		this.m_arm_1.position.set(-0.1,0.45,-0.35);

		this.m_arm_2 = new THREE.Object3D();
		this.m_arm_2 =this.m_arm_1.clone();
		this.m_arm_2.position.z=0.35;
		this.m_arm_2.rotation.y=Math.PI;

		this.m_body.add(this.m_arm_1);
		this.m_body.add(this.m_arm_2);

		this.m_leg_1 = new THREE.Object3D();
		this.m_leg_1 = Player.#model_leg;
		this.m_leg_1.position.set(0,-0.5,-0.35);

		this.m_leg_2 = new THREE.Object3D();
		this.m_leg_2 = this.m_leg_1.clone();
		this.m_leg_2.position.z=0.35;

		this.m_body.add(this.m_leg_1);
		this.m_body.add(this.m_leg_2);

		this.m_player.add(this.m_body);
		this.m_player.scale.set(1.2,1.2,1.2);

		this.m_player.position.set(x*3,1.7,-z*3);
		this.matrix=matrix;
		this.matrix.changePosition(z,x,grid_player);
		this.last_place=[z,x];
		this.new_place=[z,x];

		scene.add(this.m_player);

		this.a_walk = new TWEEN.Tween(this.m_player.position);
		this.a_rot_y = new TWEEN.Tween(this.m_player.rotation);
		this.a_rot_x = new TWEEN.Tween(this.m_body.rotation);
		this.a_rot_x.onComplete(()=>{
			this.moving=0;
		})
		this.a_leg_1 = new TWEEN.Tween(this.m_leg_1.rotation);
		this.a_leg_2 = new TWEEN.Tween(this.m_leg_2.rotation);
		this.a_arm_1 = new TWEEN.Tween(this.m_arm_1.rotation);
		this.a_arm_2 = new TWEEN.Tween(this.m_arm_2.rotation);
		//this.a_rot_y.chain(this.a_walk,this.a_rot_x,this.a_leg_1,this.a_leg_2,this.a_arm_1,this.a_arm_2);
	}

	move(dir)
	{	
		if(this.m_player)
		{
			if(!this.moving)
			{
				var pos = this.m_player.position;
				var new_rot=0;
				var changex=0, changez=0;

				//se supone que llego aqui con last place y new place siendo iguales

				switch (dir)
				{
					case 'up':

						this.new_place[1] --;
						changex= -3;

						if(this.last_rot=="left")
							new_rot=-Math.PI/2;
						else if(this.last_rot=='right')
							new_rot=Math.PI/2;
						else if(this.last_rot=='down')
							new_rot=Math.PI;
					break;
					case 'down':
						this.new_place[1] ++;
						changex= 3;
						if(this.last_rot=='left')
							new_rot=Math.PI/2;
						else if(this.last_rot=='right')
							new_rot=-Math.PI/2;
						else if(this.last_rot=='up')
							new_rot=Math.PI;
					break;
					case 'left':
						this.new_place[0] --;
						changez=3;
						if(this.last_rot=='up')
							new_rot=Math.PI/2;
						else if(this.last_rot=='down')
							new_rot=-Math.PI/2;
						else if(this.last_rot=='right')
							new_rot=Math.PI;
					break;
					case 'right':
						this.new_place[0] ++;
						changez=-3;
						if(this.last_rot=='up')
							new_rot=-Math.PI/2;
						else if(this.last_rot=='down')
							new_rot=Math.PI/2;
						else if(this.last_rot=='left')
							new_rot=Math.PI;
					break;
				}

				var state_pos = this.matrix.checkPosition(this.new_place[0],this.new_place[1]);

				this.last_rot = dir;

				if (state_pos == grid_no)
				{
					this.new_place=this.last_place.slice();
					
					if(new_rot!=0)
					{
						this.moving=1;
						this.a_rot_y.from(this.m_player.rotation);
						this.a_rot_y.to({y:this.m_player.rotation.y+new_rot},this.speed/7);
						this.a_rot_y.start();
						setTimeout(()=>{
							this.moving=0;
						},this.speed/7);
					}
				}

				else{

					//esto es de momento, cuando haga lo de que este en dos laos a la vez o que se cambie a la mitad del tiempo lo tengo que cambiar
					//tambien tengo que meter al tio en la matriz y cambiarlo de sitio alli aaa

					this.a_walk.from(this.m_player.position);	
					this.a_walk.to( {x:pos.x+changex,z:pos.z+changez}, this.speed);
					
					this.a_rot_x.from(this.m_body.rotation);
					this.a_rot_x.to({x:[Player.#body_rot,0,-Player.#body_rot,0]},this.speed);
	
					this.a_leg_1.from(this.m_leg_1.rotation);
					this.a_leg_1.to({z:[-Player.#arm_leg_rot,0,Player.#arm_leg_rot,0]},this.speed);
	
					this.a_leg_2.from(this.m_leg_2.rotation);
					this.a_leg_2.to({z:[Player.#arm_leg_rot,0,-Player.#arm_leg_rot,0]},this.speed);
	
					this.a_arm_1.from(this.m_arm_1.rotation);
					this.a_arm_1.to({z:[Player.#arm_leg_rot,0,-Player.#arm_leg_rot,0]},this.speed);
	
					this.a_arm_2.from(this.m_arm_2.rotation);
					this.a_arm_2.to({z:[Player.#arm_leg_rot,0,-Player.#arm_leg_rot,0]},this.speed);
	
					if(new_rot !=0)
					{
						this.moving=1;
						this.a_rot_y.from(this.m_player.rotation);
						this.a_rot_y.to({y:this.m_player.rotation.y+new_rot},this.speed/7);
						this.a_rot_y.start();
						setTimeout(()=>{

							setTimeout(()=>{
								this.matrix.changePosition(this.last_place[0],this.last_place[1],grid_empty);
								this.matrix.changePosition(this.new_place[0],this.new_place[1],grid_player);
								this.last_place=this.new_place.slice();
							},this.speed/7/2);

							this.a_walk.start();
							this.a_rot_x.start();
							this.a_leg_1.start();
							this.a_leg_2.start();
							this.a_arm_1.start();
							this.a_arm_2.start();
						},this.speed/7);
						
					}
					else
					{
						this.moving=1;
						setTimeout(()=>{
							this.matrix.changePosition(this.last_place[0],this.last_place[1],grid_empty);
							this.matrix.changePosition(this.new_place[0],this.new_place[1],grid_player);
							this.last_place=this.new_place.slice();
						},this.speed/7/2);
						this.a_walk.start();
						this.a_rot_x.start();
						this.a_leg_1.start();
						this.a_leg_2.start();
						this.a_arm_1.start();
						this.a_arm_2.start();
					}
				}
			}
		}
	}
}

Player.loadModels();