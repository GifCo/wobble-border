import { useEffect, useRef } from 'react'
import {easeLerp, Vec2} from '../../utils/lerp'
import drawSmoothCurve from '../../utils/drawSmoothCurve'

type CanvasType = {
  points: Vec2[]
} 

export default function Canvas({points}: CanvasType) {

  const canvasRef = useRef<HTMLCanvasElement>(null!)

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
        const offsets = distanceVals.map((dist) => {
          if (dist > 220) return null
          //damping
          return dist / 100
        })
        
        const updatedPoints = points.map((point, id) => {
          if (offsets[id] === null) return point
          
          const updatedPoint = {
            x: Math.floor(easeLerp(e.offsetX, point.x, offsets[id] ?? 0)),
            y: Math.floor(easeLerp(e.offsetY, point.y, offsets[id] ?? 0)),
          }
          return updatedPoint
        })

        //clear and draw updated curve points
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        drawSmoothCurve(
          updatedPoints,
          ctx,'#42B22C')
    } 
  }

  useEffect(() => {
    if(!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
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
      <canvas ref={canvasRef} width={1200} height={600}></canvas>
    </main>
  )
}
