import Vue from 'vue'
import Vuex from 'vuex'
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    width: 0,
    height: 0,
    mainScene: null,
    mainCamera: null,
    floorGrid: null,
    floorPlane: null,
    floorTexture: null,
    sceneObjects: [],
    controls: null,
    renderer: null,
    pointer: null,
    raycaster: null,
    ghostObject: null,
    ghostObjectMaterial: null,
    objectGeo: null,
    objectMaterial: null,
    currentObject: null,
    selectedObject: null
  },
  getters: {
    cameraPosition: state => {
      return state.mainCamera ? state.mainCamera.position : null
    }
  },
  mutations: {
    setCanvasSize(state, {width, height}) {
      state.width = width
      state.height = height
    },
    initializeRenderer(state) {
      state.renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        canvas: document.querySelector('canvas')
      })
      state.renderer.setPixelRatio(window.devicePixelRatio)
      state.renderer.setSize(state.width, state.height)
      // el.appendChild(state.renderer.domElement)
    },
    initializePointer(state) {
      state.pointer = new THREE.Vector2()
    },
    initializeRaycaster(state) {
      state.raycaster = new THREE.Raycaster()
      // state.raycaster.layers.set(2)
    },
    initializeMainCamera(state) {
      state.mainCamera = new THREE.PerspectiveCamera(
        35,
        state.width / state.height,
        0.1,
        1000
      )
      state.mainCamera.name = "Main Camera"
      state.mainCamera.position.x = 0
      state.mainCamera.position.y = 50
      state.mainCamera.position.z = 0
    },
    initializeControls(state) {
      state.controls = new OrbitControls(
        state.mainCamera,
        state.renderer.domElement
      );
      state.controls.minDistance = 20
      state.controls.maxDistance = 500
      state.controls.minPolarAngle = 0 * Math.PI / 180
      state.controls.maxPolarAngle = 80 * Math.PI / 180
      state.controls.minAzimuthAngle = -60 * Math.PI / 180
      state.controls.maxAzimuthAngle = 60 * Math.PI / 180
      state.controls.mouseButtons = {
        RIGHT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        LEFT: THREE.MOUSE.PAN
      }
    },
    updateControls(state) {
      state.controls.update()
    },
    initializeMainScene(state) {
      state.mainScene = new THREE.Scene()
      state.mainScene.name = "Main Scene"
      state.mainScene.background = new THREE.Color(0xcccccc)
      state.mainScene.fog = new THREE.FogExp2(0xcccccc, 0.002)

      //   ////////////// FLOOR/GRID //////////
        var size = 20,
        divisions = 20

        state.floorGrid = new THREE.GridHelper(size, divisions)
        state.floorGrid.name = "Floor Grid"
        // state.floorGrid.layers.enable(1)
        state.mainScene.add(state.floorGrid)

        const floorPlaneGeo = new THREE.PlaneGeometry(size, divisions)
        floorPlaneGeo.rotateX(- Math.PI / 2 )
        state.floorPlane = new THREE.Mesh(floorPlaneGeo, new THREE.MeshBasicMaterial( { visible: false } ))
        state.floorPlane.name = "Floor Plane"
        state.mainScene.add(state.floorPlane)
        state.sceneObjects.push(state.floorPlane)

      ///////// LIGHTS /////////
      var light1 = new THREE.DirectionalLight(0xffffff)
      light1.position.set(1,1,1)
      // light1.layers.enable(1)
      state.mainScene.add(light1)
      var light2 = new THREE.DirectionalLight(0x002288)
      light2.position.set(1,1,1)
      // light2.layers.enable(1)
      state.mainScene.add(light2)
      var light3 = new THREE.AmbientLight(0x222222)
      light3.position.set(1,1,1)
      light3.layers.enable(1)
      state.mainScene.add(light3)
    },
    render(state) {
      state.renderer.render(state.mainScene, state.mainCamera)
    },
    resize(state, {width, height}) {
      state.width = width,
      state.height = height
      state.mainCamera.aspect = width / height
      state.mainCamera.updateProjectionMatrix()
      state.renderer.setSize(width, height)
      state.controls.update()
      state.renderer.render(state.mainScene, state.mainCamera)
    },
    setMainCameraPosition(state, {x, y, z}) {
      if (state.mainCamera) {
        state.mainCamera.position.set(x,y,z)
      }
    },
    resetMainCameraRotation(state) {
      if (state.mainCamera) {
        state.mainCamera.rotation.set(0,0,0)
        state.mainCamera.quaternion.set(0,0,1)
        state.mainCamera.up.set(0,1,0)
        state.controls.target.set(0,0,0)
      }
    },
    selectCurrentObject(state, payload) {
      state.currentObject = null
      state.ghostObject = null
      
      var geometry,
      ghostGeometry,
      material,
      ghostMaterial,
      materialColor = Math.random() * 0xffffff,
      mesh,
      ghostMesh

      if (payload === "Cube") {
        geometry = new THREE.BoxBufferGeometry(2,2,2)
        ghostGeometry = geometry
        material = new THREE.MeshBasicMaterial( { color: materialColor } )
        ghostMaterial = new THREE.MeshBasicMaterial({color: materialColor, opacity: 0.5, transparent: true})
        mesh = new THREE.Mesh( geometry, material )
        mesh.name = "Cube"
        ghostMesh = new THREE.Mesh(ghostGeometry, ghostMaterial)
        ghostMesh.name = "Cube Ghost"
      } else if (payload === "Cone") {
        geometry = new THREE.ConeBufferGeometry(1,2,16)
        ghostGeometry = geometry
        material = new THREE.MeshBasicMaterial( { color: materialColor } )
        ghostMaterial = new THREE.MeshBasicMaterial({color: materialColor, opacity: 0.5, transparent: true})
        mesh = new THREE.Mesh( geometry, material )
        mesh.name = "Cone"
        ghostMesh = new THREE.Mesh(ghostGeometry, ghostMaterial)
        ghostMesh.name = "Cone Ghost"
      } else if (payload === "Cylinder") {
        geometry = new THREE.CylinderBufferGeometry(1,1,2)
        ghostGeometry = geometry
        material = new THREE.MeshBasicMaterial( { color: materialColor } )
        ghostMaterial = new THREE.MeshBasicMaterial({color: materialColor, opacity: 0.5, transparent: true})
        mesh = new THREE.Mesh( geometry, material )
        mesh.name = "Cylinder"
        ghostMesh = new THREE.Mesh(ghostGeometry, ghostMaterial)
        ghostMesh.name = "Cylinder Ghost"
      }
      state.currentObject = mesh
      state.ghostObject = ghostMesh
      state.mainScene.add(state.ghostObject)
    },
    onPointerMove(state, event) {
      
      // state.pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 )
      state.pointer.set( ( event.offsetX / window.innerWidth ) * 2 - 1, - ( event.offsetY / window.innerHeight ) * 2 + 1 )

      state.raycaster.setFromCamera(state.pointer, state.mainCamera)

      const intersects = state.raycaster.intersectObjects( state.sceneObjects, false )

      if(intersects.length > 0) {

        const intersect = intersects[0]

        if(state.ghostObject !== null) {
          state.ghostObject.position.copy(intersect.point).add(intersect.face.normal)
          state.ghostObject.position.divideScalar(2).floor().multiplyScalar(2).addScalar(1)
        }

        state.renderer.render(state.mainScene, state.mainCamera)
      }

    },
    onPointerDown(state, event) {
      // Make it happen on left-click only
      if (event.button === 0){
        // state.pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 )
        state.pointer.set( ( event.offsetX / window.innerWidth ) * 2 - 1, - ( event.offsetY / window.innerHeight ) * 2 + 1 )
  
        state.raycaster.setFromCamera(state.pointer, state.mainCamera)
  
        const intersects = state.raycaster.intersectObjects( state.sceneObjects, false )
  
        if(intersects.length > 0) {
  
          const intersect = intersects[0]
  
          if(state.currentObject !== null) {
            state.currentObject.position.copy(intersect.point).add(intersect.face.normal)
            state.currentObject.position.divideScalar(2).floor().multiplyScalar(2).addScalar(1)
            state.mainScene.add(state.currentObject)
            state.mainScene.remove(state.ghostObject)
            state.sceneObjects.push(state.currentObject)
  
            state.currentObject = null
            state.ghostObject = null
          
          } else if(state.currentObject === null && intersect.object !== state.floorPlane){
            // intersect.object.material.color.setHex(0xffffff)
            state.selectedObject = intersect.object
          } else if (state.selectedObject !== null && intersect.object === state.floorPlane) {
            state.selectedObject = null
          }
  
          state.renderer.render(state.mainScene, state.mainCamera)
  
        }
      }

    },
    moveSelectedObject(state, payload) {
      var degrees = 45 * Math.PI / 180

      var worldDirection = new THREE.Vector3()
      state.mainCamera.getWorldDirection(worldDirection)
      worldDirection.y = 0
      worldDirection.normalize()

      if(payload === "Move Up") {
        // state.selectedObject.translateZ(-.1)
        state.selectedObject.position.addScaledVector(worldDirection, .1)
      } else if(payload === "Move Down") {
        // state.selectedObject.translateZ(.1)
        state.selectedObject.position.addScaledVector(worldDirection, -.1)
      } else if(payload === "Move Left") {
        // state.selectedObject.translateX(-.1)
        worldDirection.cross(state.mainCamera.up)
        state.selectedObject.position.addScaledVector(worldDirection, -.1)
      } else if(payload === "Move Right") {
        // state.selectedObject.translateX(.1)
        worldDirection.cross(state.mainCamera.up)
        state.selectedObject.position.addScaledVector(worldDirection, .1)
      } else if(payload === "Rotate Left 45") {
        state.selectedObject.rotateY(degrees)
      } else if(payload === "Rotate Right 45") {
        state.selectedObject.rotateY(-degrees)
      } else if(payload === "Delete Object") {
        state.mainScene.remove(state.selectedObject)
        state.sceneObjects.splice(state.sceneObjects.indexOf(state.selectedObject), 1)
        state.selectedObject = null
      }
    },
    deleteSelectedObject(state) {
      state.mainScene.remove(state.selectedObject.uuid)
      state.sceneObjects.splice(state.sceneObjects.indexOf(state.selectedObject), 1)
    },
    deleteAllObjects(state) {
      var index = 0,
      addedObjects = state.sceneObjects.splice(index + 1, state.sceneObjects.length - (index + 1))
      state.sceneObjects.splice(index + 1, state.sceneObjects.length - (index + 1))

      for(var i = 0; i <= addedObjects.length; i++){
        state.mainScene.remove(addedObjects[i])
      }
      state.selectedObject = null
    }
  },
  actions: {
    init({  commit}, {width, height}) {
      return new Promise(resolve => {
        commit("setCanvasSize", {width, height})
        commit("initializeRenderer")
        commit("initializePointer")
        commit("initializeRaycaster")
        commit("initializeMainCamera")
        commit("initializeControls")
        commit("initializeMainScene")

        commit("render")

        resolve()
      })
    },
    animate({state, dispatch}) {

      window.requestAnimationFrame(() => {
        dispatch("animate")
      })

      state.controls.update()

      state.renderer.render(state.mainScene, state.mainCamera)

    },
    selectCurrentObject({commit}, payload) {
      commit("selectCurrentObject", payload)
    },
    moveSelectedObject({commit}, payload) {
      commit("moveSelectedObject", payload)
    },
    deleteSelectedObject({commit}, payload) {
      commit("deleteSelectedObject", payload)
    },
    deleteAllObjects({commit}) {
      commit("deleteAllObjects")
    }
  }
})

export default store
