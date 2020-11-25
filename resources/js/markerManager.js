//Sound from https://freesound.org/people/Timbre/sounds/385882/

//Global Variable
let markerDict=new Object;
let markersPathArray=[];
let markersNameArray=[];
let soundPathArray=[];
let isThis=99;

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
			console.log(i);
			let markerPath="resources/pattern/pattern-"+i+".patt";
			markersPathArray.push(markerPath);
			markersNameArray.push('Marker_'+i);

			//let soundPath="resources/sounds/Argh.mp3"
			//soundPathArray.push(soundPath);
			
		}

	for(let k=0; k<8; k++)
		{
			let markerEl = document.createElement('a-marker');
			markerEl.setAttribute('type','pattern');
			markerEl.setAttribute('url',markersPathArray[k]);
			markerEl.setAttribute('id',markersNameArray[k]);
			
			markerEl.setAttribute('smooth','true');
			markerEl.setAttribute('smoothCount','10');
			markerEl.setAttribute('smoothTolerance','0.05');
			markerEl.setAttribute('smoothThreshold','10');

			markerEl.setAttribute('registerevents','');
			markerEl.setAttribute('sound-sample',{src:'pattern'+(k+1)});
			markerEl.setAttribute('porthole-model','');
			sceneEl.appendChild(markerEl);

		}
	}
});

//[on Marker] Events on markers found and lost
AFRAME.registerComponent('registerevents', {
	schema: {
		soundid: {type: 'int', default:0},
	  },
		init: function () {
			const marker = this.el;
			
			marker.addEventListener("markerFound", ()=> {
				let markerId = marker.id;
				console.log('markerFound', markerId);
				//marker.emit('IamReady',{value:markerId});
				if(marker.id!==isThis)
				{
					console.log();
					if(!sound._sprite.hasOwnProperty(marker.components['sound-sample'].data.src)){return;}
									
					sound.pos(marker.object3D.position.x,marker.object3D.position.y,marker.object3D.position.z); //update the position for spatial sound
					this.data.soundid = sound.play(marker.components['sound-sample'].data.src);
					console.log(this.data.soundid );
					isThis=marker.id;
		
				}
				else
				{
					if(!sound._sprite.hasOwnProperty(marker.components['sound-sample'].data.src)){return;}
					console.log(isThis);
					sound.pos(marker.object3D.position.x,marker.object3D.position.y,marker.object3D.position.z); //update the position for spatial sound
					sound.play(this.data.soundid);
					console.log(this.data.soundid );
				}				
			//	setTimeout(() => { console.log('Playing');}, 20);
			});

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
		   src: ['resources/sounds/Argh_Low.mp3'],
		   sprite: {
					 //key1: [offset, duration, (loop)]
					 pattern1: [0,87754],
					 pattern2: [87754,151157],
					 pattern3: [178912,150723],
					 pattern5: [269635,55789]
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


AFRAME.registerComponent("porthole-model",{
	init:function(){
		let cloak = document.createElement('a-entity');
		let porthole = document.createElement('a-entity');

		cloak.setAttribute('id','cloak');
		porthole.setAttribute('id','porthole');

		cloak.setAttribute('gltf-model','#cloak_gltf');
		porthole.setAttribute('gltf-model','#porthole_gltf');
		
		cloak.object3D.scale.set(0.5, 0.5, 0.5);
		porthole.object3D.scale.set(0.5, 0.5, 0.5);

		cloak.setAttribute('cloak-gltf','')
		porthole.setAttribute('porthole-image','')
		
		this.el.appendChild(cloak);
		this.el.appendChild(porthole);

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

