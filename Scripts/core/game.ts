/// <reference path="_reference.ts"/>

// MAIN GAME FILE

// THREEJS Aliases
import Scene = THREE.Scene;
import Renderer = THREE.WebGLRenderer;
import PerspectiveCamera = THREE.PerspectiveCamera;
import BoxGeometry = THREE.BoxGeometry;
import CubeGeometry = THREE.CubeGeometry;
import PlaneGeometry = THREE.PlaneGeometry;
import SphereGeometry = THREE.SphereGeometry;
import Geometry = THREE.Geometry;
import AxisHelper = THREE.AxisHelper;
import LambertMaterial = THREE.MeshLambertMaterial;
import Texture = THREE.Texture;
import MeshBasicMaterial = THREE.MeshBasicMaterial;
import Material = THREE.Material;
import Mesh = THREE.Mesh;
import Object3D = THREE.Object3D;
import SpotLight = THREE.SpotLight;
import PointLight = THREE.PointLight;
import AmbientLight = THREE.AmbientLight;
import Control = objects.Control;
import GUI = dat.GUI;
import Color = THREE.Color;
import Vector3 = THREE.Vector3;
import Face3 = THREE.Face3;
import Point = objects.Point;
import myScreenConf = config.Screen;

//Custom Game Objects
import gameObject = objects.gameObject;

var scene: Scene;
var renderer: Renderer;
var camera: PerspectiveCamera;
var axes: AxisHelper;
var cubes: Array<Mesh>;
var plane: Mesh;
var sphere: Mesh;
var texture: Texture;
var ambientLight: AmbientLight;
var spotLight: SpotLight;
var control: Control;
var gui: GUI;
var stats: Stats;
var pivot: Object3D;
var step: number = 0;
var cubeGeometry:CubeGeometry;
var cubeMaterial:LambertMaterial;
var rotationDirection :number;
function init() {
    // Instantiate a new Scene object
    scene = new Scene();
    //cubes = new Mesh[16];

    setupRenderer(); // setup the default renderer
	
    setupCamera(); // setup the camera
	
    // add an axis helper to the scene
    axes = new AxisHelper(10);
    scene.add(axes);
    console.log("Added Axis Helper to scene...");
    texture= THREE.ImageUtils.loadTexture('Content/Textures/wood.jpg');
    //Add a Plane to the Scene
    plane = new gameObject(
        new PlaneGeometry(16, 16, 1, 1),
        new LambertMaterial({ color: 0xE79B61 }),
        0, 0, 0);

    plane.rotation.x = -0.5 * Math.PI;

    scene.add(plane);
    console.log("Added Plane Primitive to scene...");
    
     
    //cube-man creation
    cubes=[];
    //left leg
    createBodyPart(1,0,0,0.31,0.72,0.21,0);
    createBodyPart(1,-0.5,1.55,0.2,0.2,1.25,0);
    createBodyPart(0.8,-0.5,4.2,0.2,0.2,1.25,-8);
    //right leg
    createBodyPart(-1,0,0,0.31,0.72,0.21,0);
    createBodyPart(-1,-0.5,1.55,0.2,0.2,1.25,0);
    createBodyPart(-1,-0.5,4.18,0.2,0.2,1.25,0);
    //left hand
    createBodyPart(2,-0.4,9.2,0.2,0.2,1,40.5);
    //hand rotation
    pivot = new THREE.Object3D();
    createNonstaticBodyPart(0.29,-0.34,0.97,0.2,0.2,1,13.6);
    createNonstaticBodyPart(0.79,-0.45,2.6,0.26,0.08,0.52,26.5);
    createNonstaticBodyPart(0.05,-0.45,2.5,0.1,0.09,0.2,-37.5);
    pivot.position.set(2.83,10.12,-0.59);
    rotationDirection=1;
    scene.add(pivot);
    //righ hand
    createBodyPart(-3.3,-0.46,4.5,0.2,0.2,0.38,0);
    createBodyPart(-3,-0.4,6,0.2,0.2,1,13.6);
    createBodyPart(-2.1,-0.4,8,0.2,0.2,1,40.5);
    //body, neck, head
    createBodyPart(0,-0.3,7.1,1.077,0.417,1.757,0);
    createBodyPart(0.0,-0.5,8.7,0.2,0.2,1,0);
    createBodyPart(-0.1,-0.35,10,0.7,0.7,0.7,0);
    
    
    
    
    
 
    cubes.forEach(element => {
        element.castShadow = true;
        element.receiveShadow = true;
        scene.add(element);
        
    });
    
    // Add an AmbientLight to the scene
    ambientLight = new AmbientLight(0x090909);
    scene.add(ambientLight);
    console.log("Added an Ambient Light to Scene");
	
    // Add a SpotLight to the scene
    spotLight = new SpotLight(0xffffff);
    spotLight.position.set(5.6, 23.1, 5.4);
    spotLight.rotation.set(-0.8,42.7,119.5);
    spotLight.intensity=2;
    spotLight.castShadow = true;
    scene.add(spotLight);
    console.log("Added a SpotLight Light to Scene");
    
    // add controls
    gui = new GUI();
    control= new Control(0.01);
    addControl(control);

    // Add framerate stats
    addStatsObject();
    console.log("Added Stats to scene...");

    document.body.appendChild(renderer.domElement);
    gameLoop(); // render the scene	
    
    window.addEventListener('resize', onResize, false);
}

function createBodyPart(x:number,z:number,y:number,h:number,d:number,w:number,z_rotation:number):void{
    cubeMaterial= new LambertMaterial({map:texture});
    cubeGeometry = new CubeGeometry(h*1.75,w*1.75,d*1.75);
    var thisCube:Mesh = new Mesh(cubeGeometry,cubeMaterial);
    thisCube.position.set(x,y,z);
    thisCube.rotation.z=-z_rotation /180 * Math.PI;
    cubes.push(thisCube);
 }
 
 function createNonstaticBodyPart(x:number,z:number,y:number,h:number,d:number,w:number,z_rotation:number):void{
    cubeMaterial= new LambertMaterial({map:texture});
    cubeGeometry = new CubeGeometry(h*1.75,w*1.75,d*1.75);
    var thisCube:Mesh = new Mesh(cubeGeometry,cubeMaterial);
    thisCube.position.set(x,y,z);
    thisCube.rotation.z=-z_rotation /180 * Math.PI;
    pivot.add( thisCube );
}

function onResize(): void {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function addControl(controlObject: Control): void {
    gui.add(controlObject, 'rotationSpeed',-0.25,0.25);
}

function addStatsObject() {
    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);
}

// Setup main game loop
function gameLoop(): void {
    stats.update();
    
    pivot.rotation.z+=rotationDirection*control.rotationSpeed;;
    if(Math.abs(pivot.rotation.z) > 45/180 * Math.PI){
       rotationDirection=-rotationDirection;
     }
     
    
    // render using requestAnimationFrame
    requestAnimationFrame(gameLoop);
	
    // render the scene
    renderer.render(scene, camera);
}

// Setup default renderer
function setupRenderer(): void {
    renderer = new Renderer();
    renderer.setClearColor(0xEEEEEE, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    console.log("Finished setting up Renderer...")
}

// Setup main camera for the scene
function setupCamera(): void {
   // camera = new PerspectiveCamera(45, myScreenConf.ration, 0.1, 1000);
    camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = 8.7;
    camera.position.y = 20.47;//z
    camera.position.z = 20.9;//y axis in blender
    camera.lookAt(new Vector3(0, 5, 0));
    console.log("Finished setting up Camera...");
}
