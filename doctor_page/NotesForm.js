import { useState } from 'react'

const NotesForm = ({ onAddNote }) => {
  const [note, setNote] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (note.trim() === '') return
    onAddNote(note)
    setNote('')
    alert('Note added (demo)')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mt-6">
      <h3 className="text-lg font-semibold text-primaryGreen mb-4">Add Notes / Prescriptions</h3>
      <textarea
        className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primaryGreen"
        rows="4"
        placeholder="Enter notes or prescriptions here..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button
        type="submit"
        className="bg-primaryGreen text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
      >
        Add Note
      </button>
    </form>
  )
}

export default NotesForm
