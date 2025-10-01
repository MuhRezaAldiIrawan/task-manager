<template>
    <div class="tasks-container">
        <header class="header">
            <div class="header-content">
                <h1>Task Manager</h1>
                <div class="user-info">
                    <span>Welcome, {{ user?.name }}</span>
                    <button @click="handleLogout" class="btn-logout">Logout</button>
                </div>
            </div>
        </header>

        <main class="main-content">
            <div class="controls-section">
                <button @click="openCreateModal" class="btn-primary">+ Create Task</button>

                <div class="filters">
                    <input v-model="searchQuery" type="text" placeholder="Search tasks..." class="search-input"
                        @input="debouncedSearch" />

                    <select v-model="filterStatus" @change="fetchTasks" class="filter-select">
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>

                    <select v-model="filterPriority" @change="fetchTasks" class="filter-select">
                        <option value="">All Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>

                    <select v-model="sortBy" @change="fetchTasks" class="filter-select">
                        <option value="createdAt">Created Date</option>
                        <option value="updatedAt">Updated Date</option>
                        <option value="dueDate">Due Date</option>
                        <option value="priority">Priority</option>
                    </select>

                    <select v-model="sortOrder" @change="fetchTasks" class="filter-select">
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                </div>
            </div>

            <div v-if="loading" class="loading">Loading tasks...</div>

            <div v-else-if="tasks.length === 0" class="empty-state">
                <p>No tasks found. Create your first task!</p>
            </div>

            <div v-else class="tasks-grid">
                <div v-for="task in tasks" :key="task.id" class="task-card" :class="`priority-${task.priority}`">
                    <div class="task-header">
                        <h3>{{ task.title }}</h3>
                        <div class="task-badges">
                            <span class="badge" :class="`badge-${task.status}`">
                                {{ task.status }}
                            </span>
                            <span class="badge" :class="`badge-priority-${task.priority}`">
                                {{ task.priority }}
                            </span>
                        </div>
                    </div>

                    <p class="task-description">{{ task.description || "No description" }}</p>

                    <div class="task-meta">
                        <span v-if="task.dueDate" class="meta-item"> 📅 {{ formatDate(task.dueDate) }} </span>
                        <span class="meta-item"> 🕒 {{ formatDate(task.updatedAt) }} </span>
                    </div>

                    <div class="task-actions">
                        <button @click="openEditModal(task)" class="btn-edit">Edit</button>
                        <button @click="confirmDelete(task)" class="btn-delete">Delete</button>
                    </div>
                </div>
            </div>

            <div v-if="meta && meta.totalPages > 1" class="pagination">
                <button @click="changePage(meta.page - 1)" :disabled="!meta.hasPrevPage"
                    class="btn-page">Previous</button>
                <span class="page-info"> Page {{ meta.page }} of {{ meta.totalPages }} </span>
                <button @click="changePage(meta.page + 1)" :disabled="!meta.hasNextPage" class="btn-page">Next</button>
            </div>
        </main>

        <!-- Create/Edit Modal -->
        <div v-if="showModal" class="modal-overlay" @click="closeModal">
            <div class="modal-content" @click.stop>
                <h2>{{ editingTask ? "Edit Task" : "Create New Task" }}</h2>

                <form @submit.prevent="handleSubmit" class="task-form">
                    <div v-if="formError" class="error-message">{{ formError }}</div>

                    <div class="form-group">
                        <label>Title *</label>
                        <input v-model="formData.title" type="text" placeholder="Enter task title" required />
                    </div>

                    <div class="form-group">
                        <label>Description</label>
                        <textarea v-model="formData.description" placeholder="Enter task description"
                            rows="4"></textarea>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Status *</label>
                            <select v-model="formData.status" required>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Priority *</label>
                            <select v-model="formData.priority" required>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Due Date</label>
                        <input v-model="formData.dueDate" type="date" />
                    </div>

                    <div class="modal-actions">
                        <button type="button" @click="closeModal" class="btn-cancel">Cancel</button>
                        <button type="submit" class="btn-submit" :disabled="submitting">
                            {{ submitting ? "Saving..." : "Save Task" }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
            <div class="modal-content modal-small" @click.stop>
                <h2>Delete Task</h2>
                <p>Are you sure you want to delete "{{ taskToDelete?.title }}"?</p>
                <div class="modal-actions">
                    <button @click="closeDeleteModal" class="btn-cancel">Cancel</button>
                    <button @click="handleDelete" class="btn-delete" :disabled="deleting">
                        {{ deleting ? "Deleting..." : "Delete" }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { getTasks, createTask, updateTask, deleteTask } from "../services/api";

export default {
    name: "TasksPage",
    setup() {
        const router = useRouter();
        const tasks = ref([]);
        const meta = ref(null);
        const loading = ref(false);
        const showModal = ref(false);
        const showDeleteModal = ref(false);
        const editingTask = ref(null);
        const taskToDelete = ref(null);
        const formError = ref("");
        const submitting = ref(false);
        const deleting = ref(false);

        const searchQuery = ref("");
        const filterStatus = ref("");
        const filterPriority = ref("");
        const sortBy = ref("createdAt");
        const sortOrder = ref("desc");
        const currentPage = ref(1);

        const user = computed(() => {
            const userStr = localStorage.getItem("user");
            return userStr ? JSON.parse(userStr) : null;
        });

        const formData = reactive({
            title: "",
            description: "",
            status: "pending",
            priority: "medium",
            dueDate: "",
        });

        const fetchTasks = async () => {
            loading.value = true;
            try {
                const params = {
                    page: currentPage.value,
                    limit: 9,
                    search: searchQuery.value,
                    status: filterStatus.value,
                    priority: filterPriority.value,
                    sortBy: sortBy.value,
                    sortOrder: sortOrder.value,
                };

                const response = await getTasks(params);
                if (response.success) {
                    tasks.value = response.data;
                    meta.value = response.meta;
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                loading.value = false;
            }
        };

        let searchTimeout;
        const debouncedSearch = () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentPage.value = 1;
                fetchTasks();
            }, 500);
        };

        const changePage = (page) => {
            currentPage.value = page;
            fetchTasks();
        };

        const openCreateModal = () => {
            editingTask.value = null;
            formData.title = "";
            formData.description = "";
            formData.status = "pending";
            formData.priority = "medium";
            formData.dueDate = "";
            formError.value = "";
            showModal.value = true;
        };

        const openEditModal = (task) => {
            editingTask.value = task;
            formData.title = task.title;
            formData.description = task.description;
            formData.status = task.status;
            formData.priority = task.priority;
            formData.dueDate = task.dueDate ? task.dueDate.split("T")[0] : "";
            formError.value = "";
            showModal.value = true;
        };

        const closeModal = () => {
            showModal.value = false;
            editingTask.value = null;
        };

        const handleSubmit = async () => {
            formError.value = "";
            submitting.value = true;

            try {
                const taskData = {
                    title: formData.title,
                    description: formData.description,
                    status: formData.status,
                    priority: formData.priority,
                    dueDate: formData.dueDate || null,
                };

                let response;
                if (editingTask.value) {
                    response = await updateTask(editingTask.value.id, taskData);
                } else {
                    response = await createTask(taskData);
                }

                if (response.success) {
                    closeModal();
                    fetchTasks();
                } else {
                    formError.value = response.message || "Operation failed";
                }
            } catch (error) {
                formError.value = error.message || "An error occurred";
            } finally {
                submitting.value = false;
            }
        };

        const confirmDelete = (task) => {
            taskToDelete.value = task;
            showDeleteModal.value = true;
        };

        const closeDeleteModal = () => {
            showDeleteModal.value = false;
            taskToDelete.value = null;
        };

        const handleDelete = async () => {
            if (!taskToDelete.value) return;

            deleting.value = true;
            try {
                const response = await deleteTask(taskToDelete.value.id);
                if (response.success) {
                    closeDeleteModal();
                    fetchTasks();
                }
            } catch (error) {
                console.error("Error deleting task:", error);
            } finally {
                deleting.value = false;
            }
        };

        const handleLogout = () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/login");
        };

        const formatDate = (dateString) => {
            if (!dateString) return "";
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        };

        onMounted(() => {
            fetchTasks();
        });

        return {
            tasks,
            meta,
            loading,
            showModal,
            showDeleteModal,
            editingTask,
            taskToDelete,
            formError,
            submitting,
            deleting,
            searchQuery,
            filterStatus,
            filterPriority,
            sortBy,
            sortOrder,
            user,
            formData,
            fetchTasks,
            debouncedSearch,
            changePage,
            openCreateModal,
            openEditModal,
            closeModal,
            handleSubmit,
            confirmDelete,
            closeDeleteModal,
            handleDelete,
            handleLogout,
            formatDate,
        };
    },
};
</script>

