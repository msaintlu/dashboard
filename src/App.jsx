import {data} from "./data";
import {ResponsiveLineChart} from "./vizcomponents/linechart";

const MARGIN = { top: 50, right: 50, bottom: 150, left: 150 };

const colors = { 
  coal            : "#837A75", // Grey
  oil             : "#6C6460", // Dim grey
  gas             : "#A9A19E", // Silver
  nuclear         : "#611A40", // Crimson violet
  hydro           : "#76D0AF", // Turquoise
  solar           : "#49C195", // Mint leaf
  wind            : "#2A7A5C", // Jungle teal
  biofuel         : "#D4B483", // Soft fawn
  other_renewable : "#1A4C3A"  // Pine teal 
  };

// Name of energy type columns
const energyTypes = ["coal", "oil", "gas", "nuclear", "hydro", "solar", "wind", "biofuel", "other_renewable"];

// Convert TWh to PWh
const dataPWh = data.map(item => ({ ...item, 
  ...Object.fromEntries(energyTypes.map(col => [col, item[col] / 1000])) }));

// World data
const worldData = dataPWh.filter(d => d.country === "World");

function App() {

  return (
    <div style={{ height: 800 }}>
      <ResponsiveLineChart data={worldData} columns={energyTypes} colors={colors} MARGIN={MARGIN}/>
    </div>
  )
}

export default App
