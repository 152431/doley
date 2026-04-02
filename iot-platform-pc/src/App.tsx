import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Control from "./pages/Control";
import Monitor from "./pages/Monitor";
import Scenes from "./pages/Scenes";
import Platform from "./pages/Platform";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/control" element={<Control />} />
          <Route path="/monitor" element={<Monitor />} />
          <Route path="/scenes" element={<Scenes />} />
          <Route path="/platform" element={<Platform />} />
        </Route>
      </Routes>
    </Router>
  );
}
