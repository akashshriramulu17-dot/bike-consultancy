import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AdminDashboard() {
  const [tab, setTab] = useState('bikes')
  const [stats, setStats] = useState({ bikes: 0, pending: 0, avgRating: '—' })

  useEffect(() => { loadStats() }, [tab])

  async function loadStats() {
    const { count: bikeCount } = await supabase.from('bikes').select('*', { count: 'exact', head: true })
    const { count: pendingCount } = await supabase.from('service_bookings').select('*', { count: 'exact', head: true }).neq('status', 'Ready')
    const { data: fb } = await supabase.from('feedback').select('rating')
    const avg = fb && fb.length ? (fb.reduce((s, f) => s + f.rating, 0) / fb.length).toFixed(1) : '—'
    setStats({ bikes: bikeCount || 0, pending: pendingCount || 0, avgRating: avg })
  }

  const tabs = [
    { id: 'bikes', label: 'Bikes' },
    { id: 'bookings', label: 'Service bookings' },
    { id: 'feedback', label: 'Feedback' },
  ]

  return (
    <div className="bg-concrete min-h-screen">
      <div className="bg-asphalt text-white py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-2xl font-semibold">Admin dashboard</h1>
          <div className="flex flex-wrap gap-4 mt-5">
            <StatCard label="Bikes listed" value={stats.bikes} />
            <StatCard label="Pending services" value={stats.pending} accent />
            <StatCard label="Avg. feedback" value={stats.avgRating} />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-1 mb-6 bg-white border border-steel/10 rounded p-1 w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded text-sm font-medium transition ${
                tab === t.id ? 'bg-amber text-white' : 'text-steel hover:bg-steel/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="bg-white border border-steel/10 rounded p-6">
          {tab === 'bikes' && <ManageBikes onChange={loadStats} />}
          {tab === 'bookings' && <ManageBookings onChange={loadStats} />}
          {tab === 'feedback' && <ViewFeedback />}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-steel/20 rounded px-5 py-3 min-w-[140px]">
      <p className="text-2xl font-display font-semibold text-white">{value}</p>
      <p className={`text-xs mt-0.5 ${accent ? 'text-amber' : 'text-steellight'}`}>{label}</p>
    </div>
  )
}

function ManageBikes({ onChange }) {
  const [bikes, setBikes] = useState([])
  const [form, setForm] = useState({ name: '', brand: '', price: '', type: '', in_stock: true })

  useEffect(() => { fetchBikes() }, [])

  async function fetchBikes() {
    const { data } = await supabase.from('bikes').select('*').order('created_at', { ascending: false })
    setBikes(data || [])
  }

  async function addBike(e) {
    e.preventDefault()
    await supabase.from('bikes').insert({ ...form, price: Number(form.price), images: [], specs: {} })
    setForm({ name: '', brand: '', price: '', type: '', in_stock: true })
    fetchBikes()
    onChange?.()
  }

  async function toggleStock(bike) {
    await supabase.from('bikes').update({ in_stock: !bike.in_stock }).eq('id', bike.id)
    fetchBikes()
  }

  async function deleteBike(id) {
    await supabase.from('bikes').delete().eq('id', id)
    fetchBikes()
    onChange?.()
  }

  return (
    <div>
      <h2 className="font-display font-semibold text-lg mb-4">Add a bike</h2>
      <form onSubmit={addBike} className="grid grid-cols-2 gap-3 mb-8 max-w-lg">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Bike name" className="border border-steel/20 rounded p-2 text-sm focus:border-amber outline-none" required />
        <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="Brand" className="border border-steel/20 rounded p-2 text-sm focus:border-amber outline-none" required />
        <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" type="number" className="border border-steel/20 rounded p-2 text-sm focus:border-amber outline-none" required />
        <input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="Type (sports/cruiser/commuter)" className="border border-steel/20 rounded p-2 text-sm focus:border-amber outline-none" required />
        <button type="submit" className="col-span-2 bg-amber text-white rounded p-2 text-sm font-medium hover:brightness-95 transition">Add bike</button>
      </form>

      <h2 className="font-display font-semibold text-lg mb-4">All bikes</h2>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b border-steel/10 text-steellight">
            <th className="p-2 font-medium">Name</th><th className="font-medium">Brand</th><th className="font-medium">Price</th><th className="font-medium">Stock</th><th></th>
          </tr>
        </thead>
        <tbody>
          {bikes.map((b) => (
            <tr key={b.id} className="border-b border-steel/5">
              <td className="p-2 font-medium">{b.name}</td>
              <td className="text-steellight">{b.brand}</td>
              <td>₹{b.price.toLocaleString()}</td>
              <td>
                <button onClick={() => toggleStock(b)} className={`text-xs font-medium px-2 py-1 rounded ${b.in_stock ? 'bg-green-100 text-green-700' : 'bg-rust/10 text-rust'}`}>
                  {b.in_stock ? 'In stock' : 'Sold out'}
                </button>
              </td>
              <td><button onClick={() => deleteBike(b.id)} className="text-rust text-xs font-medium">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ManageBookings({ onChange }) {
  const [bookings, setBookings] = useState([])

  useEffect(() => { fetchBookings() }, [])

  async function fetchBookings() {
    const { data } = await supabase.from('service_bookings').select('*').order('date', { ascending: true })
    setBookings(data || [])
  }

  async function updateStatus(id, status) {
    await supabase.from('service_bookings').update({ status }).eq('id', id)
    fetchBookings()
    onChange?.()
  }

  const statusColor = { Received: 'bg-steel/10 text-steel', 'In Progress': 'bg-amber/10 text-amberdark', Ready: 'bg-green-100 text-green-700' }

  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="text-left border-b border-steel/10 text-steellight">
          <th className="p-2 font-medium">Name</th><th className="font-medium">Phone</th><th className="font-medium">Issue</th><th className="font-medium">Date</th><th className="font-medium">Slot</th><th className="font-medium">Status</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((b) => (
          <tr key={b.id} className="border-b border-steel/5">
            <td className="p-2 font-medium">{b.name}</td>
            <td className="text-steellight">{b.phone}</td>
            <td className="capitalize">{b.issue_type}</td>
            <td>{b.date}</td>
            <td>{b.slot}</td>
            <td>
              <select
                value={b.status}
                onChange={(e) => updateStatus(b.id, e.target.value)}
                className={`border-0 rounded px-2 py-1 text-xs font-medium ${statusColor[b.status] || ''}`}
              >
                <option>Received</option>
                <option>In Progress</option>
                <option>Ready</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function ViewFeedback() {
  const [feedback, setFeedback] = useState([])

  useEffect(() => {
    supabase.from('feedback').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setFeedback(data || []))
  }, [])

  return (
    <div className="space-y-3">
      {feedback.length === 0 && <p className="text-steellight text-sm">No feedback yet.</p>}
      {feedback.map((f) => (
        <div key={f.id} className="border border-steel/10 rounded p-4">
          <div className="text-amber">{'★'.repeat(f.rating)}<span className="text-steel/20">{'★'.repeat(5 - f.rating)}</span></div>
          <p className="text-sm text-asphalt mt-1">{f.comment || 'No comment left'}</p>
          <p className="text-xs text-steellight mt-1">{f.page} — {new Date(f.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}
