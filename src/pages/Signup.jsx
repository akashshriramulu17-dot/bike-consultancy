import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Signup() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function handleSignup(e) {
    e.preventDefault()
    setMessage('')

    // 1. Create auth user — Supabase auto-sends the confirmation/welcome email
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setMessage(error.message)
      return
    }

    // 2. Save extra profile fields
    if (data.user) {
      await supabase.from('customer_profiles').insert({
        id: data.user.id,
        name,
        phone,
      })
    }

    setMessage('Account created! Check your email to confirm your address.')
  }

  return (
    <div className="max-w-sm mx-auto py-12">
      <h2 className="text-xl font-semibold mb-4">Create an account</h2>
      <form onSubmit={handleSignup} className="space-y-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full border rounded p-2" required />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="w-full border rounded p-2" required />
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full border rounded p-2" required />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full border rounded p-2" required />
        <button type="submit" className="w-full bg-blue-600 text-white rounded p-2">Sign Up</button>
      </form>
      {message && <p className="text-sm mt-3 text-gray-700">{message}</p>}
    </div>
  )
}
