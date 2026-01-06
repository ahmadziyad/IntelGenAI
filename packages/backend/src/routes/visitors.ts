import { Router, Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';

const router = Router();
const VISITOR_FILE = path.join(__dirname, '../data/visitors.json');

interface VisitorData {
  count: number;
  lastUpdated: string;
}

// Ensure data directory exists
const ensureDataDir = async () => {
  const dataDir = path.dirname(VISITOR_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
};

// Read visitor count from file
const readVisitorCount = async (): Promise<VisitorData> => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(VISITOR_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist or is corrupted, return default
    return {
      count: 1110,
      lastUpdated: new Date().toISOString()
    };
  }
};

// Write visitor count to file
const writeVisitorCount = async (data: VisitorData): Promise<void> => {
  await ensureDataDir();
  await fs.writeFile(VISITOR_FILE, JSON.stringify(data, null, 2));
};

// GET /api/visitors - Get current visitor count
router.get('/', async (req: Request, res: Response) => {
  try {
    const data = await readVisitorCount();
    res.json({
      success: true,
      count: data.count,
      lastUpdated: data.lastUpdated
    });
  } catch (error) {
    console.error('Error reading visitor count:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to read visitor count',
      count: 1110 // Fallback count
    });
  }
});

// POST /api/visitors/increment - Increment visitor count
router.post('/increment', async (req: Request, res: Response) => {
  try {
    const currentData = await readVisitorCount();
    const newData: VisitorData = {
      count: currentData.count + 1,
      lastUpdated: new Date().toISOString()
    };
    
    await writeVisitorCount(newData);
    
    res.json({
      success: true,
      count: newData.count,
      lastUpdated: newData.lastUpdated,
      increment: true
    });
  } catch (error) {
    console.error('Error incrementing visitor count:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to increment visitor count'
    });
  }
});

// POST /api/visitors/reset - Reset visitor count (for admin use)
router.post('/reset', async (req: Request, res: Response) => {
  try {
    const { count = 1110 } = req.body;
    const newData: VisitorData = {
      count: parseInt(count, 10),
      lastUpdated: new Date().toISOString()
    };
    
    await writeVisitorCount(newData);
    
    res.json({
      success: true,
      count: newData.count,
      lastUpdated: newData.lastUpdated,
      reset: true
    });
  } catch (error) {
    console.error('Error resetting visitor count:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset visitor count'
    });
  }
});

export default router;