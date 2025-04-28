import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;

const client = twilio(apiKey, apiSecret, { accountSid });

export async function generateToken(identity, roomName) {
  try {
    const AccessToken = twilio.jwt.AccessToken;
    const VideoGrant = AccessToken.VideoGrant;

    // Create Video Grant
    const videoGrant = new VideoGrant({
      room: roomName,
    });

    // Create Access Token
    const token = new AccessToken(accountSid, apiKey, apiSecret);
    token.addGrant(videoGrant);
    token.identity = identity;

    return token.toJwt();
  } catch (error) {
    console.error('Error generating Twilio token:', error);
    throw error;
  }
}

export async function createRoom(roomName) {
  try {
    const room = await client.video.v1.rooms.create({
      uniqueName: roomName,
      type: 'group',
      recordParticipantsOnConnect: false
    });
    return room;
  } catch (error) {
    console.error('Error creating Twilio room:', error);
    throw error;
  }
}

export async function endRoom(roomName) {
  try {
    const room = await client.video.v1.rooms(roomName)
      .update({ status: 'completed' });
    return room;
  } catch (error) {
    console.error('Error ending Twilio room:', error);
    throw error;
  }
} 