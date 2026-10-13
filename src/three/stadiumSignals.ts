export const pointerTilt = { x: 0, y: 0 }

export function setPointerTilt(x: number, y: number) {
  pointerTilt.x = x
  pointerTilt.y = y
}

const spinListeners = new Set<() => void>()

export function requestSpin() {
  spinListeners.forEach((listener) => listener())
}

export function subscribeSpin(listener: () => void) {
  spinListeners.add(listener)
  return () => {
    spinListeners.delete(listener)
  }
}

let stadiumReady = false
const readyListeners = new Set<() => void>()

export function markStadiumReady() {
  if (stadiumReady) return
  stadiumReady = true
  readyListeners.forEach((listener) => listener())
}

export function subscribeStadiumReady(listener: () => void) {
  readyListeners.add(listener)
  if (stadiumReady) listener()
  return () => {
    readyListeners.delete(listener)
  }
}
