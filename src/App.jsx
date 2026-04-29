import {data} from "./data";
import { ResponsiveLineChart } from "./vizcomponents/Linechart";
import { ResponsiveStackedAreaGraph } from "./vizcomponents/StackedAreaGraph";

const MARGIN = { top: 50, right: 50, bottom: 150, left: 150 };

const colors = { 
  coal            : "#6C6460", // Dim grey
  oil             : "#837A75", // Grey
  gas             : "#A9A19E", // Silver
  nuclear         : "#611A40", // Crimson violet
  hydro           : "#1A4C3A",  // Pine teal 
  solar           : "#2A7A5C", // Jungle teal
  wind            : "#39A77F", // Seaweed
  biofuel         : "#997143", // Toffee brown
  other_renewable : "#76D0AF" // Turquoise
  };

// Name of energy type columns
const energyTypes = ["coal", "oil", "gas", "nuclear", "biofuel", "hydro", "solar", "wind", "other_renewable"];

// Convert TWh to PWh
const dataPWh = data.map(item => ({ ...item, 
  ...Object.fromEntries(energyTypes.map(col => [col, item[col] / 1000])) }));

// World data
const worldData = dataPWh.filter(d => d.country === "World");

function App() {

  return (
    <div style={{ height: 800 }}>
      {/*<ResponsiveLineChart data={worldData} columns={energyTypes} colors={colors} MARGIN={MARGIN} />*/}
      <ResponsiveStackedAreaGraph data={worldData} columns={energyTypes} colors={colors} MARGIN={MARGIN} />
    </div>
  )
}

export default App
