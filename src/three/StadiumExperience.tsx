import { useEffect, useMemo, useRef, type ReactNode, type RefObject } from 'react'
import { Canvas, createPortal, useFrame, useThree, type RootState } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { contenders, MAX_GAS_TOTAL, toHundredths } from '../config/standings.ts'
import { useContender } from '../state/ContenderContext.tsx'
import { buildBallPanels } from './ballGeometry.ts'
import { markStadiumReady, pointerTilt, subscribeSpin } from './stadiumSignals.ts'

const BALL_POSITION: [number, number, number] = [0, 0.45, 4.35]
const BALL_TARGET: [number, number, number] = [0, 0.02, 0]
const PITCH_POSITION: [number, number, number] = [0, 6.6, 7.1]
const PITCH_TARGET: [number, number, number] = [0, 0, -0.2]

const viewActive = { ball: false, pitch: false }

type TrackId = 'ball' | 'pitch'

function isOffscreen(rect: DOMRect, canvasRect: DOMRect) {
  return rect.bottom <= canvasRect.top || rect.top >= canvasRect.bottom || rect.right <= canvasRect.left || rect.left >= canvasRect.right
}

function LookCamera({
  position,
  target,
  fov,
}: {
  position: [number, number, number]
  target: [number, number, number]
  fov: number
}) {
  const ref = useRef<THREE.PerspectiveCamera>(null)
  useEffect(() => {
    ref.current?.lookAt(target[0], target[1], target[2])
  }, [target])
  return <PerspectiveCamera ref={ref} makeDefault fov={fov} position={position} />
}

function CameraBridge({ cameraRef }: { cameraRef: RefObject<THREE.PerspectiveCamera | null> }) {
  const camera = useThree((state) => state.camera)
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) cameraRef.current = camera
  }, [camera, cameraRef])
  return null
}

function TrackedView({
  track,
  priority,
  id,
  children,
}: {
  track: RefObject<HTMLDivElement | null>
  priority: number
  id: TrackId
  children: ReactNode
}) {
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const [scene] = useMemo(() => [new THREE.Scene()], [])

  useFrame((state: RootState) => {
    viewActive[id] = false
    const element = track.current
    const camera = cameraRef.current
    if (!element || !camera || document.hidden) return
    const rect = element.getBoundingClientRect()
    const canvasRect = state.gl.domElement.getBoundingClientRect()
    if (rect.width < 2 || rect.height < 2 || isOffscreen(rect, canvasRect)) return
    viewActive[id] = true

    const pixelRatio = state.gl.getPixelRatio()
    const left = rect.left - canvasRect.left
    const bottom = canvasRect.bottom - rect.bottom
    const x = Math.max(0, Math.floor(left * pixelRatio))
    const y = Math.max(0, Math.floor(bottom * pixelRatio))
    const width = Math.max(1, Math.floor(rect.width * pixelRatio))
    const height = Math.max(1, Math.floor(rect.height * pixelRatio))
    const aspect = rect.width / rect.height
    if (Math.abs(camera.aspect - aspect) > 0.001) {
      camera.aspect = aspect
      camera.updateProjectionMatrix()
    }

    const renderer = state.gl
    renderer.setViewport(x, y, width, height)
    renderer.setScissor(x, y, width, height)
    renderer.setScissorTest(true)
    renderer.clear(true, true)
    renderer.render(scene, camera)
    renderer.setScissorTest(false)
  }, priority)

  return createPortal(
    <>
      {children}
      <CameraBridge cameraRef={cameraRef} />
    </>,
    scene,
  )
}

function FullClear() {
  useFrame(({ gl }) => {
    if (document.hidden) return
    gl.setScissorTest(false)
    gl.setClearColor(0x000000, 0)
    gl.clear(true, true)
  }, 1)
  return null
}

function PauseWhenHidden() {
  const setFrameloop = useThree((state) => state.setFrameloop)
  useEffect(() => {
    const onChange = () => setFrameloop(document.hidden ? 'never' : 'always')
    document.addEventListener('visibilitychange', onChange)
    return () => {
      document.removeEventListener('visibilitychange', onChange)
      setFrameloop('always')
    }
  }, [setFrameloop])
  return null
}

