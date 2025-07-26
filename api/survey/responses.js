import { MongoClient } from 'mongodb';

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(process.env.MONGODB_URI);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(process.env.MONGODB_URI);
  clientPromise = client.connect();
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('lpc-survey');
    const collection = db.collection('responses');

    const responses = await collection.find({})
      .sort({ timestamp: -1 }) // Most recent first
      .toArray();

    res.status(200).json({
      success: true,
      count: responses.length,
      responses: responses.map(response => ({
        id: response._id,
        userName: response.userName,
        timestamp: response.timestamp,
        totalRequest: response.totalRequest,
        submittedAt: response.submittedAt
      }))
    });

  } catch (error) {
    console.error('❌ Error fetching survey responses:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}