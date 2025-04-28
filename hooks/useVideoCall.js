import { useState, useEffect, useCallback } from 'react';
import { connect, createLocalVideoTrack } from 'twilio-video';
import { useSocket } from './useSocket';

export function useVideoCall() {
  const [room, setRoom] = useState(null);
  const [localTrack, setLocalTrack] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState(null);
  const { socket, sendCallSignal } = useSocket();

  // Handle participant connections
  const handleParticipantConnected = useCallback((participant) => {
    setParticipants(prevParticipants => [...prevParticipants, participant]);
  }, []);

  const handleParticipantDisconnected = useCallback((participant) => {
    setParticipants(prevParticipants => 
      prevParticipants.filter(p => p !== participant)
    );
  }, []);

  // Initialize local video
  const initializeLocalVideo = async () => {
    try {
      const track = await createLocalVideoTrack();
      setLocalTrack(track);
      return track;
    } catch (err) {
      setError('Failed to access camera: ' + err.message);
      throw err;
    }
  };

  // Join a video call
  const joinCall = async (token, roomName) => {
    try {
      const track = await initializeLocalVideo();
      const newRoom = await connect(token, {
        name: roomName,
        tracks: [track],
        video: { width: 640 },
        audio: true
      });

      setRoom(newRoom);

      // Handle existing participants
      newRoom.participants.forEach(handleParticipantConnected);

      // Handle participant events
      newRoom.on('participantConnected', handleParticipantConnected);
      newRoom.on('participantDisconnected', handleParticipantDisconnected);

      // Handle room disconnection
      newRoom.on('disconnected', () => {
        setRoom(null);
        setParticipants([]);
      });

      return newRoom;
    } catch (err) {
      setError('Failed to join call: ' + err.message);
      throw err;
    }
  };

  // Leave the video call
  const leaveCall = useCallback(async () => {
    if (localTrack) {
      localTrack.stop();
      setLocalTrack(null);
    }

    if (room) {
      room.disconnect();
      setRoom(null);
      setParticipants([]);
    }
  }, [room, localTrack]);

  // Toggle local video
  const toggleVideo = useCallback(async () => {
    if (localTrack) {
      if (localTrack.isEnabled) {
        localTrack.disable();
      } else {
        localTrack.enable();
      }
    }
  }, [localTrack]);

  // Toggle local audio
  const toggleAudio = useCallback(() => {
    if (room) {
      const audioTrack = Array.from(room.localParticipant.audioTracks.values())[0];
      if (audioTrack) {
        if (audioTrack.track.isEnabled) {
          audioTrack.track.disable();
        } else {
          audioTrack.track.enable();
        }
      }
    }
  }, [room]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      leaveCall();
    };
  }, [leaveCall]);

  return {
    room,
    localTrack,
    participants,
    error,
    joinCall,
    leaveCall,
    toggleVideo,
    toggleAudio
  };
} 