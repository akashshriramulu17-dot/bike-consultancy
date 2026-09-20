import { supabase } from '../lib/supabaseClient'

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER

export default function WhatsAppButton({ variant = 'floating', bikeName, currentUser, bikeId, bikeType }) {
  const message =
    variant === 'bike'
      ? `Hi, I'm interested in ${bikeName}`
      : `Hi, I'd like to know more about your bikes/services`

  const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

  async function handleClick() {
    if (variant === 'bike' && currentUser) {
      await supabase.from('customer_bike_interest').insert({
        customer_id: currentUser.id,
        bike_id: bikeId,
        bike_type: bikeType,
        action: 'clicked_whatsapp',
      })
    }
  }

  if (variant === 'floating') {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="fixed bottom-6 right-6 bg-[#25D366] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:scale-105 transition z-50"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.39a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2zm5.79 14.06c-.24.68-1.4 1.3-1.93 1.38-.49.08-1.11.11-1.79-.11-.41-.13-.94-.31-1.62-.6-2.85-1.23-4.7-4.1-4.85-4.29-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09 1-2.38.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.58.81 2 .88 2.15.07.15.12.32.02.51-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.61-.07.17-.19.71-.83.9-1.11.19-.28.38-.23.63-.14.26.09 1.65.78 1.93.92.28.14.47.21.53.33.07.12.07.68-.17 1.36z"/>
        </svg>
      </a>
    )
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-medium px-4 py-2 rounded hover:brightness-95 transition"
    >
      Enquire on WhatsApp
    </a>
  )
}
