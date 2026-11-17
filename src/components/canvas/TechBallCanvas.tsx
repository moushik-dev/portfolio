import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface TechBallProps {
  name: string
  mark: string
  color?: string
}

export default function TechBallCanvas({ name, mark, color = '#00d9ff' }: TechBallProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const size = 120
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
    camera.position.z = 2.8

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(size, size)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
    scene.add(ambientLight)

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5)
    dirLight1.position.set(3, 4, 3)
    scene.add(dirLight1)

    const pointLight = new THREE.PointLight(new THREE.Color(color).getHex(), 3.0, 5)
    pointLight.position.set(-2, -1, 2)
    scene.add(pointLight)

    // Ball Geometry: 3D Faceted Icosahedron (Adrian Hajdin style)
    const geometry = new THREE.IcosahedronGeometry(1.05, 1)

    // Create Canvas Texture with Badge / Tech Name
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    if (ctx) {
      // Background gradient
      const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 128)
      grad.addColorStop(0, '#1a273a')
      grad.addColorStop(1, '#0b1320')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 256, 256)

      // Outer ring
      ctx.strokeStyle = color
      ctx.lineWidth = 6
      ctx.beginPath()
      ctx.arc(128, 128, 110, 0, Math.PI * 2)
      ctx.stroke()

      // Center mark
      ctx.fillStyle = color
      ctx.font = 'bold 64px "DM Mono", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(mark, 128, 110)

      // Name label
      ctx.fillStyle = '#ffffff'
      ctx.font = '600 24px "Manrope", sans-serif'
      ctx.fillText(name, 128, 175)
    }

    const texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.25,
      metalness: 0.65,
      flatShading: true,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Mouse / Touch Drag interaction
    let isDragging = false
    let prevMousePos = { x: 0, y: 0 }
    let rotSpeedX = 0
    let rotSpeedY = 0

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      prevMousePos = { x: e.clientX, y: e.clientY }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const deltaX = e.clientX - prevMousePos.x
      const deltaY = e.clientY - prevMousePos.y
      prevMousePos = { x: e.clientX, y: e.clientY }

      rotSpeedY = deltaX * 0.015
      rotSpeedX = deltaY * 0.015
      mesh.rotation.y += rotSpeedY
      mesh.rotation.x += rotSpeedX
    }

    const onMouseUp = () => {
      isDragging = false
    }

    const dom = renderer.domElement
    dom.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    // Touch events
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return
      const deltaX = e.touches[0].clientX - prevMousePos.x
      const deltaY = e.touches[0].clientY - prevMousePos.y
      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      mesh.rotation.y += deltaX * 0.015
      mesh.rotation.x += deltaY * 0.015
    }
    const onTouchEnd = () => {
      isDragging = false
    }

    dom.addEventListener('touchstart', onTouchStart, { passive: true })
    dom.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)

    // Animation loop with smooth floating bob
    let animId: number
    let clock = new THREE.Clock()
    const floatOffset = Math.random() * Math.PI * 2

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      if (!isDragging) {
        // Natural idle rotation
        mesh.rotation.y += 0.01
        mesh.rotation.x += 0.005
        // Floating sinusoidal motion
        mesh.position.y = Math.sin(elapsed * 2 + floatOffset) * 0.08
      } else {
        // Decay rotational impulse
        rotSpeedX *= 0.95
        rotSpeedY *= 0.95
        mesh.rotation.x += rotSpeedX
        mesh.rotation.y += rotSpeedY
      }

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      dom.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      dom.removeEventListener('touchstart', onTouchStart)
      dom.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      geometry.dispose()
      material.dispose()
      texture.dispose()
      renderer.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [name, mark, color])

  return (
    <div className="tech-ball-wrapper" title={`Interactive 3D ${name} Ball - Click & Drag to spin!`}>
      <div ref={mountRef} className="tech-ball-canvas" />
    </div>
  )
}
