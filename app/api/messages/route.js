import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Message from '@/models/Message';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getIO } from '@/lib/socket';
import { ObjectId } from 'mongodb';

// Get messages for a conversation
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const receiverId = searchParams.get('receiverId');
    const receiverType = searchParams.get('receiverType');
    
    if (!receiverId || !receiverType) {
      return NextResponse.json(
        { error: 'Receiver ID and type are required' },
        { status: 400 }
      );
    }
    
    const messages = await Message.find({
      $or: [
        {
          senderId: session.user.id,
          senderType: 'User',
          receiverId,
          receiverType
        },
        {
          senderId: receiverId,
          senderType: receiverType,
          receiverId: session.user.id,
          receiverType: 'User'
        }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('senderId', 'name profilePicture')
    .populate('receiverId', 'name profilePicture');
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
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

    await connectToDatabase();
    
    const body = await request.json();
    const { receiverId, receiverType, content, attachments } = body;
    
    const message = new Message({
      senderId: session.user.id,
      senderType: 'User',
      receiverId,
      receiverType,
      content,
      attachments: attachments || []
    });
    
    await message.save();
    
    // Emit real-time message using Socket.io
    const io = getIO();
    io.to(receiverId).emit('new_message', message);
    
    return NextResponse.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
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