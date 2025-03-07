import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../lib/firebase'; // or MongoDB connection

const notes = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { note, name } = req.body;
    await db.collection('notes').add({ note, name, createdAt: new Date() });
    res.status(201).json({ message: 'Note added successfully!' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

export default notes;
