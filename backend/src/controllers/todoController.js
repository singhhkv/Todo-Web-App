const pool = require('../config/database');

// Verify board ownership
const verifyBoardOwnership = async (boardId, userId) => {
  const result = await pool.query(
    'SELECT * FROM boards WHERE id = $1 AND user_id = $2',
    [boardId, userId]
  );
  return result.rows.length > 0;
};

// Create todo
const createTodo = async (req, res) => {
  try {
    let { boardId } = req.params;
    const { title, description, priority, dueDate } = req.body;

    // If boardId not in params, check body
    if (!boardId) {
      boardId = req.body.boardId;
    }

    if (!boardId) {
      return res.status(400).json({
        success: false,
        message: 'Board ID is required.'
      });
    }
    const userId = req.user.id;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Todo title is required.'
      });
    }

    // Verify board ownership
    const hasAccess = await verifyBoardOwnership(boardId, userId);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    // Get max position
    const posResult = await pool.query(
      'SELECT COALESCE(MAX(position), -1) as max_pos FROM todos WHERE board_id = $1',
      [boardId]
    );
    const position = posResult.rows[0].max_pos + 1;

    const result = await pool.query(
      `INSERT INTO todos (board_id, title, description, priority, due_date, position) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [
        boardId,
        title.trim(),
        description || '',
        priority || 'medium',
        dueDate || null,
        position
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Todo created successfully!',
      todo: result.rows[0],
    });
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating todo.'
    });
  }
};

// Get todos for board
const getTodos = async (req, res) => {
  try {
    const { boardId } = req.params;
    const userId = req.user.id;

    // Verify board ownership
    const hasAccess = await verifyBoardOwnership(boardId, userId);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    const result = await pool.query(
      'SELECT * FROM todos WHERE board_id = $1 ORDER BY position ASC',
      [boardId]
    );

    res.json({
      success: true,
      todos: result.rows,
    });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching todos.'
    });
  }
};

// Get single todo
const getTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT t.* FROM todos t
       JOIN boards b ON t.board_id = b.id
       WHERE t.id = $1 AND b.user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found.'
      });
    }

    res.json({
      success: true,
      todo: result.rows[0],
    });
  } catch (error) {
    console.error('Get todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching todo.'
    });
  }
};

// Update todo
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, dueDate, isCompleted } = req.body;
    const userId = req.user.id;

    // Verify ownership
    const checkResult = await pool.query(
      `SELECT t.* FROM todos t
       JOIN boards b ON t.board_id = b.id
       WHERE t.id = $1 AND b.user_id = $2`,
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found.'
      });
    }

    const currentTodo = checkResult.rows[0];

    const result = await pool.query(
      `UPDATE todos 
       SET title = $1, description = $2, priority = $3, due_date = $4, 
           is_completed = $5, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $6 
       RETURNING *`,
      [
        title !== undefined ? title.trim() : currentTodo.title,
        description !== undefined ? description : currentTodo.description,
        priority !== undefined ? priority : currentTodo.priority,
        dueDate !== undefined ? dueDate : currentTodo.due_date,
        isCompleted !== undefined ? isCompleted : currentTodo.is_completed,
        id
      ]
    );

    res.json({
      success: true,
      message: 'Todo updated successfully!',
      todo: result.rows[0],
    });
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating todo.'
    });
  }
};

// Reorder todos (for drag-and-drop)
const reorderTodos = async (req, res) => {
  try {
    const { todos } = req.body; // Array of { id, position }
    const userId = req.user.id;

    if (!Array.isArray(todos) || todos.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todos array.'
      });
    }

    // Update positions in a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (const todo of todos) {
        // Verify ownership
        const checkResult = await client.query(
          `SELECT t.* FROM todos t
           JOIN boards b ON t.board_id = b.id
           WHERE t.id = $1 AND b.user_id = $2`,
          [todo.id, userId]
        );

        if (checkResult.rows.length === 0) {
          throw new Error('Access denied for todo ' + todo.id);
        }

        await client.query(
          'UPDATE todos SET position = $1 WHERE id = $2',
          [todo.position, todo.id]
        );
      }

      await client.query('COMMIT');

      res.json({
        success: true,
        message: 'Todos reordered successfully!',
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Reorder todos error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while reordering todos.'
    });
  }
};

// Delete todo
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `DELETE FROM todos t
       USING boards b
       WHERE t.board_id = b.id AND t.id = $1 AND b.user_id = $2
       RETURNING t.*`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found.'
      });
    }

    res.json({
      success: true,
      message: 'Todo deleted successfully!',
    });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting todo.'
    });
  }
};

module.exports = {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  reorderTodos,
  deleteTodo,
};
