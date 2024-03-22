export type Vec2 = { x: number; y: number }

export function lerp(point1: Vec2, point2: Vec2, t: number) {
  const d = vecDist(point1, point2)
  const lerpX = point1.x + Math.pow(t / d, 2) * (point2.x - point1.x)
  const lerpY = point1.y + Math.pow(t / d, 2) * (point2.y - point1.y)
  return { x: lerpX, y: lerpY }
}

export function easeLerp(x1: number, x2: number, t: number) {
  return x1 + (x2 - x1) * Math.min(1, Math.pow(t * 0.75, 2))
} 

function vecDist(point1: Vec2, point2: Vec2) {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
  )
}
