import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { to, passengerName, driverName, pickupLocation, dropoffLocation, fareAmount, driverContact} = req.body;
  const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

  const message:string = `Hi ${passengerName}, your ride is confirmed
*Driver Name:* ${driverName}
*Pickup Location:* ${pickupLocation}
*Dropoff Location:* ${dropoffLocation}
*Fare:* ₹${fareAmount}
If any issues, contact me:  ${driverContact}`

  try {
    const response = await client.messages.create({
      to: `whatsapp:${to}`,
      from: 'whatsapp:+14155238886', // Twilio's WhatsApp sandbox number
      body: message,
    });

    res.status(200).json({ message: 'Message sent!', response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending message', error });
  }
}

