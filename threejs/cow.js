class Cow {
	static #model_body;
	static #model_leg;
	static #model_tail;

	static #leg_rot = 0.45;
	static #body_rot = 0.2;

	last_place=[0,0];
	new_place=[0,0];

	static speed=750;
	last_rot='left';
	moving = 0;

	static loadModels()
	{
		const gltfloader = new THREE.GLTFLoader();
		gltfloader.load( 'models/cow/cow.glb', function ( cow_gltf ) {

			gltfloader.load('models/cow/cow_leg.glb', function (cow_leg_gltf){

				gltfloader.load('models/cow/cow_tail.glb', function (cow_tail_gltf){

					Cow.#model_body = cow_gltf.scene;
					Cow.#model_body.traverse(function(child){
						child.castShadow = true;
					});

					Cow.#model_leg = cow_leg_gltf.scene;
					Cow.#model_leg.traverse(function(child){
						child.castShadow = true;
					});

					Cow.#model_tail = cow_tail_gltf.scene;
					Cow.#model_tail.traverse(function(child){
						child.castShadow = true;
					});

				});
			});
		}, undefined, function (error){
			console.error(error);
		});
	}

	constructor(x,z,dir,scene,matrix)
	{
		this.m_cow = new THREE.Object3D();

		this.m_body = Cow.#model_body.clone();

		this.m_tail = Cow.#model_tail.clone();
		this.m_tail.position.z=-0.95;
		this.m_tail.position.y=0.15;

		this.m_leg_1 = Cow.#model_leg.clone();
		this.m_leg_1.position.x=0.5;
		this.m_leg_1.position.y=-0.5;

		this.m_leg_2 = this.m_leg_1.clone();
		this.m_leg_2.position.x=-0.48;
		this.m_leg_2.rotation.y=Math.PI;

		this.m_leg_3 = this.m_leg_1.clone();
		this.m_leg_3.position.z=-0.75;

		this.m_leg_4 = this.m_leg_3.clone();
		this.m_leg_4.position.x=-0.48;
		this.m_leg_4.rotation.y=Math.PI;

		this.m_body.add(this.m_leg_1);
		this.m_body.add(this.m_leg_2);
		this.m_body.add(this.m_leg_3);
		this.m_body.add(this.m_leg_4);
		this.m_body.add(this.m_tail);

		this.m_cow.add(this.m_body);

		this.m_cow.scale.set(0.9,0.9,0.9);

		this.m_cow.position.set(x*grid_size,1.2,-z*grid_size);
		this.matrix=matrix;
		this.matrix.changePosition(x,z,grid_enemy,this);
		this.last_place=[x,z];
		this.new_place=[x,z];

		this.scene = scene;

		this.scene.add(this.m_cow);

		this.a_walk = new TWEEN.Tween(this.m_cow.position);
		this.a_rot_y = new TWEEN.Tween(this.m_cow.rotation);
		this.a_rot_x = new TWEEN.Tween(this.m_body.rotation);
		this.a_rot_x.onComplete(()=>{
			this.moving=0;
		})
		this.a_leg_1 = new TWEEN.Tween(this.m_leg_1.rotation);
		this.a_leg_2 = new TWEEN.Tween(this.m_leg_2.rotation);
		this.a_leg_3 = new TWEEN.Tween(this.m_leg_3.rotation);
		this.a_leg_4 = new TWEEN.Tween(this.m_leg_4.rotation);
		this.a_tail = new TWEEN.Tween(this.m_tail.rotation);

		switch (dir)
		{
			case "left":
			break;

			case 'up':
				this.m_cow.rotation.y -= Math.PI/2;
			break;

			case 'down':
				this.m_cow.rotation.y += Math.PI/2;
			break;

			case 'right':
				this.m_cow.rotation.y += Math.PI;
			break;
		}
		this.last_rot=dir;
	}

	destroy()
	{
		this.scene.remove(this.m_cow);
	}

	move(player_pos)
	{	
		if(this.m_cow)
		{
			this.player_pos = player_pos;
			if(!this.moving)
			{
				var pos = this.m_cow.position;
				var new_rot=0;
				var changex=0, changez=0;
				var previous_last_rot=this.last_rot;

				var dif = [this.new_place[0] - player_pos[0], this.new_place[1] - player_pos[1]];

				if (Math.abs(dif[0])>Math.abs(dif[1]))
				{
					if(dif[0]>0)
					{
						this.new_place[0] --;
						changex= -grid_size;

						if(this.last_rot=="left")
							new_rot=-Math.PI/2;
						else if(this.last_rot=='right')
							new_rot=Math.PI/2;
						else if(this.last_rot=='down')
							new_rot=Math.PI;

						this.last_rot = "up";
					}
					else
					{
						this.new_place[0] ++;
						changex= grid_size;
						if(this.last_rot=='left')
							new_rot=Math.PI/2;
						else if(this.last_rot=='right')
							new_rot=-Math.PI/2;
						else if(this.last_rot=='up')
							new_rot=Math.PI;

						this.last_rot = "down";
					}
				}
				else
				{
					if(dif[1]>0)
					{

						this.new_place[1] --;
						changez=grid_size;
						if(this.last_rot=='up')
							new_rot=Math.PI/2;
						else if(this.last_rot=='down')
							new_rot=-Math.PI/2;
						else if(this.last_rot=='right')
							new_rot=Math.PI;
						
						this.last_rot = "left";
					}
					else
					{
						this.new_place[1] ++;
						changez=-grid_size;
						if(this.last_rot=='up')
							new_rot=-Math.PI/2;
						else if(this.last_rot=='down')
							new_rot=Math.PI/2;
						else if(this.last_rot=='left')
							new_rot=Math.PI;

						this.last_rot = "right";
					}
				}

				var state_pos = this.matrix.checkPosition(this.new_place[0],this.new_place[1]);


				if (state_pos == grid_hay || state_pos == grid_hay_carrot)
				{
					this.moving=true;
					setTimeout(()=>{
						this.matrix.deleteObject(this.new_place[0],this.new_place[1]);
						this.new_place=this.last_place.slice();
						this.last_rot=previous_last_rot;
					},200);
					setTimeout(()=>{
						this.moving=false;
					},Hay.anim_speed+200);
				}

				
				else if (state_pos == grid_enemy)
				{
					this.moving = true;
					setTimeout(()=>{
						this.new_place=this.last_place.slice();
						this.last_rot=previous_last_rot;
						this.moving=false;
					},Cow.speed);
				}

				else{

					this.a_walk.from(this.m_cow.position);	
					this.a_walk.to( {x:pos.x+changex,z:pos.z+changez}, Cow.speed);
					
					this.a_rot_x.from(this.m_body.rotation);
					this.a_rot_x.to({z:[Cow.#body_rot,0,-Cow.#body_rot,0]},Cow.speed);
	
					this.a_leg_1.from(this.m_leg_1.rotation);
					this.a_leg_1.to({x:[-Cow.#leg_rot,0,Cow.#leg_rot,0]},Cow.speed);
	
					this.a_leg_2.from(this.m_leg_2.rotation);
					this.a_leg_2.to({x:[Cow.#leg_rot,0,-Cow.#leg_rot,0]},Cow.speed);
	
					this.a_leg_3.from(this.m_leg_3.rotation);
					this.a_leg_3.to({x:[-Cow.#leg_rot,0,Cow.#leg_rot,0]},Cow.speed);
	
					this.a_leg_4.from(this.m_leg_4.rotation);
					this.a_leg_4.to({x:[Cow.#leg_rot,0,-Cow.#leg_rot,0]},Cow.speed);

					this.a_tail.from(this.m_tail.rotation);
					this.a_tail.to({z:[-Cow.#leg_rot*1.5,0,Cow.#leg_rot*1.5,0]},Cow.speed);
	
					if(new_rot !=0)
					{
						this.moving=1;
						this.a_rot_y.from(this.m_cow.rotation);
						this.a_rot_y.to({y:this.m_cow.rotation.y+new_rot},Cow.speed/3);
						this.a_rot_y.start();
						this.matrix.changePosition(this.new_place[0],this.new_place[1],grid_enemy,this);
						setTimeout(()=>{
							setTimeout(()=>{
								this.matrix.changePosition(this.last_place[0],this.last_place[1],grid_empty,"");
								if((this.player_pos[0] == this.new_place[0] && this.player_pos[1] == this.new_place[1])
									||(this.player_pos[0] == this.last_place[0] && this.player_pos[1] == this.last_place[1]))
								{
									lose=1;
								}
								this.last_place=this.new_place.slice();

							},Cow.speed/2);

							this.a_walk.start();
							this.a_rot_x.start();
							this.a_leg_1.start();
							this.a_leg_2.start();
							this.a_leg_3.start();
							this.a_leg_4.start();
							this.a_tail.start();
						},Cow.speed/3);
						
					}
					else
					{
						this.moving=1;
						this.matrix.changePosition(this.new_place[0],this.new_place[1],grid_enemy,this);
						setTimeout(()=>{
							this.matrix.changePosition(this.last_place[0],this.last_place[1],grid_empty,"");
							this.matrix.changePosition(this.last_place[0],this.last_place[1],grid_empty,"");
							if((this.player_pos[0] == this.new_place[0] && this.player_pos[1] == this.new_place[1])
								||(this.player_pos[0] == this.last_place[0] && this.player_pos[1] == this.last_place[1]))
							{
								lose=1;
							}
							this.last_place=this.new_place.slice();

						},Cow.speed/2);
						this.a_walk.start();
						this.a_rot_x.start();
						this.a_leg_1.start();
						this.a_leg_2.start();
						this.a_leg_3.start();
						this.a_leg_4.start();
						this.a_tail.start();
					}
				}
			}
		}
	}
}

Cow.loadModels();