function GoldBall({ compact }: { compact: boolean }) {
  const radius = 1.05
  const built = useMemo(() => buildBallPanels(radius), [radius])
  const gold = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#f7cb69',
        metalness: 0.94,
        roughness: 0.2,
        emissive: '#6a4a12',
        emissiveIntensity: 0.22,
        clearcoat: 0.4,
        clearcoatRoughness: 0.35,
      }),
    [],
  )
  const dark = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#140e0a',
        metalness: 0.45,
        roughness: 0.42,
      }),
    [],
  )

  useEffect(() => {
    return () => {
      built.pentagon.dispose()
      built.hexagon.dispose()
      gold.dispose()
      dark.dispose()
    }
  }, [built, dark, gold])

  return (
    <group>
      <mesh>
        <sphereGeometry args={[radius * 0.93, compact ? 20 : 32, compact ? 16 : 24]} />
        <meshStandardMaterial color="#1a120c" metalness={0.35} roughness={0.55} />
      </mesh>
      {built.panels.map((panel, index) => (
        <mesh
          key={index}
          geometry={panel.sides === 5 ? built.pentagon : built.hexagon}
          material={panel.sides === 5 ? dark : gold}
          position={panel.position}
          quaternion={panel.quaternion}
        />
      ))}
    </group>
  )
}

function BallScene({ reduced, compact }: { reduced: boolean; compact: boolean }) {
  const tiltRef = useRef<THREE.Group>(null)
  const spinRef = useRef<THREE.Group>(null)
  const extra = useRef(0)

  useEffect(() => {
    if (reduced) return
    return subscribeSpin(() => {
      extra.current += Math.PI * 2
    })
  }, [reduced])

  useFrame((_, delta) => {
    if (!viewActive.ball || document.hidden) return
    const spin = spinRef.current
    const tilt = tiltRef.current
    if (spin && !reduced) {
      spin.rotation.y += delta * 0.4
      if (extra.current > 0) {
        const step = Math.min(extra.current, delta * 5.5)
        spin.rotation.y += step
        extra.current -= step
      }
    }
    if (!tilt) return
    const targetX = reduced ? 0 : pointerTilt.y * -0.18
    const targetZ = reduced ? 0 : pointerTilt.x * 0.2
    tilt.rotation.x = THREE.MathUtils.damp(tilt.rotation.x, targetX, 4, delta)
    tilt.rotation.z = THREE.MathUtils.damp(tilt.rotation.z, targetZ, 4, delta)
  })

  return (
    <>
      <LookCamera position={BALL_POSITION} target={BALL_TARGET} fov={32} />
      <ambientLight color="#d9c8ef" intensity={0.55} />
      <directionalLight color="#fff4d2" intensity={2.5} position={[3.2, 4.5, 4]} />
      {!compact && <directionalLight color="#8b6cff" intensity={1.15} position={[-4, 1.2, -2]} />}
      <pointLight color="#f7cb69" intensity={12} distance={9} position={[1.1, 1.2, 2.2]} />
      <group ref={tiltRef}>
        <group ref={spinRef} position={[0, 0.08, 0]}>
          <GoldBall compact={compact} />
        </group>
        <group position={[0, -1.18, 0]}>
          <mesh>
            <cylinderGeometry args={[0.72, 0.86, 0.14, compact ? 20 : 36]} />
            <meshStandardMaterial color="#e2b84a" metalness={0.82} roughness={0.28} />
          </mesh>
          <mesh position={[0, -0.16, 0]}>
            <cylinderGeometry args={[0.98, 1.05, 0.1, compact ? 20 : 36]} />
            <meshStandardMaterial color="#8d6b2e" metalness={0.7} roughness={0.36} />
          </mesh>
        </group>
      </group>
    </>
  )
}