<style scoped>
.tasks-container {
    min-height: 100vh;
    background: #f5f7fa;
}

.header {
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    padding: 20px 0;
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header h1 {
    font-size: 24px;
    color: #1a202c;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 16px;
}

.user-info span {
    color: #4a5568;
    font-size: 14px;
}

.btn-logout {
    padding: 8px 16px;
    background: #fc8181;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: background 0.2s;
}

.btn-logout:hover {
    background: #f56565;
}

.main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 20px;
}

.controls-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 32px;
}

.btn-primary {
    padding: 12px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    align-self: flex-start;
    transition: transform 0.2s;
}

.btn-primary:hover {
    transform: translateY(-2px);
}

.filters {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.search-input,
.filter-select {
    padding: 10px 14px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    background: white;
}

.search-input {
    flex: 1;
    min-width: 200px;
}

.filter-select {
    min-width: 140px;
}

.loading,
.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #718096;
    font-size: 16px;
}

.tasks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
}

.task-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s, box-shadow 0.2s;
    border-left: 4px solid #cbd5e0;
}

.task-card.priority-high {
    border-left-color: #fc8181;
}

.task-card.priority-medium {
    border-left-color: #f6ad55;
}

.task-card.priority-low {
    border-left-color: #68d391;
}

.task-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.task-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
    gap: 12px;
}

