let players = require('./player');
let Player = players.Player;

test('prueba player ejemplo', () =>{

	// Escena
	//scene = new THREE.Scene();


    var p = new Player(5, 6,"","");

    expect(
        p.getPos()
    ).toEqual([5,6]);
})