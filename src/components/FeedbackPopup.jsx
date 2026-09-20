import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function FeedbackPopup() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    function handleMouseLeave(e) {
      // Exit-intent: mouse moves toward the top of the viewport (toward tab/close bar)
      if (e.clientY <= 0 && !dismissed && !visible) {
        setVisible(true)
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [dismissed, visible])

  async function handleSubmit() {
    await supabase.from('feedback').insert({
      rating,
      comment,
      page: window.location.pathname,
    })
    setSubmitted(true)
    setTimeout(() => setVisible(false), 1500)
  }

  if (!visible) return null

  return (
    <div className="fixed top-6 right-6 w-80 bg-white border shadow-xl rounded-lg p-4 z-50 animate-fade-in">
      <button
        onClick={() => {
          setVisible(false)
          setDismissed(true)
        }}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        aria-label="Close feedback"
      >
        ✕
      </button>

      {submitted ? (
        <p className="text-sm text-green-600 mt-2">Thanks for your feedback!</p>
      ) : (
        <>
          <h4 className="font-semibold mb-2">Before you go — how was your visit?</h4>
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setRating(n)}
                className={`text-2xl ${n <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                aria-label={`${n} star`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Any comments? (optional)"
            className="w-full border rounded p-2 text-sm mb-2"
            rows={3}
          />
          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded disabled:opacity-50"
          >
            Submit Feedback
          </button>
        </>
      )}
    </div>
  )
}
