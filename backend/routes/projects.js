const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db');
const { authMiddleware, roleGuard } = require('../middleware/auth');

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, '..', 'uploads/') });
router.post('/', authMiddleware, roleGuard(['officer']), upload.single('image'), async (req, res) => {
  const { project_name, sector, status, village_name, latitude, longitude } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;
  const created_by = req.user.id; // <-- get the user ID from auth middleware
  try {
    const q = await db.query(
      `INSERT INTO projects (project_name, sector, status, village_name, latitude, longitude, image_url, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [project_name, sector, status, village_name, latitude || null, longitude || null, image_url, created_by]
    );
    res.json({ project: q.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
router.put('/:id', authMiddleware, roleGuard(['officer','admin']), upload.single('image'), async (req, res) => {
  const id = req.params.id;
  const { project_name, sector, status, village_name, latitude, longitude } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const q = await db.query(
      `UPDATE projects SET project_name=$1, sector=$2, status=$3, village_name=$4, latitude=$5, longitude=$6, image_url=COALESCE($7,image_url)
       WHERE id=$8 RETURNING *`,
      [project_name, sector, status, village_name, latitude || null, longitude || null, image_url, id]
    );
    if (!q.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json({ project: q.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.delete('/:id', authMiddleware, roleGuard(['admin']), async (req, res) => {
  const id = req.params.id;
  try {
    await db.query('DELETE FROM projects WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all projects
router.get('/', async (req, res) => {
  try {
    const q = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json({ projects: q.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get top 3 completed by village
router.get('/village/:village', async (req, res) => {
  try {
    const village = req.params.village;
    const q = await db.query(
      'SELECT * FROM projects WHERE village_name=$1 AND status=$2 ORDER BY created_at DESC LIMIT 3',
      [village, 'Completed']
    );
    res.json({ projects: q.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
