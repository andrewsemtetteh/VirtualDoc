import { useState, useRef, useEffect } from 'react';
import { Video, X } from 'lucide-react';

export default function MeetingLinkModal({ isOpen, onClose, appointment, onSave, darkMode }) {
  const [meetingLink, setMeetingLink] = useState('');
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(appointment._id, meetingLink);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg p-6 max-w-md w-full mx-4`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Video className={`h-6 w-6 ${darkMode ? 'text-blue-400' : 'text-blue-500'} mr-2`} />
            <h2 className="text-xl font-semibold">Add Meeting Link</h2>
          </div>
          <button
            onClick={onClose}
            className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
              Meeting Link
            </label>
            <input
              type="url"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              required
              placeholder="https://meet.google.com/..."
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                darkMode 
                  ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' 
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Save Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 