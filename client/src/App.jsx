import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import LightPillar from './components/LightPillar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Browse from './pages/Browse'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Fixed WebGL background */}
        <div className="light-pillar-bg">
          <LightPillar
            topColor="#5227FF"
            bottomColor="#FF9FFC"
            intensity={0.8}
            rotationSpeed={0.2}
            glowAmount={0.004}
            pillarWidth={3.5}
            pillarHeight={0.35}
            noiseIntensity={0.4}
            quality="high"
            mixBlendMode="screen"
          />
        </div>

        {/* App content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Navbar />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(26, 26, 37, 0.9)',
                backdropFilter: 'blur(10px)',
                color: '#f0f0f5',
                border: '1px solid #2a2a3a',
                borderRadius: '12px',
                fontSize: '14px',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/browse" element={<Browse />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
