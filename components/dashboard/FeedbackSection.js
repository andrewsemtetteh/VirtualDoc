'use client';

import { useState } from 'react';

export default function FeedbackSection() {
  const [feedback, setFeedback] = useState({
    rating: 0,
    comment: '',
    doctor: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement feedback submission
    console.log('Feedback submitted:', feedback);
    // Reset form
    setFeedback({ rating: 0, comment: '', doctor: '' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Provide Feedback</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Select Doctor
          </label>
          <select
            value={feedback.doctor}
            onChange={(e) => setFeedback({ ...feedback, doctor: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a doctor</option>
            <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
            <option value="Dr. Michael Chen">Dr. Michael Chen</option>
            <option value="Dr. Emily Brown">Dr. Emily Brown</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Rating
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFeedback({ ...feedback, rating: star })}
                className={`text-2xl ${
                  star <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Your Feedback
          </label>
          <textarea
            value={feedback.comment}
            onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="4"
            placeholder="Share your experience..."
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
} 