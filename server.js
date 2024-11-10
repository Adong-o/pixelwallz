

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2/promise');
const fs = require('fs').promises;

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'pixelwallz', 'uploads');
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

// Serve static files
app.use(express.static('pixelwallz'));
app.use('/uploads', express.static(path.join(__dirname, 'pixelwallz', 'uploads')));

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'imageoasis',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Routes
app.post('/api/upload', upload.array('images', 5), async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    await connection.beginTransaction();

    // Check if user exists first
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [req.body.email]
    );

    let userId;
    if (existingUsers.length > 0) {
      userId = existingUsers[0].id;
    } else {
      // Create new user
      const [userResult] = await connection.execute(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [req.body.name, req.body.email]
      );
      userId = userResult.insertId;
    }

    // Insert images
    for (const file of req.files) {
      const imagePath = `/uploads/${file.filename}`;
      await connection.execute(
        'INSERT INTO images (user_id, image_path, original_filename) VALUES (?, ?, ?)',
        [userId, imagePath, file.originalname]
      );
    }

    await connection.commit();
    res.json({ 
      message: 'Upload successful', 
      files: req.files.map(file => ({
        filename: file.filename,
        path: `/uploads/${file.filename}`
      }))
    });

  } catch (error) {
    await connection.rollback();
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed: ' + error.message });
  } finally {
    connection.release();
  }
});

app.get('/api/submissions', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        i.id as image_id,
        i.image_path,
        i.original_filename,
        i.created_at as image_created_at,
        u.id as user_id,
        u.name,
        u.email
      FROM images i 
      JOIN users u ON i.user_id = u.id 
      ORDER BY i.created_at DESC
    `);
    
    // Transform the data for frontend
    const submissions = rows.reduce((acc, row) => {
      if (!acc[row.user_id]) {
        acc[row.user_id] = {
          userId: row.user_id,
          name: row.name,
          email: row.email,
          images: []
        };
      }
      
      acc[row.user_id].images.push({
        id: row.image_id,
        url: row.image_path,
        originalFilename: row.original_filename,
        createdAt: row.image_created_at
      });
      
      return acc;
    }, {});

    res.json(Object.values(submissions));
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
