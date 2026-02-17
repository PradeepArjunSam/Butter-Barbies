import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Browse from './pages/Browse'
import Upload from './pages/Upload'
import ResourceDetail from './pages/ResourceDetail'
import Profile from './pages/Profile'
import Leaderboard from './pages/Leaderboard'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-wrapper">
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
            <Route path="/upload" element={<Upload />} />
            <Route path="/resource/:id" element={<ResourceDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
