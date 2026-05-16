document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Elements
    const taskList = document.getElementById('taskList');
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const searchInput = document.getElementById('searchInput');
    const themeToggle = document.getElementById('themeToggle');
    const emptyState = document.getElementById('emptyState');
    const pendingCount = document.getElementById('pendingCount');
    const totalTasksEl = document.getElementById('totalTasks');
    const completedTasksEl = document.getElementById('completedTasks');
    const completionRateEl = document.getElementById('completionRate');
    const deleteModal = document.getElementById('deleteModal');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    const filterPills = document.querySelectorAll('.pill');
    const navItems = document.querySelectorAll('.nav-item');

    let currentFilter = 'all';
    let currentSearch = '';
    let taskToDelete = null;

    // API Base URL
    const API_URL = '/api/tasks';

    // --- State Management ---

    async function fetchTasks() {
        showLoading();
        try {
            const response = await fetch(`${API_URL}?status=${currentFilter}&search=${currentSearch}`);
            const tasks = await response.json();
            renderTasks(tasks);
            updateStats();
        } catch (error) {
            showToast('Error fetching tasks', 'error');
            console.error(error);
        }
    }

    async function updateStats() {
        try {
            const response = await fetch('/api/stats');
            const stats = await response.json();
            
            pendingCount.textContent = stats.pending;
            totalTasksEl.textContent = stats.total;
            completedTasksEl.textContent = stats.completed;
            
            const rate = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);
            completionRateEl.textContent = `${rate}%`;
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    }

    async function addTask() {
        const content = taskInput.value.trim();
        if (!content) return;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });
            
            if (response.ok) {
                taskInput.value = '';
                showToast('Task added to pipeline', 'success');
                fetchTasks();
            }
        } catch (error) {
            showToast('Failed to add task', 'error');
        }
    }

    async function toggleTask(id, completed) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !completed })
            });
            fetchTasks();
        } catch (error) {
            showToast('Update failed', 'error');
        }
    }

    async function deleteTask() {
        if (!taskToDelete) return;
        try {
            await fetch(`${API_URL}/${taskToDelete}`, { method: 'DELETE' });
            closeDeleteModal();
            showToast('Task removed', 'success');
            fetchTasks();
        } catch (error) {
            showToast('Delete failed', 'error');
        }
    }

    // --- UI Rendering ---

    function renderTasks(tasks) {
        taskList.innerHTML = '';
        
        if (tasks.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        
        tasks.forEach(task => {
            const item = document.createElement('div');
            item.className = `task-item ${task.completed ? 'completed' : ''}`;
            item.innerHTML = `
                <div class="task-checkbox" onclick="event.stopPropagation();"></div>
                <div class="task-content">
                    <div class="task-text">${task.content}</div>
                    <div class="task-meta">${task.created_at} • ${task.category}</div>
                </div>
                <div class="task-actions-btns">
                    <button class="btn-icon delete" title="Delete Task">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            `;

            // Toggle functionality
            item.querySelector('.task-checkbox').addEventListener('click', () => {
                toggleTask(task.id, task.completed);
            });

            // Delete functionality
            item.querySelector('.delete').addEventListener('click', (e) => {
                e.stopPropagation();
                openDeleteModal(task.id);
            });

            taskList.appendChild(item);
        });
        
        lucide.createIcons();
    }

    function showLoading() {
        taskList.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Syncing database...</p>
            </div>
        `;
        emptyState.classList.add('hidden');
    }

    // --- Modals & Toasts ---

    function openDeleteModal(id) {
        taskToDelete = id;
        deleteModal.classList.remove('hidden');
    }

    function closeDeleteModal() {
        taskToDelete = null;
        deleteModal.classList.add('hidden');
    }

    function showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'check-circle',
            error: 'x-circle',
            info: 'info'
        };

        toast.innerHTML = `
            <i data-lucide="${icons[type] || 'info'}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        lucide.createIcons();

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // --- Event Listeners ---

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        fetchTasks();
    });

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentFilter = pill.dataset.status;
            fetchTasks();
        });
    });

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            currentFilter = item.dataset.filter;
            
            // Sync pill UI
            filterPills.forEach(p => {
                p.classList.toggle('active', p.dataset.status === currentFilter);
            });
            
            fetchTasks();
        });
    });

    confirmDeleteBtn.addEventListener('click', deleteTask);
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Check saved theme
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    }

    // Initial Load
    fetchTasks();
});
