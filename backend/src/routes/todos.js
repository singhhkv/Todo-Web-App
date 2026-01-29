const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Reorder todos (batch update)
router.put('/reorder', todoController.reorderTodos);

// Board-specific todos
router.post('/boards/:boardId/todos', todoController.createTodo);
router.get('/boards/:boardId/todos', todoController.getTodos);

// Individual todo operations
router.get('/:id', todoController.getTodo);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
