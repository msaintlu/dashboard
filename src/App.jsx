import { data } from "./data";
import { ResponsiveLineChart } from "./vizcomponents/Linechart";
import { ResponsiveStackedAreaGraph } from "./vizcomponents/StackedAreaGraph";
import {
  normalizeEnergyData,
  ResponsivePercentStackedBarchart,
} from "./vizcomponents/PercentStackedBarchart";
import { ResponsiveDonut } from "./vizcomponents/Donut";
import { useState } from "react";


const MARGIN = { top: 0, right: 0, bottom: 25, left: 35 };

const colors = {
  coal:  "#0C0909", // "#1F1F1D", // Carbon Black // "#6C6460", // Dim grey | 
  oil: "#463835", // "#7A4419", // "#54544F", // Charcoal brown | // #8C827D", // Rosy granite
  gas: "#8A716A", // "#909CC2", // "#A9A19E", // Silver
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

function App() {

  const [hoveredEner, setHoveredEner] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const normalizedData2024 = normalizeEnergyData(data2024, energyTypes);
  const energyShares = new Map(
    normalizedData2024.map((item) => [item.country, item])
  );
  const sortedData2024 = [...data2024].sort((a, b) => {
    if (sortBy === "default") {
      if (a.country === "World") return -1;
      if (b.country === "World") return 1;
      return a.country.localeCompare(b.country);
    }

    // Compare the same normalized percentages displayed by the chart.
    return energyShares.get(b.country)[sortBy] - energyShares.get(a.country)[sortBy]
      || a.country.localeCompare(b.country);
  });

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">
          World Energy Mix
        </h1>
      </header>

      <main className="dashboard-layout">
        <div className="world-panels">
          <section className="chart-panel donut-panel">
            <h2 className="panel-title">World energy mix in 2024</h2>
            <div className="panel-chart">
              <ResponsiveDonut
                data={worldData2024}
                columns={energyTypes}
                colors={colors}
                MARGIN={{ top: 45, right: 35, bottom: 15, left: 35 }}
                labels={energyLabels}
                hoveredCol={hoveredEner}
                setHoveredCol={setHoveredEner}
              />
            </div>
          </section>

          <section className="chart-panel line-panel">
            <h2 className="panel-title">World non-fossil energy evolution</h2>
            <div className="panel-chart">
              <ResponsiveLineChart
                data={worldData}
                columns={nonFossilEnergyTypes}
                colors={colors}
                MARGIN={{ top: 12, right: 0, bottom: 25, left: 35 }}
                labels={energyLabels}
                hoveredCol={hoveredEner}
                setHoveredCol={setHoveredEner}
              />
            </div>
          </section>

          <section className="chart-panel area-panel">
            <h2 className="panel-title">World energy mix evolution</h2>
            <div className="panel-chart">
              <ResponsiveStackedAreaGraph
                data={worldData}
                columns={energyTypes}
                colors={colors}
                MARGIN={MARGIN}
                hoveredCol={hoveredEner}
                setHoveredCol={setHoveredEner}
                labels={energyLabels}
              />
            </div>
          </section>
        </div>

        <section className="chart-panel country-panel">
          <h2 className="panel-title">Energy mix in 2024</h2>
          <div className="sort-control">
            <span>Sort by</span>
            <details className="sort-menu">
              <summary>                     
                <span
                  className="energy-color-mark"
                  style={{ backgroundColor: colors[sortBy] }}
                />
                {sortBy === "default" ? "Default" : energyLabels[sortBy]}
              </summary>
              <div className="sort-menu-options" aria-label="Sort by">
                <button
                  type="button"
                  className="sort-menu-option"
                  aria-pressed={sortBy === "default"}
                  onClick={(event) => {
                    setSortBy("default");
                    event.currentTarget.closest("details").open = false;
                  }}
                >
                  Default
                </button>
                {energyTypes.map((energy) => (
                  <button
                    key={energy}
                    type="button"
                    className="sort-menu-option"
                    aria-pressed={sortBy === energy}
                    onClick={(event) => {
                      setSortBy(energy);
                      event.currentTarget.closest("details").open = false;
                    }}
                  >
                    <span
                      className="energy-color-mark"
                      style={{ backgroundColor: colors[energy] }}
                      aria-hidden="true"
                    />
                    {energyLabels[energy]}
                  </button>
                ))}
              </div>
            </details>
          </div>
          <div className="panel-chart">
            <ResponsivePercentStackedBarchart
              data={sortedData2024}
              columns={energyTypes}
              colors={colors}
              MARGIN={{ top: 0, right: 0, bottom: 0, left: 150 }}
              hoveredCol={hoveredEner}
              setHoveredCol={setHoveredEner}
            />
          </div>
        </section>
      </main>
      <footer className="dashboard-footer">
        <p>Source: Our World in Data</p>
      </footer>
    </div>
  );
}

export default App
