import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function EarthCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const width = mount.clientWidth || 380
    const height = mount.clientHeight || 380

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 0, 3.2)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.cursor = 'grab'
    mount.appendChild(renderer.domElement)

    // Lights
    const ambientLight = new THREE.AmbientLight(0x0a192f, 2.5)
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.8)
    sunLight.position.set(5, 3, 5)
    scene.add(sunLight)

    const blueGlow = new THREE.PointLight(0x00d9ff, 4.0, 8)
    blueGlow.position.set(-3, -2, 2)
    scene.add(blueGlow)

    const earthGroup = new THREE.Group()
    scene.add(earthGroup)

    // Create procedural Earth texture with oceans, continents and cyber grid
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    if (ctx) {
      // Ocean deep blue
      ctx.fillStyle = '#051329'
      ctx.fillRect(0, 0, 1024, 512)

      // Cyber latitude & longitude grid lines
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.15)'
      ctx.lineWidth = 1
      for (let y = 0; y <= 512; y += 32) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(1024, y)
        ctx.stroke()
      }
      for (let x = 0; x <= 1024; x += 64) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, 512)
        ctx.stroke()
      }

      // Continents representation with tech cyan dots & land masses
      ctx.fillStyle = '#0f3a5d'
      // Simplified stylized land shapes
      const continents = [
        { x: 260, y: 160, r: 85 }, // North America
        { x: 320, y: 320, r: 70 }, // South America
        { x: 520, y: 170, r: 75 }, // Europe
        { x: 550, y: 280, r: 80 }, // Africa
        { x: 740, y: 190, r: 120 }, // Asia
        { x: 800, y: 340, r: 60 }, // Australia
      ]

      continents.forEach(c => {
        const grad = ctx.createRadialGradient(c.x, c.y, 10, c.x, c.y, c.r)
        grad.addColorStop(0, '#00d9ff')
        grad.addColorStop(0.5, '#0e7490')
        grad.addColorStop(1, '#051329')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2)
        ctx.fill()

        // Tech pulse dots
        ctx.fillStyle = '#ffffff'
        for (let i = 0; i < 12; i++) {
          const ang = Math.random() * Math.PI * 2
          const dist = Math.random() * (c.r * 0.7)
          ctx.fillRect(c.x + Math.cos(ang) * dist, c.y + Math.sin(ang) * dist, 3, 3)
        }
      })
    }

    const earthTexture = new THREE.CanvasTexture(canvas)

    // Base Earth Sphere
    const earthGeo = new THREE.SphereGeometry(1, 48, 48)
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.45,
      metalness: 0.35,
    })
    const earthMesh = new THREE.Mesh(earthGeo, earthMat)
    earthGroup.add(earthMesh)

    // Glowing Atmospheric Aura (Outer halo)
    const atmosGeo = new THREE.SphereGeometry(1.035, 48, 48)
    const atmosMat = new THREE.MeshStandardMaterial({
      color: 0x00d9ff,
      transparent: true,
      opacity: 0.18,
      wireframe: true,
    })
    const atmosphere = new THREE.Mesh(atmosGeo, atmosMat)
    earthGroup.add(atmosphere)

    // Orbiting Satellite Ring
    const orbitGeo = new THREE.TorusGeometry(1.35, 0.008, 16, 64)
    const orbitMat = new THREE.MeshBasicMaterial({ color: 0x00d9ff, transparent: true, opacity: 0.4 })
    const orbitRing = new THREE.Mesh(orbitGeo, orbitMat)
    orbitRing.rotation.x = Math.PI / 2.5
    earthGroup.add(orbitRing)

    // Orbiting Satellite
    const satGeo = new THREE.BoxGeometry(0.04, 0.04, 0.08)
    const satMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const sat = new THREE.Mesh(satGeo, satMat)
    orbitRing.add(sat)

    // Mouse drag rotation
    let isDragging = false
    let prevMousePos = { x: 0, y: 0 }
    let rotSpeedX = 0
    let rotSpeedY = 0

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      prevMousePos = { x: e.clientX, y: e.clientY }
      if (renderer.domElement) renderer.domElement.style.cursor = 'grabbing'
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const deltaX = e.clientX - prevMousePos.x
      const deltaY = e.clientY - prevMousePos.y
      prevMousePos = { x: e.clientX, y: e.clientY }

      rotSpeedY = deltaX * 0.008
      rotSpeedX = deltaY * 0.008
      earthGroup.rotation.y += rotSpeedY
      earthGroup.rotation.x += rotSpeedX
    }

    const onMouseUp = () => {
      isDragging = false
      if (renderer.domElement) renderer.domElement.style.cursor = 'grab'
    }

    const dom = renderer.domElement
    dom.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    // Touch
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
      earthGroup.rotation.y += deltaX * 0.008
      earthGroup.rotation.x += deltaY * 0.008
    }
    const onTouchEnd = () => {
      isDragging = false
    }

    dom.addEventListener('touchstart', onTouchStart, { passive: true })
    dom.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)

    // Resize
    const onResize = () => {
      if (!mount) return
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', onResize)

    // Animation Loop
    let animId: number
    let clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      if (!isDragging) {
        earthGroup.rotation.y += 0.006
        atmosphere.rotation.y += 0.008
      } else {
        rotSpeedX *= 0.95
        rotSpeedY *= 0.95
        earthGroup.rotation.x += rotSpeedX
        earthGroup.rotation.y += rotSpeedY
      }

      // Move satellite along orbit
      sat.position.x = Math.cos(elapsed * 1.5) * 1.35
      sat.position.y = Math.sin(elapsed * 1.5) * 1.35

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
      window.removeEventListener('resize', onResize)
      earthGeo.dispose()
      earthMat.dispose()
      earthTexture.dispose()
      atmosGeo.dispose()
      atmosMat.dispose()
      orbitGeo.dispose()
      orbitMat.dispose()
      satGeo.dispose()
      satMat.dispose()
      renderer.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="earth-canvas-container">
      <div ref={mountRef} className="earth-canvas" />
      <span className="earth-hint">✦ Interactive 3D Earth — Drag to rotate</span>
    </div>
  )
}
