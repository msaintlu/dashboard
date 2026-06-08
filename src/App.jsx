

const MARGIN = { top: 50, right: 0, bottom: 70, left: 50 };

function App() {

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
          Cities temperatures in 2025
        </p>
      </div>
    </>
  );
}

export default App
