import "./App.css";
import TopNav from "./component/Navbar/TopNav";
import MapWithPins from "./component/map/MapSection";
import { LocationProvider } from "../src/context/LocationContext";

function App() {
  return (
    <div className="App">
      <LocationProvider>
        <TopNav />
        <MapWithPins />
      </LocationProvider>
    </div>
  );
}

export default App;
