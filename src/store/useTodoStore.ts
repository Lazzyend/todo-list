import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ColumnType, TaskType } from "../types";

type TodoState = {
  tasks: Record<string, TaskType>;
  columns: ColumnType[];
  addTask: (columnId: string, text: string) => void;
  removeTask: (taskId: string) => void;
  toggleComplete: (taskId: string) => void;
  addColumn: (title: string) => void;
  removeColumn: (columnId: string) => void;
  moveTask: (
    taskId: string,
    toIndex: number,
    fromColumnId: string,
    toColumnId: string
  ) => void;
  moveTaskInColumn: (columnId: string, taskId: string, toIndex: number) => void;
  moveColumn: (dfromIndex: number, toIndex: number) => void;
  editTask: (taskId: string, newText: string) => void;
  editingTaskId: string | null;
  setEditingTaskId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toggleAllTaskSelection: () => void;
  toggleTaskSelection: (taskId: string) => void;
  toggleSelectAllInColumn: (columnId: string) => void;
  makeCompleteSelected: () => void;
  makeIncompleteSelected: () => void;
  filterStatus: "all" | "completed" | "incomplete";
  setFilterStatus: (status: "all" | "completed" | "incomplete") => void;
  moveMultipleTasks: (
    selectedTaskIds: string[],
    fromColumnId: string,
    toColumnId: string,
    toIndex: number
  ) => void;
};

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      tasks: {},
      columns: [],
      filterStatus: "all",
      setFilterStatus: (status) => set({ filterStatus: status }),
      addTask: (columnId, text) =>
        set((state) => {
          const id = crypto.randomUUID();
          const newTask = {
            id,
            text,
            completed: false,
            columnId,
            selected: false,
          };

          return {
            tasks: { ...state.tasks, [id]: newTask },
            columns: state.columns.map((col) =>
              col.id === columnId
                ? { ...col, taskIds: [...col.taskIds, id] }
                : col
            ),
          };
        }),

      removeTask: (taskId) =>
        set((state) => {
          const { [taskId]: _, ...remaining } = state.tasks;
          return {
            tasks: remaining,
            columns: state.columns.map((col) => ({
              ...col,
              taskIds: col.taskIds.filter((id) => id !== taskId),
            })),
          };
        }),

      toggleComplete: (taskId) =>
        set((state) => ({
          tasks: {
            ...state.tasks,
            [taskId]: {
              ...state.tasks[taskId],
              completed: !state.tasks[taskId].completed,
            },
          },
        })),

      addColumn: (title) =>
        set((state) => ({
          columns: [
            ...state.columns,
            { id: crypto.randomUUID(), title, taskIds: [] },
          ],
        })),

      removeColumn: (columnId) =>
        set((state) => {
          const column = state.columns.find((col) => col.id === columnId);
          if (!column) return state;

          const filteredTasks = Object.fromEntries(
            Object.entries(state.tasks).filter(
              ([id]) => !column.taskIds.includes(id)
            )
          );
          const updatedColumns = state.columns.filter(
            (col) => col.id !== columnId
          );

          return {
            tasks: filteredTasks,
            columns: updatedColumns,
          };
        }),

      editTask: (taskId, newText) =>
        set((state) => ({
          tasks: {
            ...state.tasks,
            [taskId]: {
              ...state.tasks[taskId],
              text: newText,
            },
          },
        })),

      moveTaskInColumn: (columnId, taskId, toIndex) =>
        set((state) => {
          const column = state.columns.find((col) => col.id === columnId);
          if (!column) return state;

          const fromIndex = column.taskIds.indexOf(taskId);
          if (fromIndex === -1 || fromIndex === toIndex) return state;

          const updatedTaskIds = [...column.taskIds];
          updatedTaskIds.splice(fromIndex, 1);
          updatedTaskIds.splice(toIndex, 0, taskId);

          return {
            columns: state.columns.map((col) =>
              col.id === columnId ? { ...col, taskIds: updatedTaskIds } : col
            ),
          };
        }),

      moveTask: (taskId, toIndex, fromColumnId, toColumnId) => {
        const state = get();
        const fromColumn = state.columns.find((col) => col.id === fromColumnId);
        const toColumn = state.columns.find((col) => col.id === toColumnId);
        if (!fromColumn || !toColumn) return;

        const updatedColumns = state.columns.map((col) => {
          if (col.id === fromColumnId) {
            return {
              ...col,
              taskIds: col.taskIds.filter((id) => id !== taskId),
            };
          }
          return col;
        });

        const targetColumn = updatedColumns.find(
          (col) => col.id === toColumnId
        );
        if (!targetColumn) return;

        const updatedTaskIds = [...targetColumn.taskIds];
        updatedTaskIds.splice(toIndex, 0, taskId);

        set({
          columns: updatedColumns.map((col) =>
            col.id === toColumnId ? { ...col, taskIds: updatedTaskIds } : col
          ),
        });
      },

      toggleAllTaskSelection: () => {
        const tasks = get().tasks;

        const allSelected = Object.values(tasks).every((task) => task.selected);

        const newTasks = Object.fromEntries(
          Object.entries(tasks).map(([id, task]) => [
            id,
            { ...task, selected: !allSelected },
          ])
        );

        set({ tasks: newTasks });
      },

      toggleTaskSelection: (taskId: string) => {
        const tasks = get().tasks;
        const task = tasks[taskId];
        if (!task) return;
        const updatedTask = { ...task, selected: !task.selected };
        set({ tasks: { ...tasks, [taskId]: updatedTask } });
      },

      makeCompleteSelected: () => {
        const tasks = get().tasks;
        const newTasks = Object.fromEntries(
          Object.entries(tasks).map(([id, task]) => [
            id,
            task.selected ? { ...task, completed: true } : task,
          ])
        );
        set({ tasks: newTasks });
      },

      makeIncompleteSelected: () => {
        const tasks = get().tasks;
        const newTasks = Object.fromEntries(
          Object.entries(tasks).map(([id, task]) => [
            id,
            task.selected ? { ...task, completed: false } : task,
          ])
        );
        set({ tasks: newTasks });
      },
      moveColumn: (fromIndex, toIndex) => {
        set((state) => {
          const updated = [...state.columns];
          const [moved] = updated.splice(fromIndex, 1);
          updated.splice(toIndex, 0, moved);
          return { columns: updated };
        });
      },
      toggleSelectAllInColumn: (columnId: string) => {
        const tasks = get().tasks;
        const columns = get().columns;
        const column = columns.find((col) => col.id === columnId);
        if (!column) return;

        const allSelected = column.taskIds.every(
          (taskId) => tasks[taskId]?.selected
        );

        const newTasks = { ...tasks };
        column.taskIds.forEach((taskId) => {
          if (newTasks[taskId]) {
            newTasks[taskId] = { ...newTasks[taskId], selected: !allSelected };
          }
        });

        set({ tasks: newTasks });
      },
      moveMultipleTasks: (selectedTaskIds, fromColumnId, toColumnId, toIndex) =>
        set((state) => {
          const fromCol = state.columns.find((col) => col.id === fromColumnId);
          const toCol = state.columns.find((col) => col.id === toColumnId);
          if (!fromCol || !toCol) return state;

          const newFromIds = fromCol.taskIds.filter(
            (id) => !selectedTaskIds.includes(id)
          );

          const existingInTarget = new Set(toCol.taskIds);
          const filteredIds = selectedTaskIds.filter(
            (id) => !existingInTarget.has(id)
          );

          const newToIds = [...toCol.taskIds];
          newToIds.splice(toIndex, 0, ...filteredIds);

          const updatedTasks = { ...state.tasks };
          selectedTaskIds.forEach((id) => {
            if (updatedTasks[id]) {
              updatedTasks[id] = {
                ...updatedTasks[id],
                columnId: toColumnId,
              };
            }
          });

          return {
            columns: state.columns.map((col) => {
              if (col.id === fromColumnId)
                return { ...col, taskIds: newFromIds };
              if (col.id === toColumnId) return { ...col, taskIds: newToIds };
              return col;
            }),
            tasks: updatedTasks,
          };
        }),

      setEditingTaskId: (id) => set({ editingTaskId: id }),
      editingTaskId: null,
      searchQuery: "",
      setSearchQuery: (q) => set({ searchQuery: q }),
    }),

    { name: "todo-storage" }
  )
);
