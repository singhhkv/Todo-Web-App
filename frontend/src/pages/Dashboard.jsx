import { useState, useEffect } from 'react';
import {
  Plus,
  LayoutGrid,
  Trash2,
  Edit2,
  Check,
  Calendar,
  Filter,
  Clock,
  Activity,
  MoreHorizontal
} from 'lucide-react';
import { boardsAPI, todosAPI } from '../services/api';
import { Button, Card, Modal, Input, Badge } from '../components/common';
import toast from 'react-hot-toast';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Components ---

const TaskCard = ({ todo, onUpdate, onDelete, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  const isOverdue = todo.due_date && isPast(new Date(todo.due_date)) && !todo.is_completed;

  const getPriorityColor = (p) => {
    switch (p) {
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'medium': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'low': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`glass-panel p-5 group transition-all hover:bg-dark-800/80 hover:-translate-y-1
                  ${todo.is_completed ? 'opacity-60 grayscale' : ''}`}
    >
      <div className="flex items-start gap-4">
        {/* Custom Checkbox */}
        <button
          className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                     ${todo.is_completed
              ? 'bg-brand-500 border-brand-500'
              : 'border-white/10 hover:border-brand-500'}`}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onUpdate(todo.id, { isCompleted: !todo.is_completed });
          }}
        >
          {todo.is_completed && <Check size={14} className="text-white" strokeWidth={4} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className={`font-semibold text-lg text-gray-100 mb-1 ${todo.is_completed ? 'line-through text-gray-500' : ''}`}>
              {todo.title}
            </h3>

            <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => onEdit(todo)} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition">
                <Edit2 size={16} />
              </button>
              <button onClick={() => onDelete(todo.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition">
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-400 line-clamp-2 mb-3 font-sans">
            {todo.description}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(todo.priority)}`}>
              {todo.priority}
            </span>

            {todo.due_date && (
              <span className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border
                             ${isOverdue
                  ? 'bg-red-500/10 text-red-400 border-red-500/20'
                  : 'bg-dark-700 text-gray-400 border-white/5'}`}>
                <Calendar size={12} />
                {format(new Date(todo.due_date), 'MMM d')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Page ---

export const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Modals & Forms
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [boardName, setBoardName] = useState('');
  const [boardDesc, setBoardDesc] = useState('');
  const [todoForm, setTodoForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchBoards();
  }, []);

  useEffect(() => {
    if (currentBoard) {
      fetchTodos(currentBoard.id);
    }
  }, [currentBoard]);

  const fetchBoards = async () => {
    try {
      const response = await boardsAPI.getAll();
      setBoards(response.data.boards);
      if (response.data.boards.length > 0 && !currentBoard) {
        setCurrentBoard(response.data.boards[0]);
      }
    } catch (error) {
      toast.error('Failed to fetch boards');
    } finally {
      setLoading(false);
    }
  };

  const fetchTodos = async (boardId) => {
    try {
      const response = await todosAPI.getAll(boardId);
      setTodos(response.data.todos);
    } catch (error) {
      toast.error('Failed to fetch todos');
    }
  };

  // --- Handlers (Create/Update/Delete) ---
  // (Identical logic to before, just cleaner implementation)
  const handleCreateBoard = async (e) => {
    e.preventDefault();
    try {
      const response = await boardsAPI.create({ name: boardName, description: boardDesc });
      setBoards([...boards, response.data.board]);
      setCurrentBoard(response.data.board);
      toast.success('Board created!');
      setShowBoardModal(false);
      setBoardName(''); setBoardDesc('');
    } catch (error) { toast.error('Failed to create board'); }
  };

  const handleDeleteBoard = async (boardId) => {
    if (!confirm('Delete this board?')) return;
    try {
      await boardsAPI.delete(boardId);
      const newBoards = boards.filter(b => b.id !== boardId);
      setBoards(newBoards);
      if (currentBoard?.id === boardId) setCurrentBoard(newBoards[0] || null);
      toast.success('Board deleted');
    } catch (error) { toast.error('Failed to delete board'); }
  };

  const handleCreateTodo = async (e) => {
    e.preventDefault();
    try {
      const response = await todosAPI.create(currentBoard.id, {
        ...todoForm, dueDate: todoForm.dueDate || null
      });
      setTodos([response.data.todo, ...todos]); // Add to top
      toast.success('Task added');
      setShowTodoModal(false);
      setTodoForm({ title: '', description: '', priority: 'medium', dueDate: '' });
    } catch (error) { toast.error('Failed to create task'); }
  };

  const handleUpdateTodo = async (id, updates) => {
    const prev = [...todos];
    setTodos(todos.map(t => t.id === id ? { ...t, ...updates, is_completed: updates.isCompleted ?? t.is_completed } : t));
    try { await todosAPI.update(id, updates); }
    catch (error) { setTodos(prev); toast.error('Failed to update'); }
  };

  const handleEditTodo = async (e) => {
    e.preventDefault();
    const updates = { ...todoForm, dueDate: todoForm.dueDate || null };
    const prev = [...todos];
    setTodos(todos.map(t => t.id === editingTodo.id ? { ...t, ...updates } : t));
    setShowTodoModal(false); setEditingTodo(null);
    try { await todosAPI.update(editingTodo.id, updates); toast.success('Updated'); }
    catch (error) { setTodos(prev); toast.error('Failed to update'); }
  };

  const handleDeleteTodo = async (id) => {
    const prev = [...todos];
    setTodos(todos.filter(t => t.id !== id));
    try { await todosAPI.delete(id); toast.success('Deleted'); }
    catch (error) { setTodos(prev); toast.error('Failed to delete'); }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = todos.findIndex(t => t.id === active.id);
    const newIndex = todos.findIndex(t => t.id === over.id);
    const reordered = arrayMove(todos, oldIndex, newIndex);
    setTodos(reordered);

    try {
      await todosAPI.reorder(reordered.map((t, i) => ({ id: t.id, position: i })));
    } catch (error) { toast.error('Failed to save order'); fetchTodos(currentBoard.id); }
  };

  // --- Render Helpers ---

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.is_completed;
    if (filter === 'completed') return t.is_completed;
    return true;
  });

  const upcomingTodos = todos
    .filter(t => t.due_date && !t.is_completed)
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 3);

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.is_completed).length,
    progress: todos.length ? Math.round((todos.filter(t => t.is_completed).length / todos.length) * 100) : 0
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-brand-500">Loading...</div>;

  return (
    <div className="min-h-screen pb-10">
      {/* Top Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            {currentBoard ? currentBoard.name : 'Dashboard'}
          </h1>
          <p className="text-gray-400 mt-1">
            {currentBoard?.description || 'Manage your tasks efficiently'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => { setEditingTodo(null); setTodoForm({ title: '', description: '', priority: 'medium', dueDate: '' }); setShowTodoModal(true); }}>
            <Plus size={18} className="mr-2" />
            New Task
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

        {/* Left Column: Widgets (Ordered first for mobile stacking if needed, but usually main content first for accessibility. CSS grid handles visual order) */}
        {/* Actually let's put Widgets on RIGHT for Desktop */}

        {/* Main Content: Task Grid */}
        <div className="xl:col-span-3 space-y-6">

          {/* Filters & View Controls */}
          <div className="glass-panel p-2 flex items-center justify-between">
            <div className="flex bg-dark-900/50 rounded-lg p-1">
              {['all', 'active', 'completed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === f
                      ? 'bg-dark-700 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                    }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <div className="border-l border-white/5 pl-4 ml-4">
              <span className="text-xs font-mono text-gray-500">{filteredTodos.length} TASKS</span>
            </div>
          </div>

          {/* Draggable Grid */}
          {currentBoard ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={filteredTodos.map(t => t.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTodos.map(todo => (
                    <TaskCard
                      key={todo.id}
                      todo={todo}
                      onUpdate={handleUpdateTodo}
                      onDelete={handleDeleteTodo}
                      onEdit={(t) => {
                        setEditingTodo(t);
                        let formattedDate = '';
                        if (t.due_date) {
                          const date = new Date(t.due_date);
                          if (!isNaN(date.getTime())) {
                            formattedDate = format(date, 'yyyy-MM-dd');
                          }
                        }
                        setTodoForm({
                          title: t.title,
                          description: t.description || '',
                          priority: t.priority,
                          dueDate: formattedDate,
                        });
                        setShowTodoModal(true);
                      }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="glass-panel p-10 text-center text-gray-400">
              Select or create a board to get started
            </div>
          )}
        </div>

        {/* Right Sidebar Widgets */}
        <div className="space-y-6">

          {/* Stats Widget */}
          <div className="glass-panel p-6 bg-gradient-to-br from-dark-800 to-dark-900">
            <h3 className="text-gray-300 font-semibold mb-4 flex items-center gap-2">
              <Activity size={18} className="text-brand-400" /> Productivity
            </h3>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-bold text-white">{stats.progress}%</span>
              <span className="text-sm text-gray-400 mb-1.5">completion</span>
            </div>
            <div className="w-full bg-dark-950 rounded-full h-2 mb-4">
              <div
                className="bg-brand-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.progress}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-3 bg-dark-950/50 rounded-lg">
                <p className="text-gray-400">Done</p>
                <p className="text-xl font-semibold text-accent-green">{stats.completed}</p>
              </div>
              <div className="p-3 bg-dark-950/50 rounded-lg">
                <p className="text-gray-400">Total</p>
                <p className="text-xl font-semibold text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          {/* Boards List Widget */}
          <div className="glass-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-200">My Boards</h3>
              <button onClick={() => setShowBoardModal(true)} className="p-1 hover:bg-white/10 rounded">
                <Plus size={16} className="text-brand-400" />
              </button>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {boards.map(b => (
                <button
                  key={b.id}
                  onClick={() => setCurrentBoard(b)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex justify-between group
                                ${currentBoard?.id === b.id
                      ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                      : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
                >
                  <span className="truncate">{b.name}</span>
                  <Trash2
                    size={14}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition"
                    onClick={(e) => { e.stopPropagation(); handleDeleteBoard(b.id); }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Upcoming Widget */}
          <div className="glass-panel p-5">
            <h3 className="font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <Clock size={16} className="text-accent-pink" />
              Upcoming
            </h3>
            <div className="space-y-3">
              {upcomingTodos.length > 0 ? upcomingTodos.map(t => (
                <div key={t.id} className="flex gap-3 items-start p-2 rounded-lg hover:bg-white/5 transition">
                  <div className="w-1 h-8 bg-brand-500 rounded-full shrink-0"></div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">{t.title}</p>
                    <p className="text-xs text-brand-400">
                      {t.due_date ? format(new Date(t.due_date), 'MMM d, h:mm a') : 'No date'}
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-500 italic">No upcoming deadlines.</p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Modals - Reused with new styling automatically from common components */}
      <Modal isOpen={showBoardModal} onClose={() => setShowBoardModal(false)} title="Create Board">
        <form onSubmit={handleCreateBoard} className="space-y-4">
          <Input label="Name" value={boardName} onChange={(e) => setBoardName(e.target.value)} required autoFocus placeholder="Project Phoenix" />
          <Input label="Description" value={boardDesc} onChange={(e) => setBoardDesc(e.target.value)} placeholder="Goals for Q4..." />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowBoardModal(false)}>Cancel</Button>
            <Button type="submit">Create Board</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showTodoModal} onClose={() => setShowTodoModal(false)} title={editingTodo ? 'Edit Task' : 'New Task'}>
        <form onSubmit={editingTodo ? handleEditTodo : handleCreateTodo} className="space-y-4">
          <Input label="Checklist Item" value={todoForm.title} onChange={(e) => setTodoForm({ ...todoForm, title: e.target.value })} required autoFocus placeholder="Review designs..." />

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Description</label>
            <textarea
              className="input min-h-[100px]"
              value={todoForm.description}
              onChange={(e) => setTodoForm({ ...todoForm, description: e.target.value })}
              placeholder="Add details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Priority</label>
              <select className="input" value={todoForm.priority} onChange={(e) => setTodoForm({ ...todoForm, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <Input label="Due Date" type="date" value={todoForm.dueDate} onChange={(e) => setTodoForm({ ...todoForm, dueDate: e.target.value })} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowTodoModal(false)}>Cancel</Button>
            <Button type="submit">{editingTodo ? 'Save Changes' : 'Create Task'}</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
