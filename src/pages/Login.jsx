import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      return
    }
    onLogin?.(data.user)
  }

  return (
    <div className="max-w-sm mx-auto py-12">
      <h2 className="text-xl font-semibold mb-4">Log in</h2>
      <form onSubmit={handleLogin} className="space-y-3">
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full border rounded p-2" required />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full border rounded p-2" required />
        <button type="submit" className="w-full bg-blue-600 text-white rounded p-2">Log In</button>
      </form>
      {error && <p className="text-sm mt-3 text-red-600">{error}</p>}
    </div>
  )
}
