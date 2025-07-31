import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HeroSection from "./Components/HeroSection";


function App() {
useEffect(() => {
  fetch("http://localhost:5000/api/test")
    .then((res) => res.json())
    .then((data) => console.log("Backend says:", data))
    .catch((err) => console.error("Error connecting to backend:", err));
}, []);
  return (
    <Routes>
      <Route path="/" element={<HeroSection />} />
     
    </Routes>
  );
}

export default App;
