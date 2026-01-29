const pool = require('../config/database');

// Create board
const createBoard = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name || name.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Board name is required.' 
      });
    }

    const result = await pool.query(
      'INSERT INTO boards (user_id, name, description) VALUES ($1, $2, $3) RETURNING *',
      [userId, name.trim(), description || '']
    );

    res.status(201).json({
      success: true,
      message: 'Board created successfully!',
      board: result.rows[0],
    });
  } catch (error) {
    console.error('Create board error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating board.' 
    });
  }
};

// Get all boards for user
const getBoards = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT b.*, 
        COUNT(t.id) as todo_count,
        COUNT(t.id) FILTER (WHERE t.is_completed = true) as completed_count
       FROM boards b
       LEFT JOIN todos t ON b.id = t.board_id
       WHERE b.user_id = $1
       GROUP BY b.id
       ORDER BY b.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      boards: result.rows,
    });
  } catch (error) {
    console.error('Get boards error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching boards.' 
    });
  }
};

// Get single board
const getBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT * FROM boards WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Board not found.' 
      });
    }

    res.json({
      success: true,
      board: result.rows[0],
    });
  } catch (error) {
    console.error('Get board error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching board.' 
    });
  }
};

// Update board
const updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name || name.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Board name is required.' 
      });
    }

    const result = await pool.query(
      `UPDATE boards 
       SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 AND user_id = $4 
       RETURNING *`,
      [name.trim(), description || '', id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Board not found.' 
      });
    }

    res.json({
      success: true,
      message: 'Board updated successfully!',
      board: result.rows[0],
    });
  } catch (error) {
    console.error('Update board error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating board.' 
    });
  }
};

// Delete board
const deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'DELETE FROM boards WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Board not found.' 
      });
    }

    res.json({
      success: true,
      message: 'Board deleted successfully!',
    });
  } catch (error) {
    console.error('Delete board error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting board.' 
    });
  }
};

module.exports = {
  createBoard,
  getBoards,
  getBoard,
  updateBoard,
  deleteBoard,
};
