import { create } from 'zustand';
import { Column, Task } from '@/types/kanban';
import { arrayMove } from '@dnd-kit/sortable';
import * as tasksApi from '@/lib/api/tasks';
import * as projectsApi from '@/lib/api/projects';

interface BoardState {
    columns: Column[];
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    currentProjectId: string | null;

    // Setters
    setColumns: (columns: Column[]) => void;
    setTasks: (tasks: Task[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // Fetch from API
    fetchProject: (projectId: string) => Promise<void>;

    // Column operations
    moveColumn: (activeId: string, overId: string) => void;
    addColumn: (column: Column) => void;

    // Task operations
    moveTask: (activeId: string, overId: string) => void;
    moveTaskToColumn: (taskId: string, columnId: string, order?: number) => Promise<void>;
    addTask: (task: Omit<Task, 'id'>) => Promise<Task | null>;
    updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
}

// Initial empty state (no mock data)
const initialState = {
    columns: [],
    tasks: [],
    isLoading: false,
    error: null,
    currentProjectId: null,
};

export const useBoardStore = create<BoardState>((set, get) => ({
    ...initialState,

    setColumns: (columns) => set({ columns }),
    setTasks: (tasks) => set({ tasks }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    // Fetch project data from API
    fetchProject: async (projectId: string) => {
        set({ isLoading: true, error: null, currentProjectId: projectId });

        try {
            const project = await projectsApi.getProject(projectId);

            // Transform API data to match frontend types
            const columns: Column[] = project.columns.map(col => ({
                id: col.id,
                title: col.title
            }));

            const tasks: Task[] = project.tasks.map(task => ({
                id: task.id,
                columnId: task.column_id,
                content: task.content,
                priority: task.priority as 'Low' | 'Medium' | 'High',
                assignee: task.assignee_name || undefined,
                dueDate: task.due_date ? new Date(task.due_date) : undefined
            }));

            set({ columns, tasks, isLoading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to fetch project', isLoading: false });
        }
    },

    moveColumn: (activeId, overId) =>
        set((state) => {
            const activeIndex = state.columns.findIndex((col) => col.id === activeId);
            const overIndex = state.columns.findIndex((col) => col.id === overId);
            return { columns: arrayMove(state.columns, activeIndex, overIndex) };
        }),

    moveTask: (activeId, overId) =>
        set((state) => {
            const activeIndex = state.tasks.findIndex((t) => t.id === activeId);
            const overIndex = state.tasks.findIndex((t) => t.id === overId);
            return { tasks: arrayMove(state.tasks, activeIndex, overIndex) };
        }),

    // Move task to different column (with API call)
    moveTaskToColumn: async (taskId: string, columnId: string, order?: number) => {
        const { tasks } = get();
        const taskIndex = tasks.findIndex(t => t.id === taskId);

        if (taskIndex === -1) return;

        // Optimistic update
        const updatedTasks = [...tasks];
        updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], columnId };
        set({ tasks: updatedTasks });

        try {
            await tasksApi.moveTask(taskId, { column_id: columnId, order });
        } catch (error) {
            // Revert on error
            set({ tasks, error: error instanceof Error ? error.message : 'Failed to move task' });
        }
    },

    addTask: async (taskData) => {
        set({ isLoading: true });

        try {
            const newTask = await tasksApi.createTask({
                content: taskData.content,
                priority: taskData.priority,
                column_id: taskData.columnId.toString(),
                assignee_id: undefined,
                due_date: taskData.dueDate?.toISOString()
            });

            const task: Task = {
                id: newTask.id,
                columnId: newTask.column_id,
                content: newTask.content,
                priority: newTask.priority as 'Low' | 'Medium' | 'High',
                assignee: newTask.assignee_name || undefined,
                dueDate: newTask.due_date ? new Date(newTask.due_date) : undefined
            };

            set((state) => ({ tasks: [...state.tasks, task], isLoading: false }));
            return task;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to create task', isLoading: false });
            return null;
        }
    },

    updateTask: async (taskId: string, updates: Partial<Task>) => {
        const { tasks } = get();

        // Optimistic update
        set({
            tasks: tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
        });

        try {
            await tasksApi.updateTask(taskId, {
                content: updates.content,
                priority: updates.priority,
                due_date: updates.dueDate?.toISOString()
            });
        } catch (error) {
            // Revert on error
            set({ tasks, error: error instanceof Error ? error.message : 'Failed to update task' });
        }
    },

    deleteTask: async (taskId: string) => {
        const { tasks } = get();

        // Optimistic update
        set({ tasks: tasks.filter((t) => t.id !== taskId) });

        try {
            await tasksApi.deleteTask(taskId);
        } catch (error) {
            // Revert on error
            set({ tasks, error: error instanceof Error ? error.message : 'Failed to delete task' });
        }
    },

    addColumn: (column) => set((state) => ({ columns: [...state.columns, column] })),
}));
