import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { generateToken, createRoom, endRoom } from '@/lib/twilio';
import { getIO } from '@/lib/socket';

// Generate token for video call
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { appointmentId } = await request.json();
    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    // Create a unique room name using appointment ID
    const roomName = `appointment-${appointmentId}`;

    // Create Twilio room
    await createRoom(roomName);

    // Generate access token
    const token = await generateToken(session.user.id, roomName);

    return NextResponse.json({ token, roomName });
  } catch (error) {
    console.error('Video token generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// End video call
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roomName } = await request.json();
    if (!roomName) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      );
    }

    // End Twilio room
    await endRoom(roomName);

    // Notify participants that call has ended
    const io = getIO();
    io.to(roomName).emit('call_ended', { roomName });

    return NextResponse.json({ message: 'Call ended successfully' });
  } catch (error) {
    console.error('End video call error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 