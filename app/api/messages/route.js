import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getIO } from '@/lib/socket';
import { ObjectId } from 'mongodb';

// Get messages for a conversation
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const recipientId = searchParams.get('recipientId');

    if (!recipientId) {
      return NextResponse.json(
        { error: 'Recipient ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const messages = await db.collection('messages')
      .find({
        $or: [
          { senderId: session.user.id, recipientId },
          { senderId: recipientId, recipientId: session.user.id }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Send a new message
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { recipientId, content } = await request.json();

    if (!recipientId || !content) {
      return NextResponse.json(
        { error: 'Recipient ID and content are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const message = {
      senderId: session.user.id,
      recipientId,
      content,
      createdAt: new Date(),
      read: false
    };

    const result = await db.collection('messages').insertOne(message);

    // Send real-time notification to recipient
    const io = getIO();
    io.to(recipientId).emit('new_message', {
      id: result.insertedId,
      senderId: session.user.id,
      senderName: session.user.name,
      content,
      createdAt: message.createdAt
    });

    return NextResponse.json(
      { message: 'Message sent successfully', id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Mark messages as read
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { senderId } = await request.json();

    if (!senderId) {
      return NextResponse.json(
        { error: 'Sender ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const result = await db.collection('messages').updateMany(
      {
        senderId,
        recipientId: session.user.id,
        read: false
      },
      {
        $set: { read: true }
      }
    );

    return NextResponse.json({
      message: 'Messages marked as read',
      count: result.modifiedCount
    });
  } catch (error) {
    console.error('Mark messages as read error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 