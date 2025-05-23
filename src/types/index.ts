export type TaskType = {
  id: string;
  text: string;
  completed: boolean;
  columnId: string;
  selected: boolean;
};

export type ColumnType = {
  id: string;
  title: string;
  taskIds: string[];
};
