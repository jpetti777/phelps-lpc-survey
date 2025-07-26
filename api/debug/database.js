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
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔍 Debug: Checking database connection...');

    const client = await clientPromise;
    const db = client.db('lpc-survey');

    // Check if database exists and get collections
    const admin = db.admin();
    const dbList = await admin.listDatabases();
    const hasLpcSurveyDb = dbList.databases.some(database => database.name === 'lpc-survey');

    console.log('🔍 Debug: Database list:', dbList.databases.map(d => d.name));
    console.log('🔍 Debug: lpc-survey database exists:', hasLpcSurveyDb);

    // Get collections
    const collections = await db.listCollections().toArray();
    console.log('🔍 Debug: Collections:', collections.map(c => c.name));

    // Check responses collection
    const responsesCollection = db.collection('responses');
    const responseCount = await responsesCollection.countDocuments();
    console.log('🔍 Debug: Response count:', responseCount);

    // Get recent responses (limit to 5 for debugging)
    const recentResponses = await responsesCollection
      .find({})
      .sort({ timestamp: -1 })
      .limit(5)
      .project({ userName: 1, timestamp: 1, totalRequest: 1, submittedAt: 1 })
      .toArray();

    console.log('🔍 Debug: Recent responses:', recentResponses);

    res.status(200).json({
      success: true,
      debug: {
        mongoConnected: true,
        databaseExists: hasLpcSurveyDb,
        collections: collections.map(c => c.name),
        responseCount,
        recentResponses,
        environment: process.env.NODE_ENV,
        mongoUriExists: !!process.env.MONGODB_URI,
        mongoUriSample: process.env.MONGODB_URI ? 
          process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') : 
          'NOT_SET'
      }
    });

  } catch (error) {
    console.error('❌ Debug error:', error);
    res.status(500).json({
      error: 'Debug failed',
      message: error.message,
      stack: error.stack
    });
  }
}