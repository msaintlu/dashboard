import {data} from "./data";
import {ResponsiveLineChart} from "./vizcomponents/linechart";

const MARGIN = { top: 50, right: 50, bottom: 150, left: 150 };
const worldData = data.filter(d => d.country === "World");

function App() {

  return (
    <div style={{ height: 800 }}>
      <ResponsiveLineChart data={worldData} MARGIN={MARGIN}/>
    </div>
  )
}

export default App
