import * as THREE from 'three'

export type PanelPose = {
  sides: 5 | 6
  position: [number, number, number]
  quaternion: THREE.Quaternion
}

const PHI = (1 + Math.sqrt(5)) / 2

function unit(x: number, y: number, z: number) {
  return new THREE.Vector3(x, y, z).normalize()
}

function icosahedronVertices() {
  return [
    unit(0, 1, PHI),
    unit(0, 1, -PHI),
    unit(0, -1, PHI),
    unit(0, -1, -PHI),
    unit(1, PHI, 0),
    unit(1, -PHI, 0),
    unit(-1, PHI, 0),
    unit(-1, -PHI, 0),
    unit(PHI, 0, 1),
    unit(PHI, 0, -1),
    unit(-PHI, 0, 1),
    unit(-PHI, 0, -1),
  ]
}

function panelGeometry(sides: number, radius: number) {
  const shape = new THREE.Shape()
  for (let index = 0; index < sides; index += 1) {
    const angle = (index / sides) * Math.PI * 2 - Math.PI / 2
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    if (index === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  shape.closePath()
  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.045,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.01,
    bevelSegments: 1,
    curveSegments: 1,
  })
}

export function buildBallPanels(ballRadius: number) {
  const vertices = icosahedronVertices()
  let edge = Infinity
  for (let i = 0; i < vertices.length; i += 1) {
    for (let j = i + 1; j < vertices.length; j += 1) {
      edge = Math.min(edge, vertices[i].distanceTo(vertices[j]))
    }
  }

  const faces: [number, number, number][] = []
  for (let i = 0; i < vertices.length; i += 1) {
    for (let j = i + 1; j < vertices.length; j += 1) {
      if (Math.abs(vertices[i].distanceTo(vertices[j]) - edge) > 0.02) continue
      for (let k = j + 1; k < vertices.length; k += 1) {
        if (Math.abs(vertices[i].distanceTo(vertices[k]) - edge) > 0.02) continue
        if (Math.abs(vertices[j].distanceTo(vertices[k]) - edge) > 0.02) continue
        faces.push([i, j, k])
      }
    }
  }

  const centers = faces.map(([i, j, k]) =>
    vertices[i].clone().add(vertices[j]).add(vertices[k]).normalize(),
  )

  let chord = Infinity
  for (const vertex of vertices) {
    for (const center of centers) chord = Math.min(chord, vertex.distanceTo(center))
  }

  const half = (chord * ballRadius) / 2
  const pentagon = panelGeometry(5, half * 0.82)
  const hexagon = panelGeometry(6, half * 0.98)
  const up = new THREE.Vector3(0, 0, 1)
  const panels: PanelPose[] = []

  const place = (normal: THREE.Vector3, sides: 5 | 6) => {
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, normal)
    const position = normal.clone().multiplyScalar(ballRadius * 0.985)
    panels.push({
      sides,
      position: [position.x, position.y, position.z],
      quaternion,
    })
  }

  vertices.forEach((vertex) => place(vertex, 5))
  centers.forEach((center) => place(center, 6))

  return { pentagon, hexagon, panels }
}
