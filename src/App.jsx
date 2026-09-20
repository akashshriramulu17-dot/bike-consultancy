import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import BikeGallery from './components/BikeGallery'
import WhatsAppButton from './components/WhatsAppButton'
import FeedbackPopup from './components/FeedbackPopup'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ServiceBooking from './pages/ServiceBooking'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  return (
    <BrowserRouter>
      <nav className="flex items-center gap-6 px-6 py-4 bg-asphalt text-white sticky top-0 z-40">
        <span className="font-display font-semibold tracking-wide text-amber">GEARHEAD MOTORS</span>
        <Link to="/" className="text-sm text-steellight hover:text-white transition">Bikes</Link>
        <Link to="/service" className="text-sm text-steellight hover:text-white transition">Book service</Link>
        <div className="ml-auto flex items-center gap-4">
          {currentUser ? (
            <span className="text-sm text-steellight">Signed in</span>
          ) : (
            <>
              <Link to="/login" className="text-sm text-steellight hover:text-white transition">Log in</Link>
              <Link to="/signup" className="text-sm bg-amber text-white px-3 py-1.5 rounded hover:brightness-95 transition">Sign up</Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<BikeGallery currentUser={currentUser} />} />
        <Route path="/service" element={<ServiceBooking currentUser={currentUser} />} />
        <Route path="/login" element={<Login onLogin={setCurrentUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>

      <WhatsAppButton variant="floating" />
      <FeedbackPopup />
    </BrowserRouter>
  )
}

export default App
