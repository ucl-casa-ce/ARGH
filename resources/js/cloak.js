//Source https://stackoverflow.com/questions/56192021/how-to-declare-a-mask-material-using-a-frame-js

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
        console.log(mesh);
        console.log('Done');
      }
    });
  })
}})

AFRAME.registerComponent('porthole-image', {
  init: function() {
    // make sure the model is loaded first
    this.el.addEventListener('model-loaded', e=>{
      let mesh = this.el.getObject3D('mesh') // grab the mesh
      if (mesh === undefined) return;        // return if no mesh :(
      mesh.traverse(function(node) {         // traverse through and apply settings
        if (node.isMesh && node.material && node.material.name==="content") {  // make sure the element can be a cloak
          //node.material.colorWrite = false
          //node.material.needsUpdate = true;

          new THREE.TextureLoader().load(
            "resources/imgs/test_air.jpg",
            texture => {
              //Update Texture
              node.material.map = texture;
              node.material.needsUpdate = true;
            },);
          
          console.log(node.material);
          console.log('');
        }
      });
    })
  }})




//to improve the stability on mobile  https://stackoverflow.com/questions/53380400/aframe-smoothing-position-and-rotation
AFRAME.registerComponent("listener", {
  init: function() {
    this.target = document.querySelector('#target');
    this.prevPosition = null;
    this.prevRotation = null;
  },
 tick: function() {
   if (this.el.object3D.visible) {
     this.target.setAttribute('visible', 'true')
     if(this.prevPosition) {
       this.target.object3D.position.lerp(this.prevPosition, 0.1)
       let rot = this.target.object3D.rotation.toVector3().lerp(this.prevRotation, 0.5)
       this.target.object3D.rotation.setFromVector3(rot)
     } else {
       this.target.setAttribute('position', this.el.getAttribute('position'))
       this.target.setAttribute('rotation', this.el.getAttribute('rotation'))
     }
     this.prevPosition = this.el.object3D.position
     this.prevRotation = this.el.object3D.rotation

    } else {
     this.target.setAttribute('visible', 'false')
      this.prevPosition = null;
      this.prevRotation = null;
    }
 }
})

AFRAME.registerComponent('cloak', {
  init: function() {
    let geometry = new THREE.BoxGeometry( 0.85, 0.85, 0.85);
    geometry.faces.splice(4, 2) // cut out the top faces 
    let material = new THREE.MeshBasicMaterial({
       colorWrite: false
    })
    let mesh = new THREE.Mesh(geometry, material)
    mesh.scale.set(1.1, 1.1, 1.1)
    this.el.object3D.add(mesh)
    console.log('Done');
  }
});