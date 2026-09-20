import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import BikeCard from './BikeCard'

export default function BikeGallery({ currentUser }) {
  const [bikes, setBikes] = useState([])
  const [loading, setLoading] = useState(true)
  const [brandFilter, setBrandFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchBikes()
  }, [])

  async function fetchBikes() {
    setLoading(true)
    const { data, error } = await supabase.from('bikes').select('*')
    if (!error) setBikes(data)
    setLoading(false)
  }

  const brands = [...new Set(bikes.map((b) => b.brand))]
  const types = [...new Set(bikes.map((b) => b.type))]

  let filtered = bikes
    .filter((b) => (brandFilter ? b.brand === brandFilter : true))
    .filter((b) => (typeFilter ? b.type === typeFilter : true))
    .filter((b) => (search ? (b.name + b.brand).toLowerCase().includes(search.toLowerCase()) : true))

  if (sortBy === 'price_low') filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sortBy === 'price_high') filtered = [...filtered].sort((a, b) => b.price - a.price)
  if (sortBy === 'newest') filtered = [...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  return (
    <div className="bg-concrete min-h-screen">
      {/* Header strip */}
      <div className="bg-asphalt text-concrete py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-white">
            Find your next ride
          </h1>
          <p className="text-steellight mt-2 max-w-md">
            Browse our current stock — filter by brand, type, or search by name.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Filter bar */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or brand"
            className="flex-1 min-w-[200px] border border-steel/20 bg-white rounded px-4 py-2.5 text-sm focus:border-amber outline-none transition"
          />
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="border border-steel/20 bg-white rounded px-3 py-2.5 text-sm"
          >
            <option value="">All brands</option>
            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-steel/20 bg-white rounded px-3 py-2.5 text-sm"
          >
            <option value="">All types</option>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-steel/20 bg-white rounded px-3 py-2.5 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="price_low">Price: low to high</option>
            <option value="price_high">Price: high to low</option>
          </select>
        </div>

        <p className="text-sm text-steellight mb-4">
          {loading ? 'Loading...' : `${filtered.length} bike${filtered.length !== 1 ? 's' : ''} available`}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 rounded bg-steel/10 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-dashed border-steel/30 rounded p-12 text-center text-steellight">
            No bikes match your search — try clearing a filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((bike) => (
              <BikeCard key={bike.id} bike={bike} currentUser={currentUser} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
