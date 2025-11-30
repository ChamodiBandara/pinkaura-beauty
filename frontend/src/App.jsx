import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SkinAnalysis from "./pages/SkinAnalysis";
import VirtualTryOnPage from "./pages/VirtualTryOnPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100">
        <header className="bg-pink-600 text-white p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-center">🌺 Pink Aura 🌺</h1>
          <p className="text-center mt-2">AI Skin Tone & Beauty Assistant</p>
          <nav className="flex justify-center gap-6 mt-4 text-lg">
            <Link to="/" className="hover:text-yellow-300 transition">Skin Analysis</Link>
            <Link to="/tryon3d" className="hover:text-yellow-300 transition">3D Virtual Try-On</Link>
          </nav>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<SkinAnalysis />} />
            <Route path="/tryon3d" element={<VirtualTryOnPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
