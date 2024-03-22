import { useEffect, useRef } from 'react'
import {easeLerp, Vec2} from '../../utils/lerp'
import { SpringRef, SpringValue, animated } from '@react-spring/web'

type CanvasType = {
  points: Vec2[]
  friction?: number
  tension?: number
  pointSprings: Record<'x' | 'y', SpringValue<number>>[]
  pointSpringAPI: SpringRef<Record<'x' | 'y', number>>
} 

function SpringCanvas({points, friction = 10, tension = 300, pointSprings, pointSpringAPI}: CanvasType) {

  const canvasSpringRef = useRef<HTMLCanvasElement>(null!)

  function handleMouse(e: MouseEvent ,ctx: CanvasRenderingContext2D | null) {
    if (!ctx) return
    //this is the collision area
    ctx.lineWidth = 380
    //we are close to the line compute distance to each point
    if (ctx.isPointInStroke(e.offsetX, e.offsetY)) {
      
      const distanceVals = points.map((point) => {
        return Math.sqrt(
          Math.pow(point.x - e.offsetX, 2) + Math.pow(point.y - e.offsetY, 2)
          )
        })

        //Distance cutoff / max distance that will still be effected by mouse
        const offsets = distanceVals.map((dist) => {
          if (dist > 220) return null
          return dist / 100
        })
        
        const updatedPoints = points.map((point, id) => {
          //to far away, return original point
          if (offsets[id] === null) return point
          
          const updatedPoint = {
            x: Math.floor(easeLerp(e.offsetX, point.x, offsets[id] ?? 0)),
            y: Math.floor(easeLerp(e.offsetY, point.y, offsets[id] ?? 0)),
          }
          return updatedPoint
        })


        pointSpringAPI.start((i) => ({
          x: updatedPoints[i].x,
          y: updatedPoints[i].y,
          config: { tension: tension ?? 300, friction: friction ?? 30 },
          onChange: () => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            drawSmoothCurve(
              pointSprings.map((spring) => ({
                x: spring.x.get(),
                y: spring.y.get(),
              })),
              ctx,'#42B22C')
            },
      }))
    } 
  }


  useEffect(() => {
    if(!canvasSpringRef.current) return
    const ctx = canvasSpringRef.current.getContext('2d')
    if(!ctx) return

    //draw intial line
    drawSmoothCurve(points, ctx as CanvasRenderingContext2D,'#42B22C')
    
    function mouseEventHandler(e: MouseEvent){
      handleMouse(e, ctx)
    }
    window.addEventListener('mousemove', mouseEventHandler)

    return ()=> window.removeEventListener('mousemove', mouseEventHandler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main>
      <animated.canvas ref={canvasSpringRef} width={1200} height={600}></animated.canvas>
    </main>
  )
}

export default SpringCanvas


function drawSmoothCurve(
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
