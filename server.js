/* server.js
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
app.use(express.static('public'));

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

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = 'public/uploads';
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error, null);
    }
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
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert user if not exists (you'll need to modify this based on your users table structure)
      const [userResult] = await connection.execute(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [req.body.name, req.body.email]
      );
      const userId = userResult.insertId;

      // Insert each image
      for (const file of req.files) {
        await connection.execute(
          'INSERT INTO images (user_id, image_path, original_filename) VALUES (?, ?, ?)',
          [userId, `/uploads/${file.filename}`, file.originalname]
        );
      }

      await connection.commit();
      res.json({ message: 'Upload successful', files: req.files });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.get('/api/submissions', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT i.*, u.name, u.email 
      FROM images i 
      JOIN users u ON i.user_id = u.id 
      ORDER BY i.created_at DESC
    `);
    
    // Group images by user
    const submissions = rows.reduce((acc, row) => {
      const userId = row.user_id;
      if (!acc[userId]) {
        acc[userId] = {
          name: row.name,
          email: row.email,
          images: []
        };
      }
      acc[userId].images.push({
        id: row.id,
        url: row.image_path,
        originalFilename: row.original_filename,
        createdAt: row.created_at
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
});*/



// server.js
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

// Serve static files from the pixelwallz folder (including uploads)
app.use(express.static('pixelwallz'));  // Serve everything from the pixelwallz folder, including uploads

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

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = 'pixelwallz/uploads';  // Save uploads in the pixelwallz/uploads folder
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error, null);
    }
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
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert user if not exists (you'll need to modify this based on your users table structure)
      const [userResult] = await connection.execute(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [req.body.name, req.body.email]
      );
      const userId = userResult.insertId;

      // Insert each image
      for (const file of req.files) {
        await connection.execute(
          'INSERT INTO images (user_id, image_path, original_filename) VALUES (?, ?, ?)',
          [userId, `/uploads/${file.filename}`, file.originalname]
        );
      }

      await connection.commit();
      res.json({ message: 'Upload successful', files: req.files });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.get('/api/submissions', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT i.*, u.name, u.email 
      FROM images i 
      JOIN users u ON i.user_id = u.id 
      ORDER BY i.created_at DESC
    `);
    
    // Group images by user
    const submissions = rows.reduce((acc, row) => {
      const userId = row.user_id;
      if (!acc[userId]) {
        acc[userId] = {
          name: row.name,
          email: row.email,
          images: []
        };
      }
      acc[userId].images.push({
        id: row.id,
        url: row.image_path, // Ensure this path is correct for fetching the image
        originalFilename: row.original_filename,
        createdAt: row.created_at
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
