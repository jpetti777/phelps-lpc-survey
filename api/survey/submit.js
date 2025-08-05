import { MongoClient } from 'mongodb';

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add ayour Mongo URI to .env.local');
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
  console.log('🚀 API called:', req.method, req.url);

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
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔗 Connecting to MongoDB...');
    console.log('📊 MongoDB URI exists:', !!process.env.MONGODB_URI);
    console.log('🌍 Environment:', process.env.NODE_ENV);

    const client = await clientPromise;
    const db = client.db('lpc-survey');
    const collection = db.collection('responses');

    console.log('✅ Connected to MongoDB successfully');

    const {
      userName,
      evaluations,
      scores,
      categories,
      projectSelections,
      projectOptions,  // ← ADDED THIS
      totalRequest
    } = req.body;

    console.log('📥 Received data:', {
      userName,
      totalRequest,
      hasEvaluations: !!evaluations,
      hasScores: !!scores,
      hasCategories: !!categories,
      hasProjectSelections: !!projectSelections,
      hasProjectOptions: !!projectOptions,  // ← ADDED THIS
      evaluationsCount: evaluations ? Object.keys(evaluations).length : 0,
      selectionsCount: projectSelections ? Object.keys(projectSelections).length : 0,
      optionsCount: projectOptions ? Object.keys(projectOptions).length : 0  // ← ADDED THIS
    });

    // Validate required fields
    if (!userName || !evaluations || !scores || !categories || !projectSelections || totalRequest === undefined) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['userName', 'evaluations', 'scores', 'categories', 'projectSelections', 'totalRequest'],
        received: {
          userName: !!userName,
          evaluations: !!evaluations,
          scores: !!scores,
          categories: !!categories,
          projectSelections: !!projectSelections,
          projectOptions: !!projectOptions,  // ← ADDED THIS
          totalRequest: totalRequest !== undefined
        }
      });
    }

    // Validate total request range
    if (totalRequest < 6000000 || totalRequest > 8000000) {
      console.log('❌ Invalid total request amount:', totalRequest);
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
      projectOptions,  // ← ADDED THIS
      totalRequest,
      timestamp: new Date(),
      submittedAt: new Date().toISOString(),
      metadata: {
        userAgent: req.headers['user-agent'],
        ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress,
        submissionId: Math.random().toString(36).substr(2, 9)
      }
    };

    console.log('💾 Attempting to save to database...');
    const result = await collection.insertOne(surveyResponse);
    console.log('✅ Saved successfully with ID:', result.insertedId);

    // Verify the document was actually saved
    const savedDoc = await collection.findOne({ _id: result.insertedId });
    console.log('🔍 Verification - Document exists:', !!savedDoc);
    console.log('🔍 Verification - Document userName:', savedDoc?.userName);
    console.log('🔍 Verification - Document projectOptions:', savedDoc?.projectOptions);  // ← ADDED THIS

    console.log(`✅ Survey submitted by: ${userName} at ${new Date().toISOString()}`);

    res.status(201).json({
      success: true,
      message: 'Survey response saved successfully',
      id: result.insertedId,
      timestamp: surveyResponse.timestamp,
      submissionId: surveyResponse.metadata.submissionId
    });

  } catch (error) {
    console.error('❌ Error saving survey response:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      type: error.name
    });
  }
}