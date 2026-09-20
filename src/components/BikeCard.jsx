import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import WhatsAppButton from './WhatsAppButton'

export default function BikeCard({ bike, currentUser }) {
  const [expanded, setExpanded] = useState(false)

  async function handleExpand() {
    setExpanded(!expanded)
    if (!expanded && currentUser) {
      await supabase.from('customer_bike_interest').insert({
        customer_id: currentUser.id,
        bike_id: bike.id,
        bike_type: bike.type,
        action: 'viewed',
      })
    }
  }

  return (
    <div className="bg-white border border-steel/10 rounded overflow-hidden group hover:border-amber/40 transition-colors">
      <div className="relative overflow-hidden cursor-pointer" onClick={handleExpand}>
        <img
          src={bike.images?.[0]}
          alt={bike.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span
          className={`absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded ${
            bike.in_stock ? 'bg-white/90 text-asphalt' : 'bg-rust text-white'
          }`}
        >
          {bike.in_stock ? 'In stock' : 'Sold out'}
        </span>
      </div>

      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-steellight">{bike.brand}</p>
        <h3 className="font-display font-semibold text-lg text-asphalt leading-tight">{bike.name}</h3>
        <p className="text-amberdark font-semibold mt-1">₹{bike.price.toLocaleString()}</p>

        <button
          onClick={handleExpand}
          className="mt-3 text-sm font-medium text-asphalt border-b border-asphalt/30 hover:border-amber hover:text-amberdark transition"
        >
          {expanded ? 'Hide details' : 'View details'}
        </button>

        {expanded && (
          <div className="mt-4 border-t border-steel/10 pt-4 space-y-3">
            {bike.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {bike.images.map((img, i) => (
                  <img key={i} src={img} alt="" className="h-20 w-28 object-cover rounded flex-shrink-0" />
                ))}
              </div>
            )}
            <ul className="text-sm text-steel space-y-1">
              {Object.entries(bike.specs || {}).map(([key, val]) => (
                <li key={key} className="flex justify-between border-b border-steel/5 py-1">
                  <span className="capitalize text-steellight">{key}</span>
                  <span className="font-medium text-asphalt">{val}</span>
                </li>
              ))}
            </ul>
            <WhatsAppButton
              variant="bike"
              bikeName={bike.name}
              currentUser={currentUser}
              bikeId={bike.id}
              bikeType={bike.type}
            />
          </div>
        )}
      </div>
    </div>
  )
}
