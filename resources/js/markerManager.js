//Global Variable
let markerDict=new Object;
let markersPathArray=[];
let markersNameArray=[];
let isThis='';

let sound; //the Howler sound
let saveSeek;
let device; //check the device to provide best settings for iOS or Android
let vector = new THREE.Vector3(); //target to getWorldDirection of the listener/camera //https://stackoverflow.com/questions/14813902/three-js-get-the-direction-in-which-the-camera-is-looking

//
//AFRAME Components
//

//[on Scene] Create the markers on start
AFRAME.registerComponent('markers-start',{
	init:function(){
	console.log('Adding markers to the scene');
	device=navigator.platform;
	let sceneEl = document.querySelector('a-scene');
	
	for(let i=1; i<9; i++)
		{
			//console.log(i);
			let markerPath="resources/pattern/pattern-"+i+".patt";
			markersPathArray.push(markerPath);
			markersNameArray.push('Marker_'+i);
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
			markerEl.setAttribute('sound-sample',{src:'sound'+(k+1)});

			markerEl.setAttribute('img-content',{src:'img'+(k+1)});
			markerEl.setAttribute('text-porthole',{src:'text'+(k+1)});
			
			markerEl.setAttribute('porthole-model','');
			sceneEl.appendChild(markerEl);

		}
		if(document.querySelector("#loadingDiv")!==null){
			setTimeout(() => {document.querySelector("#loadingDiv").remove();}, 4000)
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
				if(marker.id!==isThis)
				{
					let notiOS=true;
					if (device==='iPad'||device==='iPhone'||device==='iPod'===true)
				    {
						notiOS=false;
					}
					if(sound!==undefined){sound.stop();}
	  				sound = new Howl({
							mute: false,
							html5: notiOS,
							src: ['resources/sounds/'+marker.components['sound-sample'].data.src+'.webm','resources/sounds/'+marker.components['sound-sample'].data.src+'.mp3'],
		
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
					sound.autoUnlock = true;

					sound.pos(marker.object3D.position.x,marker.object3D.position.y,marker.object3D.position.z); //update the position for spatial sound
					this.data.soundid = sound.play();
					isThis=marker.id;
		
				}
				else
				{
					sound.pos(marker.object3D.position.x,marker.object3D.position.y,marker.object3D.position.z); //update the position for spatial sound
					sound.play(this.data.soundid);
					//sound.seek(saveSeek, this.data.soundid);
				}				
			});

			marker.addEventListener("markerLost",() =>{
				let markerId = marker.id;
				console.log('markerLost', markerId);

				sound.pause(this.data.soundid);
				//saveSeek=sound.seek(this.data.soundid);
				
			});
		},
	});







	//[on Entity - each marker] just a string with the ref of sound to play
AFRAME.registerComponent("sound-sample",{
	schema: {
	 src: {type: 'string'},
   },
  });

  //[on Entity - each marker] just a string with the ref of the image to show in the porthole
AFRAME.registerComponent("img-content",{
	schema: {
	 src: {type: 'string'},
   },
  });

//[on Entity - each marker] just a string with the ref of the 3D text to show in the porthole
AFRAME.registerComponent("text-porthole",{
	schema: {
	 src: {type: 'string'},
   },
  });



//[on Entity - each marker] porthole model and invisible cloak
AFRAME.registerComponent("porthole-model",{
	init:function(){
		let cloak = document.createElement('a-entity');
		let porthole = document.createElement('a-entity');
		let text_porthole = document.createElement('a-entity');

		cloak.setAttribute('id','cloak');
		porthole.setAttribute('id','porthole');
		text_porthole.setAttribute('id','porthole');

		cloak.setAttribute('gltf-model','#cloak_gltf');
		porthole.setAttribute('gltf-model','#porthole_gltf');
		
		text_porthole.setAttribute('gltf-model','#'+this.el.components['text-porthole'].data.src);

		cloak.object3D.scale.set(0.5, 0.5, 0.5);
		porthole.object3D.scale.set(0.5, 0.5, 0.5);
		text_porthole.object3D.scale.set(0.5, 0.5, 0.5);

		cloak.setAttribute('cloak-gltf','')
		porthole.setAttribute('porthole-image','')
		
		this.el.appendChild(cloak);
		this.el.appendChild(porthole);
		this.el.appendChild(text_porthole);

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