type Vec2 = { x: number; y: number }

export default function drawSmoothCurve(
  points: Vec2[],
  ctx: CanvasRenderingContext2D,
  strokeColor?: string,
) {
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  
  for (let i = 0; i < points.length - 1; i++) {
    //find center points to use as control points
    const xc = (points[i].x + points[i + 1].x) / 2
    const yc = (points[i].y + points[i + 1].y) / 2
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc)
  }
  // Connect the last two points with a straight line
  ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y)
  ctx.lineWidth = 8
  ctx.strokeStyle = strokeColor || "white"
  ctx.stroke()
}