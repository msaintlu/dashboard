import {data} from "./data";
import { ResponsiveLineChart } from "./vizcomponents/Linechart";
import { ResponsiveStackedAreaGraph } from "./vizcomponents/StackedAreaGraph";
import { ResponsivePercentStackedBarchart } from "./vizcomponents/PercentStackedBarchart";
import { ResponsiveDonut } from "./vizcomponents/Donut";

const MARGIN = { top: 50, right: 50, bottom: 70, left: 50 };

const colors = {
  coal: "#1F1F1D", // Carbon Black
  oil: "#6C6460", // Dim grey
  gas: "#A9A19E", // Silver
  nuclear: "#812255", // Dark raspberry | "#711E4A", // Crimson violet 
  hydro: "#1A4C3A", // Pine teal
  solar: "#2A7A5C", // Jungle teal
  wind: "#39A77F", // Seaweed
  biofuel: "#997143", // Toffee brown
  other_renewable: "#76D0AF", // Turquoise
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

function App() {

  return (
    <>
      <div style={{ height: 70, marginLeft: 20, marginTop: 30 }}>
        <h1>World Energy Mix</h1>
      </div>

      <div style={{ display: "flex", height: 700}}>
        {/* Colonne de gauche (33%) */}
        <div
          style={{ width: "40%", height: "100%"}}
        >
          <ResponsivePercentStackedBarchart
            data={data2024}
            columns={energyTypes}
            colors={colors}
            MARGIN={{ top: 0, right: 50, bottom: 70, left: 170 }}
          />
        </div>

        {/* Colonne de droite (66%) */}
        <div
          style={{
            width: "60%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Ligne du haut (50% de la hauteur) */}
          <div style={{ height: "50%", display: "flex" }}>
            <div style={{ width: "40%", height: "100%" }}>
              <h3 style={{ marginTop: -5, marginBottom: 5 }}>
                Energy mix in 2024
              </h3>
              <ResponsiveDonut
                data={worldData2024}
                columns={energyTypes}
                colors={colors}
                MARGIN={MARGIN}
                labels={energyLabels}
              />
            </div>
            <div style={{ width: "60%", height: "100%" }}>
              <h3 style={{ marginTop: -5, marginBottom: 5, marginLeft: 50 }}>
                Evolution of non-fossil energy
              </h3>
              <ResponsiveLineChart
                data={worldData}
                columns={nonFossilEnergyTypes}
                colors={colors}
                MARGIN={MARGIN}
              />
            </div>
          </div>

          {/* Ligne du bas (50% de la hauteur) */}
          <div style={{ height: "50%" }}>
            <ResponsiveStackedAreaGraph
              data={worldData}
              columns={energyTypes}
              colors={colors}
              MARGIN={MARGIN}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App
