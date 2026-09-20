import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function ServiceBooking({ currentUser }) {
  const [form, setForm] = useState({ name: '', phone: '', issue_type: '', date: '', slot: '' })
  const [status, setStatus] = useState('')

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const { error } = await supabase.from('service_bookings').insert({
      ...form,
      customer_id: currentUser?.id || null,
    })
    setStatus(error ? 'Something went wrong, please try again.' : 'Booking submitted! We will confirm shortly.')
    if (!error) setForm({ name: '', phone: '', issue_type: '', date: '', slot: '' })
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <h2 className="text-xl font-semibold mb-4">Book a Service</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Full name" className="w-full border rounded p-2" required />
        <input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="Phone number" className="w-full border rounded p-2" required />
        <select value={form.issue_type} onChange={(e) => update('issue_type', e.target.value)} className="w-full border rounded p-2" required>
          <option value="">Select issue type</option>
          <option value="general">General Service</option>
          <option value="puncture">Puncture Repair</option>
          <option value="engine">Engine Issue</option>
          <option value="brake">Brake Issue</option>
          <option value="other">Other</option>
        </select>
        <input value={form.date} onChange={(e) => update('date', e.target.value)} type="date" className="w-full border rounded p-2" required />
        <select value={form.slot} onChange={(e) => update('slot', e.target.value)} className="w-full border rounded p-2" required>
          <option value="">Select slot</option>
          <option value="9-11am">9 - 11 AM</option>
          <option value="11-1pm">11 AM - 1 PM</option>
          <option value="2-4pm">2 - 4 PM</option>
          <option value="4-6pm">4 - 6 PM</option>
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white rounded p-2">Book Service</button>
      </form>
      {status && <p className="text-sm mt-3 text-gray-700">{status}</p>}
    </div>
  )
}
