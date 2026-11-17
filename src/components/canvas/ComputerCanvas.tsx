import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function ComputerCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [isInteracting, setIsInteracting] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const width = mount.clientWidth || 550
    const height = mount.clientHeight || 450

    // Scene & Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 1.8, 5.2)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.cursor = 'grab'
    mount.appendChild(renderer.domElement)

    // Lighting (Adrian Hajdin Cyberpunk / 3D Dev style: Cyan & Purple neon lights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.8)
    mainLight.position.set(4, 8, 5)
    mainLight.castShadow = true
    mainLight.shadow.mapSize.width = 1024
    mainLight.shadow.mapSize.height = 1024
    scene.add(mainLight)

    // Cyan key light
    const cyanLight = new THREE.PointLight(0x00d9ff, 4.5, 12)
    cyanLight.position.set(-2.5, 2.2, 1.8)
    scene.add(cyanLight)

    // Violet fill light
    const violetLight = new THREE.PointLight(0x9d4edd, 4.0, 12)
    violetLight.position.set(2.5, 2.5, -1)
    scene.add(violetLight)

    // Soft warm backlight
    const backLight = new THREE.PointLight(0x38bdf8, 2.0, 8)
    backLight.position.set(0, 0.5, -3)
    scene.add(backLight)

    // Main Group that will rotate
    const rootGroup = new THREE.Group()
    scene.add(rootGroup)

    // Workstation Group
    const workstation = new THREE.Group()
    rootGroup.add(workstation)

    // 1. DESK SURFACE
    const deskGeo = new THREE.BoxGeometry(4.8, 0.12, 2.6)
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x0a1424,
      roughness: 0.25,
      metalness: 0.65,
    })
    const desk = new THREE.Mesh(deskGeo, deskMat)
    desk.position.y = -0.06
    desk.receiveShadow = true
    workstation.add(desk)

    // Desk Mat / Pad
    const padCanvas = document.createElement('canvas')
    padCanvas.width = 512
    padCanvas.height = 256
    const padCtx = padCanvas.getContext('2d')
    if (padCtx) {
      padCtx.fillStyle = '#0f172a'
      padCtx.fillRect(0, 0, 512, 256)
      padCtx.strokeStyle = '#00d9ff'
      padCtx.lineWidth = 4
      padCtx.strokeRect(8, 8, 496, 240)
      padCtx.fillStyle = '#00d9ff'
      padCtx.font = 'bold 20px monospace'
      padCtx.fillText('> DIU CSE // DEV_STATION', 24, 42)
      padCtx.fillStyle = '#64748b'
      padCtx.font = '14px monospace'
      padCtx.fillText('DAFFODIL INTERNATIONAL UNIVERSITY', 24, 70)
    }
    const padTex = new THREE.CanvasTexture(padCanvas)
    const padGeo = new THREE.PlaneGeometry(3.6, 1.8)
    const padMat = new THREE.MeshStandardMaterial({
      map: padTex,
      roughness: 0.7,
      metalness: 0.2,
    })
    const deskPad = new THREE.Mesh(padGeo, padMat)
    deskPad.rotation.x = -Math.PI / 2
    deskPad.position.set(0, 0.005, 0.1)
    deskPad.receiveShadow = true
    workstation.add(deskPad)

    // 2. CURVED ULTRAWIDE MONITOR
    // Stand Base
    const standBaseGeo = new THREE.CylinderGeometry(0.4, 0.45, 0.04, 32)
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.2 })
    const standBase = new THREE.Mesh(standBaseGeo, metalMat)
    standBase.position.set(0, 0.02, -0.4)
    workstation.add(standBase)

    // Stand Arm
    const armGeo = new THREE.BoxGeometry(0.12, 1.1, 0.08)
    const arm = new THREE.Mesh(armGeo, metalMat)
    arm.position.set(0, 0.55, -0.42)
    arm.rotation.x = -0.08
    workstation.add(arm)

    // Monitor Bezel & Frame
    const monitorFrameGeo = new THREE.BoxGeometry(2.7, 1.45, 0.08)
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.3 })
    const monitorFrame = new THREE.Mesh(monitorFrameGeo, frameMat)
    monitorFrame.position.set(0, 1.15, -0.32)
    monitorFrame.castShadow = true
    workstation.add(monitorFrame)

    // Screen with Animated Terminal Code Texture
    const screenCanvas = document.createElement('canvas')
    screenCanvas.width = 1024
    screenCanvas.height = 512
    const screenCtx = screenCanvas.getContext('2d')
    const screenTex = new THREE.CanvasTexture(screenCanvas)

    let cursorVisible = true
    let lastBlink = Date.now()

    const codeLines = [
      { text: '// Moushikur Rahman Portfolio', color: '#6ee7b7' },
      { text: 'const student = {', color: '#00d9ff' },
      { text: '  name: "Moushikur Rahman",', color: '#f8fafc' },
      { text: '  institution: "Daffodil International University",', color: '#38bdf8' },
      { text: '  department: "Computer Science & Engineering",', color: '#a855f7' },
      { text: '  skills: ["C", "C++", "Java", "OOP", "Data Structures"],', color: '#f59e0b' },
      { text: '  status: "Building Scalable Systems & 3D Web",', color: '#10b981' },
      { text: '};', color: '#00d9ff' },
      { text: 'student.innovate(); // System Status: ACTIVE', color: '#3b82f6' },
    ]

    function renderScreen() {
      if (!screenCtx) return
      // Cyber Dark background
      screenCtx.fillStyle = '#060d19'
      screenCtx.fillRect(0, 0, 1024, 512)

      // Top titlebar
      screenCtx.fillStyle = '#0f1f38'
      screenCtx.fillRect(0, 0, 1024, 40)
      // Window control buttons
      screenCtx.fillStyle = '#ef4444'
      screenCtx.beginPath()
      screenCtx.arc(25, 20, 7, 0, Math.PI * 2)
      screenCtx.fill()
      screenCtx.fillStyle = '#eab308'
      screenCtx.beginPath()
      screenCtx.arc(50, 20, 7, 0, Math.PI * 2)
      screenCtx.fill()
      screenCtx.fillStyle = '#22c55e'
      screenCtx.beginPath()
      screenCtx.arc(75, 20, 7, 0, Math.PI * 2)
      screenCtx.fill()

      screenCtx.fillStyle = '#94a3b8'
      screenCtx.font = 'bold 16px "DM Mono", monospace'
      screenCtx.fillText('terminal — bash — moushik@diu-cse:~/portfolio', 110, 26)

      // Code text lines
      screenCtx.font = '20px "DM Mono", monospace'
      codeLines.forEach((line, idx) => {
        screenCtx.fillStyle = line.color
        screenCtx.fillText(line.text, 35, 80 + idx * 36)
      })

      // Blinking cursor
      if (Date.now() - lastBlink > 450) {
        cursorVisible = !cursorVisible
        lastBlink = Date.now()
      }
      if (cursorVisible) {
        screenCtx.fillStyle = '#00d9ff'
        screenCtx.fillRect(35 + screenCtx.measureText(codeLines[codeLines.length - 1].text).width + 8, 80 + (codeLines.length - 1) * 36 - 18, 12, 22)
      }

      screenTex.needsUpdate = true
    }

    renderScreen()

    const screenGeo = new THREE.PlaneGeometry(2.58, 1.34)
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTex,
    })
    const screenMesh = new THREE.Mesh(screenGeo, screenMat)
    screenMesh.position.set(0, 1.15, -0.275)
    workstation.add(screenMesh)

    // Screen backlight glow
    const monitorLight = new THREE.PointLight(0x00d9ff, 1.8, 2.5)
    monitorLight.position.set(0, 1.15, 0.1)
    workstation.add(monitorLight)

    // 3. GAMING PC TOWER
    const towerGroup = new THREE.Group()
    towerGroup.position.set(1.7, 0.65, -0.2)
    workstation.add(towerGroup)

    // Tower Body
    const towerGeo = new THREE.BoxGeometry(0.55, 1.25, 1.1)
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x090f1d, metalness: 0.9, roughness: 0.25 })
    const tower = new THREE.Mesh(towerGeo, towerMat)
    tower.castShadow = true
    towerGroup.add(tower)

    // Glass Side Panel
    const glassGeo = new THREE.PlaneGeometry(1.02, 1.18)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x00d9ff,
      transparent: true,
      opacity: 0.28,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.8,
    })
    const glass = new THREE.Mesh(glassGeo, glassMat)
    glass.rotation.y = -Math.PI / 2
    glass.position.set(-0.28, 0, 0)
    towerGroup.add(glass)

    // Internal RGB Cooling Fans (Animated!)
    const fan1Group = new THREE.Group()
    fan1Group.position.set(-0.15, 0.25, 0.25)
    towerGroup.add(fan1Group)

    const fanRingGeo = new THREE.TorusGeometry(0.16, 0.02, 16, 32)
    const fanRingMat = new THREE.MeshBasicMaterial({ color: 0x00d9ff })
    const fanRing1 = new THREE.Mesh(fanRingGeo, fanRingMat)
    fanRing1.rotation.y = Math.PI / 2
    fan1Group.add(fanRing1)

    const fanBladeGeo = new THREE.BoxGeometry(0.01, 0.28, 0.06)
    const fanBladeMat = new THREE.MeshStandardMaterial({ color: 0x1e293b })
    const blades1 = new THREE.Mesh(fanBladeGeo, fanBladeMat)
    fan1Group.add(blades1)

    const fan2Group = new THREE.Group()
    fan2Group.position.set(-0.15, -0.2, 0.25)
    towerGroup.add(fan2Group)

    const fanRingMat2 = new THREE.MeshBasicMaterial({ color: 0xa855f7 })
    const fanRing2 = new THREE.Mesh(fanRingGeo, fanRingMat2)
    fanRing2.rotation.y = Math.PI / 2
    fan2Group.add(fanRing2)

    const blades2 = new THREE.Mesh(fanBladeGeo, fanBladeMat)
    fan2Group.add(blades2)

    // GPU with glowing RGB strip
    const gpuGeo = new THREE.BoxGeometry(0.2, 0.12, 0.6)
    const gpuMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 })
    const gpu = new THREE.Mesh(gpuGeo, gpuMat)
    gpu.position.set(-0.08, 0, -0.1)
    towerGroup.add(gpu)

    const gpuGlowGeo = new THREE.BoxGeometry(0.02, 0.03, 0.58)
    const gpuGlowMat = new THREE.MeshBasicMaterial({ color: 0x00d9ff })
    const gpuGlow = new THREE.Mesh(gpuGlowGeo, gpuGlowMat)
    gpuGlow.position.set(-0.19, 0, -0.1)
    towerGroup.add(gpuGlow)

    // 4. MECHANICAL KEYBOARD
    const kbGroup = new THREE.Group()
    kbGroup.position.set(-0.1, 0.03, 0.4)
    workstation.add(kbGroup)

    // Base plate
    const kbBaseGeo = new THREE.BoxGeometry(1.25, 0.035, 0.44)
    const kbBaseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.3 })
    const kbBase = new THREE.Mesh(kbBaseGeo, kbBaseMat)
    kbBase.castShadow = true
    kbGroup.add(kbBase)

    // Keycaps grid
    const keyRows = 4
    const keyCols = 12
    const keyGeo = new THREE.BoxGeometry(0.07, 0.025, 0.07)
    const keyMatDark = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 })
    const keyMatCyan = new THREE.MeshBasicMaterial({ color: 0x00d9ff })
    const keyMatPurple = new THREE.MeshBasicMaterial({ color: 0xa855f7 })

    for (let r = 0; r < keyRows; r++) {
      for (let c = 0; c < keyCols; c++) {
        let mat = keyMatDark
        if ((r === 1 && c === 2) || (r === 2 && c === 3) || (r === 3 && c === 6)) mat = keyMatCyan
        else if (r === 0 && (c === 0 || c === keyCols - 1)) mat = keyMatPurple

        const key = new THREE.Mesh(keyGeo, mat)
        key.position.set(
          -0.5 + c * 0.09,
          0.03,
          -0.14 + r * 0.09
        )
        kbGroup.add(key)
      }
    }

    // 5. GAMING MOUSE
    const mouseGroup = new THREE.Group()
    mouseGroup.position.set(0.9, 0.03, 0.42)
    workstation.add(mouseGroup)

    const mouseGeo = new THREE.SphereGeometry(0.12, 16, 16)
    mouseGeo.scale(0.8, 0.35, 1.4)
    const mouseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.7 })
    const mouse = new THREE.Mesh(mouseGeo, mouseMat)
    mouseGroup.add(mouse)

    const wheelGeo = new THREE.BoxGeometry(0.018, 0.03, 0.05)
    const wheelMat = new THREE.MeshBasicMaterial({ color: 0x00d9ff })
    const wheel = new THREE.Mesh(wheelGeo, wheelMat)
    wheel.position.set(0, 0.045, -0.04)
    mouseGroup.add(wheel)

    // 6. HOLOGRAPHIC ORBITING TECH RINGS (Adrian Hajdin 3D sci-fi touch)
    const orbitGroup = new THREE.Group()
    orbitGroup.position.set(0, 1.15, -0.3)
    workstation.add(orbitGroup)

    const ring1Geo = new THREE.TorusGeometry(1.85, 0.01, 16, 64)
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x00d9ff, transparent: true, opacity: 0.35 })
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat)
    ring1.rotation.x = Math.PI / 3
    orbitGroup.add(ring1)

    const ring2Geo = new THREE.TorusGeometry(2.1, 0.008, 16, 64)
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.25 })
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat)
    ring2.rotation.y = Math.PI / 4
    orbitGroup.add(ring2)

    // Floating tech nodes along rings
    const nodeGeo = new THREE.SphereGeometry(0.04, 8, 8)
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    const node1 = new THREE.Mesh(nodeGeo, nodeMat)
    node1.position.set(1.85, 0, 0)
    ring1.add(node1)

    const node2 = new THREE.Mesh(nodeGeo, new THREE.MeshBasicMaterial({ color: 0xd946ef }))
    node2.position.set(-2.1, 0, 0)
    ring2.add(node2)

    // Center the workstation slightly
    workstation.position.y = -0.6
    workstation.rotation.y = -0.22 // slight default angle showing 3D depth

    // Mouse Interaction (Orbit / Rotate)
    let isDragging = false
    let prevMousePos = { x: 0, y: 0 }
    let targetRotationY = -0.22
    let targetRotationX = 0.08
    let currentRotationY = -0.22
    let currentRotationX = 0.08

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true
      setIsInteracting(true)
      prevMousePos = { x: e.clientX, y: e.clientY }
      if (renderer.domElement) renderer.domElement.style.cursor = 'grabbing'
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) {
        // Subtle hover parallax
        const rect = mount.getBoundingClientRect()
        const nx = (e.clientX - rect.left) / rect.width - 0.5
        const ny = (e.clientY - rect.top) / rect.height - 0.5
        targetRotationY = -0.22 + nx * 0.35
        targetRotationX = 0.08 - ny * 0.2
        return
      }

      const deltaX = e.clientX - prevMousePos.x
      const deltaY = e.clientY - prevMousePos.y
      prevMousePos = { x: e.clientX, y: e.clientY }

      targetRotationY += deltaX * 0.008
      targetRotationX += deltaY * 0.005
      // Clamp vertical tilt
      targetRotationX = Math.max(-0.25, Math.min(0.35, targetRotationX))
    }

    const handleMouseUp = () => {
      isDragging = false
      setIsInteracting(false)
      if (renderer.domElement) renderer.domElement.style.cursor = 'grab'
    }

    // Touch support for mobile / tablets
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true
        setIsInteracting(true)
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - prevMousePos.x
        const deltaY = e.touches[0].clientY - prevMousePos.y
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        targetRotationY += deltaX * 0.008
        targetRotationX += deltaY * 0.005
        targetRotationX = Math.max(-0.25, Math.min(0.35, targetRotationX))
      }
    }

    const handleTouchEnd = () => {
      isDragging = false
      setIsInteracting(false)
    }

    const dom = renderer.domElement
    dom.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    dom.addEventListener('touchstart', handleTouchStart, { passive: true })
    dom.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd)

    // Resize Handler
    const handleResize = () => {
      if (!mount) return
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    // Animation Loop
    let animId: number
    let clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Rotate cooling fan blades
      blades1.rotation.x += 0.2
      blades2.rotation.x += 0.2

      // Slowly rotate tech rings
      ring1.rotation.z += 0.005
      ring2.rotation.z -= 0.004

      // Gentle floating animation if not dragging
      if (!isDragging) {
        workstation.position.y = -0.6 + Math.sin(elapsedTime * 1.5) * 0.03
        // Subtle auto-sway
        targetRotationY += Math.sin(elapsedTime * 0.5) * 0.0003
      }

      // Smooth interpolation
      currentRotationY += (targetRotationY - currentRotationY) * 0.08
      currentRotationX += (targetRotationX - currentRotationX) * 0.08

      rootGroup.rotation.y = currentRotationY
      rootGroup.rotation.x = currentRotationX

      // Update screen text blinking
      renderScreen()

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      dom.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      dom.removeEventListener('touchstart', handleTouchStart)
      dom.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="canvas-wrapper">
      <div ref={mountRef} className="computer-canvas" />
      <div className={`canvas-hint ${isInteracting ? 'active' : ''}`}>
        <span>✦ Drag to rotate 3D Station</span>
      </div>
    </div>
  )
}
