import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import GUI from 'lil-gui'

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load( import.meta.env.BASE_URL + 'textures/matcaps/8.png')
const matcapTexture2 = textureLoader.load( import.meta.env.BASE_URL + 'textures/matcaps/3.png')

const gui = new GUI()
const parameters = {
  text: 'Welcome',
  wireframe: false,
  donutCount: 300
}

let textMesh = null
let donutMeshes = []
let textMaterial = null
let donutMaterial = null
let fontRef = null

matcapTexture.colorSpace = THREE.SRGBColorSpace
const fontLoader = new FontLoader()
fontLoader.load(import.meta.env.BASE_URL + 'fonts/helvetiker_regular.typeface.json',
  (font) => {

    fontRef = font

    textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture2 })
    donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

    const createText = () =>
    {
      if(textMesh)
      {
        textMesh.geometry.dispose()
        scene.remove(textMesh)
      }

      const textGeometry = new TextGeometry(parameters.text, {
        font: fontRef,
        size: 0.5,
        depth: 0.2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4
      })

      textGeometry.center()

      textMesh = new THREE.Mesh(textGeometry, textMaterial)
      scene.add(textMesh)
    }

    const createDonuts = () =>
    {
      for(const donut of donutMeshes)
      {
        donut.geometry.dispose()
        scene.remove(donut)
      }

      donutMeshes = []

      const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)

      for (let i = 0; i < parameters.donutCount; i++)
      {
        const donut = new THREE.Mesh(donutGeometry, donutMaterial)

        let positionFound = false
        while (!positionFound)
        {
          const x = (Math.random() - 0.5) * 10
          const y = (Math.random() - 0.5) * 10
          const z = (Math.random() - 0.5) * 10

          const distance = Math.sqrt(x * x + y * y + z * z)

          if (distance > 1.5)
          {
            donut.position.set(x, y, z)
            positionFound = true
          }
        }

        donut.rotation.x = Math.random() * Math.PI
        donut.rotation.y = Math.random() * Math.PI

        const scale = Math.random()
        donut.scale.set(scale, scale, scale)

        scene.add(donut)
        donutMeshes.push(donut)
      }
    }

    createText()
    createDonuts()

    // GUI CONTROLS 👇
    gui.add(parameters, 'text')
      .name('Text')
      .onFinishChange(() =>
      {
        createText()
      })

    gui.add(parameters, 'wireframe')
      .name('Wireframe')
      .onChange((value) =>
      {
        textMaterial.wireframe = value
        donutMaterial.wireframe = value
      })

    gui.add(parameters, 'donutCount')
      .min(0)
      .max(500)
      .step(1)
      .name('Donuts')
      .onFinishChange(() =>
      {
        createDonuts()
      })
  }
)


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
