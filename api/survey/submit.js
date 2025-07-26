import { MongoClient } from 'mongodb';

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(process.env.MONGODB_URI);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(process.env.MONGODB_URI);
  clientPromise = client.connect();
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('lpc-survey');
    const collection = db.collection('responses');

    const {
      userName,
      evaluations,
      scores,
      categories,
      projectSelections,
      totalRequest
    } = req.body;

    // Validate required fields
    if (!userName || !evaluations || !scores || !categories || !projectSelections || totalRequest === undefined) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['userName', 'evaluations', 'scores', 'categories', 'projectSelections', 'totalRequest']
      });
    }

    // Validate total request range
    if (totalRequest < 6000000 || totalRequest > 8000000) {
      return res.status(400).json({
        error: 'Total request must be between $6,000,000 and $8,000,000',
        received: totalRequest
      });
    }

    const surveyResponse = {
      userName,
      evaluations,
      scores,
      categories,
      projectSelections,
      totalRequest,
      timestamp: new Date(),
      submittedAt: new Date().toISOString()
    };

    const result = await collection.insertOne(surveyResponse);

    console.log(`✅ Survey submitted by: ${userName} at ${new Date().toISOString()}`);

    res.status(201).json({
      success: true,
      message: 'Survey response saved successfully',
      id: result.insertedId,
      timestamp: surveyResponse.timestamp
    });

  } catch (error) {
    console.error('❌ Error saving survey response:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}