import { data } from "./data";
import { ResponsiveLineChart } from "./vizcomponents/Linechart";
import { ResponsiveStackedAreaGraph } from "./vizcomponents/StackedAreaGraph";
import { ResponsivePercentStackedBarchart } from "./vizcomponents/PercentStackedBarchart";
import { ResponsiveDonut } from "./vizcomponents/Donut";
import { useState } from "react";


const MARGIN = { top: 50, right: 0, bottom: 70, left: 50 };

const colors = {
  coal: "#6C6460", // Dim grey | "#3F3F3B", // Charcoal brown | #1F1F1D", // Carbon Black
  oil: "#8C827D", // Rosy granite
  gas: "#A9A19E", // Silver
  nuclear: "#392654", // Dark amethyst | "#F5B0CB", // Blush pop | "#812255", // Dark raspberry | "#711E4A", // Crimson violet
  hydro: "#1A634F", // Emerald depths | "#246A51", // Dark emerald | "#1A4C3A", // Pine teal
  solar: "#228168", //"#2F8968", // "#2A7A5C", // Jungle teal
  wind: "#2BA182", // "#39A77F", // Seaweed
  biofuel: "#A89459", // Camel  | "#997143", // Toffee brown
  other_renewable: "#33C19C", //"#76D0AF", // Turquoise
};

const energyLabels = {
  coal: "Coal",
  oil: "Oil",
  gas: "Gas",
  nuclear: "Nuclear",
  hydro: "Hydro",
  solar: "Solar",
  wind: "Wind",
  biofuel: "Biofuels",
  other_renewable: "Other renewable",
};

// Name of energy type columns
const energyTypes = ["coal", "oil", "gas", "nuclear", "biofuel", "hydro", "solar", "wind", "other_renewable"];

// Non fossil energies
const nonFossilEnergyTypes = ["nuclear", "biofuel", "hydro", "solar", "wind", "other_renewable"];

// Convert TWh to PWh
const dataPWh = data.map(item => ({ ...item, 
  ...Object.fromEntries(energyTypes.map(col => [col, item[col] / 1000])) }));

// World data
const worldData = dataPWh.filter(d => d.country === "World");

// 2024 data
const data2024 = data.filter(d => d.year === 2024);
const worldData2024 = worldData.filter(d => d.year === 2024)[0]; // [0] bc only one line

// Layout stuff

const sep = (
  <div
    style={{
      height: 1,
      backgroundColor: "lightgrey",
    }}
  />
);

const containerMargin = {marginLeft:50, marginTop: 0, marginBottom:50, marginRight:0}

function App() {

  const [hoveredEner, setHoveredEner] = useState(null);

  return (
    <>
      {/* Title */}
      <div
        style={{
          height: 70,
          marginLeft: containerMargin.marginLeft,
          marginTop: 20,
          marginBottom: 15,
        }}
      >
        <p className="panel-title" style={{ fontSize: 40 }}>
          World Energy Mix
        </p>
      </div>

      <div className="main-container">
        {/* Colonne de gauche (66%) */}
        <div className="left-column">
          {/* Ligne du haut (50% de la hauteur) */}
          <div className="top-row">
            <div className="top-left" style={containerMargin}>
              <p className="panel-title">World energy mix in 2024</p>
              {sep}
              <ResponsiveDonut
                data={worldData2024}
                columns={energyTypes}
                colors={colors}
                MARGIN={{ top: 70, right: 30, bottom: 70, left: 50 }}
                labels={energyLabels}
                hoveredCol={hoveredEner}
                setHoveredCol={setHoveredEner}
              />
            </div>
            <div className="top-right" style={containerMargin}>
              <p className="panel-title">World non-fossil energy evolution</p>
              {sep}
              <ResponsiveLineChart
                data={worldData}
                columns={nonFossilEnergyTypes}
                colors={colors}
                MARGIN={MARGIN}
                labels={energyLabels}
                hoveredCol={hoveredEner}
                setHoveredCol={setHoveredEner}
              />
            </div>
          </div>

          {/* Ligne du bas (50% de la hauteur) */}
          <div className="bottom-row" style={containerMargin}>
            <p className="panel-title">World energy mix evolution</p>
            {sep}
            <ResponsiveStackedAreaGraph
              data={worldData}
              columns={energyTypes}
              colors={colors}
              MARGIN={MARGIN}
              hoveredCol={hoveredEner}
              setHoveredCol={setHoveredEner}
            />
          </div>
        </div>
        {/* Colonne de droite (33%) */}
        <div className="right-column" style={containerMargin}>
          <p className="panel-title">Energy mix in 2024</p>
          {sep}
          <ResponsivePercentStackedBarchart
            data={data2024}
            columns={energyTypes}
            colors={colors}
            MARGIN={{ top: 20, right: 0, bottom: 70, left: 160 }}
            hoveredCol={hoveredEner}
            setHoveredCol={setHoveredEner}
          />
        </div>
      </div>
      <div style={{ height: 70, marginLeft: 20, marginTop: 30 }}>
        <p>Source: Our World in Data</p>
      </div>
    </>
  );
}

export default App
