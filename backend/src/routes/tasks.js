const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Create task (requires boardId in body)
router.post('/', todoController.createTodo);

// Get tasks (optional filter by boardId in query)
// Note: reusing getTodos which currently expects boardId in params. 
// I might need to minorly adjust getTodos if I want to support GET /api/tasks?boardId=1
// But usually creation is the main blocker. Let's stick to standard operations first.

// Individual task operations
router.get('/:id', todoController.getTodo);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

// Reorder
router.put('/reorder', todoController.reorderTodos);

module.exports = router;
