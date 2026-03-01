import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load( import.meta.env.BASE_URL + '/static/textures/matcaps/8.png')
const matcapTexture2 = textureLoader.load( import.meta.env.BASE_URL + '/static/textures/matcaps/3.png')

matcapTexture.colorSpace = THREE.SRGBColorSpace
const fontLoader = new FontLoader()
fontLoader.load(import.meta.env.BASE_URL + '/static/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry('Srivathsav',
            {
                font: font,
                size: 0.5,
                depth: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4
            }
        )
        textGeometry.computeBoundingBox()
        textGeometry.center()
        const textMaterial = new THREE.MeshMatcapMaterial()
        textMaterial.matcap = matcapTexture2
        // textMaterial.wireframe = true
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)

        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
        const donutMaterial = new THREE.MeshMatcapMaterial()
        donutMaterial.matcap = matcapTexture
        for (let i = 0; i < 300; i++) {
            const donut = new THREE.Mesh(donutGeometry, donutMaterial)
            let positionFound = false
            while (!positionFound) {
                const x = (Math.random() - 0.5) * 10
                const y = (Math.random() - 0.5) * 10
                const z = (Math.random() - 0.5) * 10

                const distance = Math.sqrt(x * x + y * y + z * z)

                if (distance > 1.5) {
                    donut.position.set(x, y, z)
                    positionFound = true
                }
            }
            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI
            const scale = Math.random()
            donut.scale.set(scale, scale, scale)
            scene.add(donut)
        }
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