function PitchScene({ reduced, compact }: { reduced: boolean; compact: boolean }) {
  const { selectedId } = useContender()
  const bars = useRef<THREE.Group>(null)
  const max = toHundredths(MAX_GAS_TOTAL)

  useFrame((_, delta) => {
    if (!viewActive.pitch || !bars.current) return
    bars.current.children.forEach((child, index) => {
      const contender = contenders[index]
      if (!contender || !(child instanceof THREE.Mesh)) return
      const height = 0.28 + (toHundredths(contender.fees.total) / max) * 1.65
      const selected = contender.id === selectedId
      const target = selected ? height * 1.06 : height
      const next = reduced ? target : THREE.MathUtils.damp(child.scale.y, target, 8, delta)
      child.scale.y = next
      child.position.y = next / 2
      if (child.material instanceof THREE.MeshStandardMaterial) {
        child.material.color.set(selected ? '#f7cb69' : '#f5f1e7')
        child.material.emissive.set(selected ? '#f7cb69' : '#000000')
        child.material.emissiveIntensity = selected ? 0.28 : 0
      }
    })
  })

  const stripes = Array.from({ length: 8 }, (_, index) => (
    <mesh key={index} position={[0, 0, -3.5 + index]}>
      <boxGeometry args={[6.4, 0.08, 1]} />
      <meshStandardMaterial color={index % 2 === 0 ? '#2E483B' : '#344F41'} roughness={0.92} />
    </mesh>
  ))

  return (
    <>
      <LookCamera position={PITCH_POSITION} target={PITCH_TARGET} fov={34} />
      <ambientLight color="#f5f1e7" intensity={0.72} />
      <directionalLight color="#fff8ea" intensity={1.6} position={[2, 8, 4]} />
      {!compact && <directionalLight color="#f7cb69" intensity={0.6} position={[-4, 5, -2]} />}
      <group>{stripes}</group>
      <mesh position={[0, 0.09, 0]}>
        <boxGeometry args={[6.46, 0.03, 0.05]} />
        <meshBasicMaterial color="#f5f1e7" />
      </mesh>
      <mesh position={[-3.2, 0.09, 0.25]}>
        <boxGeometry args={[0.05, 0.03, 8.1]} />
        <meshBasicMaterial color="#f5f1e7" />
      </mesh>
      <mesh position={[3.2, 0.09, 0.25]}>
        <boxGeometry args={[0.05, 0.03, 8.1]} />
        <meshBasicMaterial color="#f5f1e7" />
      </mesh>
      <mesh position={[0, 0.09, -3.8]}>
        <boxGeometry args={[6.4, 0.03, 0.05]} />
        <meshBasicMaterial color="#f5f1e7" />
      </mesh>
      <mesh position={[0, 0.09, 4.3]}>
        <boxGeometry args={[6.4, 0.03, 0.05]} />
        <meshBasicMaterial color="#f5f1e7" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0.25]}>
        <ringGeometry args={[0.78, 0.88, compact ? 24 : 40]} />
        <meshBasicMaterial color="#f5f1e7" side={THREE.DoubleSide} />
      </mesh>
      {[-3.8, 4.3].map((z) => (
        <group key={z} position={[0, 0, z]}>
          <mesh position={[-0.85, 0.32, 0]}>
            <boxGeometry args={[0.06, 0.64, 0.06]} />
            <meshStandardMaterial color="#f5f1e7" />
          </mesh>
          <mesh position={[0.85, 0.32, 0]}>
            <boxGeometry args={[0.06, 0.64, 0.06]} />
            <meshStandardMaterial color="#f5f1e7" />
          </mesh>
          <mesh position={[0, 0.64, 0]}>
            <boxGeometry args={[1.76, 0.06, 0.06]} />
            <meshStandardMaterial color="#f5f1e7" />
          </mesh>
        </group>
      ))}
      <group ref={bars}>
        {contenders.map((contender, index) => (
          <mesh key={contender.id} position={[-2.2 + index * 1.1, 0.5, 1.55]}>
            <boxGeometry args={[0.38, 1, 0.38]} />
            <meshStandardMaterial color="#f5f1e7" roughness={0.45} metalness={0.15} />
          </mesh>
        ))}
      </group>
    </>
  )
}

type StadiumExperienceProps = {
  ballRef: RefObject<HTMLDivElement | null>
  pitchRef: RefObject<HTMLDivElement | null>
  reduced: boolean
  compact: boolean
}

export default function StadiumExperience({ ballRef, pitchRef, reduced, compact }: StadiumExperienceProps) {
  return (
    <div className="stadium-layer" aria-hidden="true">
      <Canvas
        dpr={compact ? [1, 1.5] : [1, 2]}
        gl={{ alpha: true, antialias: !compact, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
          gl.autoClear = false
          markStadiumReady()
        }}
      >
        <PauseWhenHidden />
        <FullClear />
        <TrackedView track={ballRef} priority={2} id="ball">
          <BallScene reduced={reduced} compact={compact} />
        </TrackedView>
        <TrackedView track={pitchRef} priority={3} id="pitch">
          <PitchScene reduced={reduced} compact={compact} />
        </TrackedView>
      </Canvas>
    </div>
  )
}
