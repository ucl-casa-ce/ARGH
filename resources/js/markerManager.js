//Sound from https://freesound.org/people/Timbre/sounds/385882/

//Global Variable
let markerDict=new Object;
let markersPathArray=[];
let markersNameArray=[];
let soundPathArray=[];

let sound; //the Howler sound
let vector = new THREE.Vector3(); //target to getWorldDirection of the listener/camera //https://stackoverflow.com/questions/14813902/three-js-get-the-direction-in-which-the-camera-is-looking

//
//AFRAME Components
//

//[on Scene] Create the markers on start
AFRAME.registerComponent('markers-start',{
	init:function(){
	console.log('Adding markers to the scene');
	
	let sceneEl = document.querySelector('a-scene');
	
	for(let i=1; i<9; i++)
		{
			let markerPath="resources/pattern/pattern-"+i+".patt";
			markersPathArray.push(markerPath);
			markersNameArray.push('Marker_'+i);

			let soundPath="resources/sounds/pirate.mp3"
			soundPathArray.push(soundPath);
		}

	for(let k=0; k<8; k++)
		{
			let markerEl = document.createElement('a-marker');
			markerEl.setAttribute('type','pattern');
			markerEl.setAttribute('url',markersPathArray[k]);
			markerEl.setAttribute('id',markersNameArray[k]);
			markerEl.setAttribute('registerevents','');
			markerEl.setAttribute('sound-sample',{src:'Pirate'});
			sceneEl.appendChild(markerEl);
		}
	}
});

//[on Marker] Events on markers found and lost
AFRAME.registerComponent('registerevents', {
		init: function () {
			const marker = this.el;

			marker.addEventListener("markerFound", ()=> {
				let markerId = marker.id;
				console.log('markerFound', markerId);

				marker.emit('IamReady',{value:markerId});

			    sound.pos(marker.object3D.position.x,marker.object3D.position.y,marker.object3D.position.z); //update the position for spatial sound
				sound.play(marker.components['sound-sample'].data.src);

				setTimeout(() => { console.log('Playing');}, 20);});

			marker.addEventListener("markerLost",() =>{
				let markerId = marker.id;
				console.log('markerLost', markerId);

				sound.pause();
			});
		},
	});

//[on Camera] it is the player for the sound.
	AFRAME.registerComponent("sound-sample-player",{
		init:function() {
		  sound = new Howl({
		   src: ['resources/sounds/pirate.mp3'],
		   sprite: {
					 //key1: [offset, duration, (loop)]
					 Pirate: [0,19383],
				   },
				   
			  onload: function() {
					   console.log("LOADED");
					 },
			   });
			// Tweak the attributes to get the desired effect.
				   sound.pannerAttr({
						 coneInnerAngle: 360,
						 coneOuterAngle: 360,
						 coneOuterGain: 0,
						 maxDistance: 10000,
						 panningModel:'HRTF',
						 refDistance: 1,
						 rolloffFactor: 1,
						 distanceModel: 'exponential',
					   });
	  },
	 });




	//[on Entity - each sound] just a string with the ref of sound to play
AFRAME.registerComponent("sound-sample",{
	schema: {
	 src: {type: 'string'},
   },
  });



  //[on Camera]. It is the listener of the sounds and update position and orientation every tick
AFRAME.registerComponent("listener-howler",{
	init:function(){
		Howler.pos(this.el.object3D.position.x, this.el.object3D.position.y, this.el.object3D.position.z);
		this.el.object3D.getWorldDirection(vector);
		Howler.orientation(vector.x,vector.y, vector.z, 0, -1, 0); //Threejs Up vector is -1?
	  },
	
	tick:function(){
	  Howler.pos(this.el.object3D.position.x, this.el.object3D.position.y, this.el.object3D.position.z);
	  this.el.object3D.getWorldDirection(vector);
	  Howler.orientation(vector.x,vector.y, vector.z, 0, -1, 0);//Threejs Up vector is -1?
	 }
  });
