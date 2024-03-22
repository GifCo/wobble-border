import { useSprings } from "@react-spring/web"
import Canvas from "./components/Canvas"
import { Vec2} from '../utils/lerp'
import SpringCanvas from "./components/SpringCanvas"

//intial line points
const initPoints: Vec2[] = []
for (let i = 1; i < 100; i++) {
  initPoints.push({ x: i * 10 + 70, y: 150 })
}

function App() {

  const [pointSprings, pointSpringAPI] = useSprings(
    initPoints.length,
    (i) => ({ from: { x: initPoints[i].x, y: initPoints[i].y } })
  )


  return (
    <main>
      <h2>Canvas:</h2>
      <Canvas points={initPoints} />
      <h2>Spring Canvas</h2>
      <SpringCanvas friction={10} tension={260} points={initPoints} pointSprings={pointSprings} pointSpringAPI={pointSpringAPI}/>
    </main>
  )
}

export default App