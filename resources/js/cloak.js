//Source https://stackoverflow.com/questions/56192021/how-to-declare-a-mask-material-using-a-frame-js

//[on Entity Cloak] to create the invisible cloak
AFRAME.registerComponent('cloak-gltf', {
init: function() {
  // make sure the model is loaded first
  this.el.addEventListener('model-loaded', e=>{
    let mesh = this.el.getObject3D('mesh') // grab the mesh
    if (mesh === undefined) return;        // return if no mesh :(
    mesh.traverse(function(node) {         // traverse through and apply settings
      if (node.isMesh && node.material) {  // make sure the element can be a cloak
        node.material.colorWrite = false
        node.material.needsUpdate = true;
      }
    });
  })
}})

//[on Entity porthole] to change the image of the material 'content'
AFRAME.registerComponent('porthole-image', {
  init: function() {
    let device=navigator.platform; //we need to check the iOS version
    let that=this;

    let parentEl=that.el.object3D.parent.el; //we need the data from the marker, parent of the object
    
    // make sure the model is loaded first
    this.el.addEventListener('model-loaded', e=>{
      let mesh = this.el.getObject3D('mesh') // grab the mesh
      if (mesh === undefined) return;        // return if no mesh :(
      mesh.traverse(function(node) {         // traverse through and apply settings
      if (node.isMesh && node.material && node.material.name==="content") {  // make sure we are using the right material
          new THREE.TextureLoader().load(
          "resources/imgs/"+parentEl.components['img-content'].data.src+".jpg",
           texture => {
              //Update Texture
         if (device==='iPad'||device==='iPhone'||device==='iPod'===true)
				    {
              ver = iOSversion();

                if (ver[0] >= 13) {
                  texture.center.set(.5, .5);
                  node.material.map = texture;
                  node.material.needsUpdate = true;
                }
                else
                {
                  texture.center.set(.5, .5);
                  texture.rotation = Math.PI ; //on iOS 12 we need to turn the image upside-down
                  node.material.map = texture;
                  node.material.needsUpdate = true;
                }
              
            }
            else{
              node.material.map = texture;
              node.material.needsUpdate = true;
            }
            },);
        }
      });
    })
  }})

  //Return the version of iOS used by the device
  function iOSversion() {
    if (/iP(hone|od|ad)/.test(navigator.platform)) {
      // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
      var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
      return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
    }
  }