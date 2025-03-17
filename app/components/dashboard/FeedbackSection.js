'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function FeedbackSection() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [feedback, setFeedback] = useState({
    rating: 0,
    comment: '',
  });

  useEffect(() => {
    // TODO: Fetch completed consultations from API
    // Mock data for demonstration
    const mockConsultations = [
      {
        id: 1,
        doctorName: 'Dr. Sarah Smith',
        specialization: 'Cardiologist',
        date: new Date(2024, 2, 20, 14, 30),
        type: 'Video Consultation',
        feedback: null,
      },
      {
        id: 2,
        doctorName: 'Dr. John Doe',
        specialization: 'Dermatologist',
        date: new Date(2024, 2, 15, 10, 0),
        type: 'In-Person',
        feedback: {
          rating: 5,
          comment: 'Excellent doctor! Very thorough and professional.',
          date: new Date(2024, 2, 15, 11, 0),
        },
      },
    ];

    setConsultations(mockConsultations);
    setLoading(false);
  }, []);

  const handleRatingClick = (rating) => {
    setFeedback((prev) => ({ ...prev, rating }));
  };

  const handleCommentChange = (e) => {
    setFeedback((prev) => ({ ...prev, comment: e.target.value }));
  };

  const handleSubmitFeedback = async () => {
    if (!selectedConsultation || !feedback.rating) return;

    // TODO: Submit feedback to API
    setConsultations((prev) =>
      prev.map((consultation) =>
        consultation.id === selectedConsultation.id
          ? {
              ...consultation,
              feedback: {
                ...feedback,
                date: new Date(),
              },
            }
          : consultation
      )
    );
    setSelectedConsultation(null);
    setFeedback({ rating: 0, comment: '' });
  };

  const StarRating = ({ rating, onRatingClick, readonly = false }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => !readonly && onRatingClick(star)}
            disabled={readonly}
            className={`text-2xl ${
              star <= rating
                ? 'text-yellow-400'
                : 'text-gray-300'
            } ${!readonly && 'hover:text-yellow-400'}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold">Feedback & Reviews</h2>
          <p className="text-gray-500 mt-1">
            Share your experience with our healthcare providers
          </p>
        </div>

        <div className="p-6">
          {selectedConsultation ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">
                    {selectedConsultation.doctorName}
                  </h3>
                  <p className="text-gray-500">
                    {selectedConsultation.specialization}
                  </p>
                  <p className="text-gray-500">
                    {format(selectedConsultation.date, 'PPP')}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedConsultation(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <StarRating
                    rating={feedback.rating}
                    onRatingClick={handleRatingClick}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Comment
                  </label>
                  <textarea
                    value={feedback.comment}
                    onChange={handleCommentChange}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Share your experience with the doctor..."
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setSelectedConsultation(null)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={!feedback.rating}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {consultations.map((consultation) => (
                <div
                  key={consultation.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">
                        {consultation.doctorName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {consultation.specialization}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(consultation.date, 'PPP')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {consultation.type}
                      </p>
                    </div>
                    {consultation.feedback ? (
                      <div className="text-right">
                        <StarRating
                          rating={consultation.feedback.rating}
                          readonly
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          {format(consultation.feedback.date, 'PP')}
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedConsultation(consultation)}
                        className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
                      >
                        Leave Feedback
                      </button>
                    )}
                  </div>
                  {consultation.feedback && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600">
                        {consultation.feedback.comment}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {consultations.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    No consultations available for feedback
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 