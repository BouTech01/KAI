// Task Management App
class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.currentSort = 'date-added';
        this.editingTaskId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // Add Task
        document.getElementById('addBtn').addEventListener('click', () => this.addTask());
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Filter Buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.getAttribute('data-filter')));
        });

        // Sort Select
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.render();
        });

        // Footer Actions
        document.getElementById('clearCompleted').addEventListener('click', () => this.clearCompleted());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportTasks());
        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });
        document.getElementById('importFile').addEventListener('change', (e) => this.importTasks(e));

        // Modal
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveEditedTask());
        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target.id === 'editModal') this.closeModal();
        });
    }

    addTask() {
        const input = document.getElementById('taskInput');
        const priority = document.getElementById('prioritySelect').value;
        const dueDate = document.getElementById('dueDate').value;
        const text = input.value.trim();

        if (!text) {
            alert('Please enter a task');
            return;
        }

        const task = {
            id: Date.now(),
            text,
            priority,
            dueDate,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.render();

        // Clear inputs
        input.value = '';
        document.getElementById('prioritySelect').value = 'medium';
        document.getElementById('dueDate').value = '';
        input.focus();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            task.updatedAt = new Date().toISOString();
            this.saveTasks();
            this.render();
        }
    }

    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveTasks();
            this.render();
        }
    }

    openEditModal(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        this.editingTaskId = id;
        document.getElementById('editTaskInput').value = task.text;
        document.getElementById('editPrioritySelect').value = task.priority;
        document.getElementById('editDueDate').value = task.dueDate || '';
        document.getElementById('editModal').classList.add('active');
    }

    closeModal() {
        document.getElementById('editModal').classList.remove('active');
        this.editingTaskId = null;
    }

    saveEditedTask() {
        const task = this.tasks.find(t => t.id === this.editingTaskId);
        if (!task) return;

        task.text = document.getElementById('editTaskInput').value.trim();
        task.priority = document.getElementById('editPrioritySelect').value;
        task.dueDate = document.getElementById('editDueDate').value;
        task.updatedAt = new Date().toISOString();

        if (!task.text) {
            alert('Task description cannot be empty');
            return;
        }

        this.saveTasks();
        this.closeModal();
        this.render();
    }

    clearCompleted() {
        const count = this.tasks.filter(t => t.completed).length;
        if (count === 0) {
            alert('No completed tasks to clear');
            return;
        }
        if (confirm(`Delete ${count} completed task(s)?`)) {
            this.tasks = this.tasks.filter(t => !t.completed);
            this.saveTasks();
            this.render();
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
        });
        this.render();
    }

    getFilteredAndSortedTasks() {
        let filtered = this.tasks;

        // Apply filter
        switch (this.currentFilter) {
            case 'active':
                filtered = filtered.filter(t => !t.completed);
                break;
            case 'completed':
                filtered = filtered.filter(t => t.completed);
                break;
            case 'high':
                filtered = filtered.filter(t => t.priority === 'high');
                break;
        }

        // Apply sort
        switch (this.currentSort) {
            case 'priority':
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
                break;
            case 'due-date':
                filtered.sort((a, b) => {
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                });
                break;
            case 'alphabetical':
                filtered.sort((a, b) => a.text.localeCompare(b.text));
                break;
            case 'date-added':
            default:
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
        }

        return filtered;
    }

    formatDate(dateString) {
        if (!dateString) return null;
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        date.setHours(0, 0, 0, 0);

        if (date.getTime() === today.getTime()) return 'Today';
        if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';
        if (date < today) return 'Overdue';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    isOverdue(dateString) {
        if (!dateString) return false;
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);
        return date < today;
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('progress').textContent = progress + '%';
    }

    render() {
        const tasksList = document.getElementById('tasksList');
        const emptyState = document.getElementById('emptyState');
        const tasks = this.getFilteredAndSortedTasks();

        this.updateStats();

        if (tasks.length === 0) {
            tasksList.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        tasksList.innerHTML = tasks.map(task => this.createTaskElement(task)).join('');

        // Add event listeners to task elements
        tasksList.querySelectorAll('.task-item').forEach((item, index) => {
            const task = tasks[index];
            item.querySelector('.task-checkbox').addEventListener('change', () => this.toggleTask(task.id));
            item.querySelector('.edit-btn').addEventListener('click', () => this.openEditModal(task.id));
            item.querySelector('.delete-btn').addEventListener('click', () => this.deleteTask(task.id));
        });
    }

    createTaskElement(task) {
        const priorityEmoji = { high: '🔴', medium: '🟡', low: '🟢' }[task.priority];
        const formatDate = this.formatDate(task.dueDate);
        const isOverdue = this.isOverdue(task.dueDate);

        return `
            <li class="task-item priority-${task.priority} ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <div class="task-content">
                    <div class="task-header">
                        <span class="task-text">${this.escapeHtml(task.text)}</span>
                        <span class="task-priority">${priorityEmoji} ${task.priority}</span>
                    </div>
                    <div class="task-meta">
                        ${formatDate ? `<div class="due-date ${isOverdue ? 'overdue' : ''}">
                            📅 <span class="date-label">${formatDate}</span>
                        </div>` : ''}
                        <div class="created-date">${this.formatCreatedDate(task.createdAt)}</div>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-btn edit-btn" title="Edit">✏️</button>
                    <button class="task-btn delete-btn" title="Delete">🗑️</button>
                </div>
            </li>
        `;
    }

    formatCreatedDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);

        if (date.getTime() === today.getTime()) return 'Created today';
        return 'Created ' + date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const saved = localStorage.getItem('tasks');
        return saved ? JSON.parse(saved) : [];
    }

    exportTasks() {
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tasks_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    importTasks(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (Array.isArray(imported)) {
                    if (confirm('Import will merge with existing tasks. Continue?')) {
                        this.tasks = [...this.tasks, ...imported];
                        this.saveTasks();
                        this.render();
                        alert('Tasks imported successfully!');
                    }
                } else {
                    alert('Invalid file format');
                }
            } catch (error) {
                alert('Error reading file: ' + error.message);
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    }
}

// Initialize app
const app = new TaskManager();