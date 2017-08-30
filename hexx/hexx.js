'use strict';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

var dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(10, 10, 5);
scene.add(dirLight);

var tops = [];
var extent = 10;
var steps = 50;
var c = Math.PI * 2 / steps;
const stepSize = 2 * extent / steps;
const material = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );

let zCoordA = 0;
let zCoordB = 0;

for (let x = 0; x < steps; x++) {
    let xCoordA = (stepSize * x) - extent;
    let xCoordB = xCoordA + stepSize;
    for (let y = 0; y < steps; y++) {
        let yCoordA = (stepSize * y) - extent;
        let yCoordB = yCoordA + stepSize;
/*
        let geometry = new THREE.Geometry();
        [
            [ xCoordA, yCoordA, zCoordA ],
            [ xCoordA, yCoordB, zCoordA ],
            [ xCoordB, yCoordB, zCoordB ],
            [ xCoordB, yCoordA, zCoordB ],
            [ xCoordA, yCoordA, zCoordA ]
        ].forEach((c) => { geometry.vertices.push(new THREE.Vector3(c[0], c[1], c[2])); });
*/
        let geometry = new THREE.PlaneGeometry(stepSize, stepSize);
        let edgesGeom = new THREE.EdgesGeometry(geometry);
        let mesh = new THREE.LineSegments(edgesGeom, material);
        let rad = 2 * Math.PI * x / steps;
        mesh.position.x = xCoordA;
        mesh.position.y = yCoordA;
        mesh.position.z = 0.5 * extent * Math.sin(rad);
        //mesh.rotation.y = Math.cos(rad) * Math.PI * 2;
        mesh.rotation.y = -1 * Math.cos(rad);
        scene.add(mesh);
    }
}

camera.position.x = camera.position.y = 5;
camera.position.z = 15;

// Add the orbit controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target = new THREE.Vector3(0, 0, 0);

var offset = 0;
var render = () => {
    requestAnimationFrame( render );
    renderer.render(scene, camera);
    controls.update();
};

//  save camera views
const savedCamera = JSON.parse( localStorage.getItem( 'savedCamera' ) );
if( savedCamera ){
    camera.position.copy( savedCamera.cameraPosition );
    controls.target.copy( savedCamera.targetPosition );
}

window.addEventListener( 'unload', function(){
    localStorage.savedCamera = JSON.stringify({
        cameraPosition: camera.position,
        targetPosition: controls.target
    });
});

render();
