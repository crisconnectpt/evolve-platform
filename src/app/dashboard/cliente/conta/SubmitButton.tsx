'use client'

import { useFormStatus } from 'react-dom'

export default function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-2.5 rounded-xl text-sm font-black transition-opacity hover:opacity-90 disabled:opacity-60"
      style={{ background: 'var(--accent)', color: '#ffffff' }}
    >
      {pending ? 'A guardar…' : 'Guardar alterações'}
    </button>
  )
}