.task-header h3 {
    font-size: 18px;
    color: #1a202c;
    margin: 0;
    flex: 1;
}

.task-badges {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: flex-end;
}

.badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.badge-pending {
    background: #fed7d7;
    color: #c53030;
}

.badge-in-progress {
    background: #bee3f8;
    color: #2c5282;
}

.badge-completed {
    background: #c6f6d5;
    color: #22543d;
}

.badge-priority-high {
    background: #fc8181;
    color: white;
}

.badge-priority-medium {
    background: #f6ad55;
    color: white;
}

.badge-priority-low {
    background: #68d391;
    color: white;
}

.task-description {
    color: #4a5568;
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 16px;
}

.task-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 16px;
    padding-top: 16px;
    border-top: 1px solid #e2e8f0;
}

.meta-item {
    font-size: 13px;
    color: #718096;
}

.task-actions {
    display: flex;
    gap: 8px;
}

.btn-edit,
.btn-delete {
    flex: 1;
    padding: 8px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: opacity 0.2s;
}

.btn-edit {
    background: #90cdf4;
    color: #1a365d;
}

.btn-delete {
    background: #fc8181;
    color: white;
}

.btn-edit:hover,
.btn-delete:hover {
    opacity: 0.8;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 40px;
}

.btn-page {
    padding: 8px 16px;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
}

.btn-page:hover:not(:disabled) {
    border-color: #667eea;
    color: #667eea;
}

.btn-page:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-info {
    color: #4a5568;
    font-size: 14px;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20px;
}

.modal-content {
    background: white;
    border-radius: 16px;
    padding: 32px;
    width: 100%;
    max-width: 540px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-small {
    max-width: 400px;
}

.modal-content h2 {
    margin-bottom: 24px;
    color: #1a202c;
}

.task-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.error-message {
    background: #fed7d7;
    color: #c53030;
    padding: 12px;
    border-radius: 8px;
    font-size: 14px;
    text-align: center;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-size: 14px;
    font-weight: 600;
    color: #2d3748;
}

.form-group input,
.form-group select,
.form-group textarea {
    padding: 10px 14px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #667eea;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.modal-actions {
    display: flex;
    gap: 12px;
    margin-top: 8px;
}

.btn-cancel,
.btn-submit {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: opacity 0.2s;
}

.btn-cancel {
    background: #e2e8f0;
    color: #2d3748;
}

.btn-submit {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.btn-cancel:hover,
.btn-submit:hover:not(:disabled) {
    opacity: 0.9;
}

.btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

@media (max-width: 768px) {
    .tasks-grid {
        grid-template-columns: 1fr;
    }

    .filters {
        flex-direction: column;
    }

    .filter-select,
    .search-input {
        width: 100%;
    }

    .form-row {
        grid-template-columns: 1fr;
    }
}
</style>
