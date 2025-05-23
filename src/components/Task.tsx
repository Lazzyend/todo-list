import React, { useMemo, useState } from "react";
import { TaskType } from "../types";
import { useTodoStore } from "../store/useTodoStore";
import styled from "styled-components";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./Column";
import { Button, Input } from "../styles";

type TaskProps = {
  task: TaskType;
  index: number;
  columnId: string;
  disableDrag?: boolean;
  selected?: boolean;
  moveTask: (
    taskId: string,
    toIndex: number,
    fromColumnId: string,
    toColumnId: string
  ) => void;
  toggleTaskSelection?: (taskId: string) => void;
};
type DragItem = {
  id: string;
  index: number;
  columnId: string;
  type: string;
  selectedIds: string[];
};

const Task = ({
  task,
  index,
  moveTask,
  columnId,
  disableDrag,
  toggleTaskSelection,
}: TaskProps) => {
  const { removeTask, editTask } = useTodoStore();

  const tasks = useTodoStore((state) => state.tasks);
  const selectedTaskIds = useMemo(() => {
    return Object.values(tasks)
      .filter((task) => task.selected)
      .map((task) => task.id);
  }, [tasks]);

  const [editText, setEditText] = useState(task.text);

  const ref = React.useRef<HTMLDivElement>(null);

  const editingTaskId = useTodoStore((state) => state.editingTaskId);

  const isEditing = editingTaskId === task.id;
  const setEditingTaskId = useTodoStore((state) => state.setEditingTaskId);

  const startEdit = () => setEditingTaskId(task.id);
  const finishEdit = () => setEditingTaskId(null);

  const searchQuery = useTodoStore((state) => state.searchQuery);

  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight) return text;

    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={i} style={{ backgroundColor: "yellow" }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const [, drop] = useDrop<DragItem>({
    accept: ItemTypes.TASK,

    hover(item, monitor) {
      if (item.selectedIds?.length > 1) return;
      if (!ref.current || item.id === task.id) return;

      const hoverIndex = index;
      const dragIndex = item.index;
      const dragColumnId = item.columnId;
      if (dragIndex === hoverIndex && dragColumnId === columnId) return;

      moveTask(item.id, hoverIndex, dragColumnId, columnId);
      item.index = hoverIndex;
      item.columnId = columnId;
    },

    drop(item, monitor) {
      if (monitor.didDrop()) return;
      const idsToMove = item.selectedIds ?? [item.id];
      if (idsToMove.length <= 1) return;

      const toColId = columnId;
      const state = useTodoStore.getState();
      const allTasks = state.tasks;

      const grouped: Record<string, string[]> = {};
      idsToMove.forEach((id) => {
        const t = allTasks[id];
        if (t.columnId === toColId) return;
        (grouped[t.columnId] ??= []).push(id);
      });

      Object.entries(grouped).forEach(([fromColId, batchIds]) => {
        state.moveMultipleTasks(batchIds, fromColId, toColId, index);
      });

      return { handled: true };
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: {
      id: task.id,
      index,
      columnId,
      selectedIds: selectedTaskIds.includes(task.id)
        ? selectedTaskIds
        : [task.id],
    },

    canDrag: !isEditing,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const handleSave = () => {
    editTask(task.id, editText.trim());
    finishEdit();
  };

  return (
    <Wrapper
      ref={disableDrag ? null : ref}
      isDragging={isDragging}
      isEditing={isEditing}
      onClick={(e) => {
        e.stopPropagation();
        toggleTaskSelection?.(task.id);
      }}
      selected={selectedTaskIds.includes(task.id)}
      completed={task.completed}
      title="Click to toggle select"
    >
      {isEditing ? (
        <Input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSave();
            }
            if (e.key === "Escape") {
              setEditText(task.text);
              finishEdit();
            }
          }}
          autoFocus
        />
      ) : (
        <div>{getHighlightedText(task.text, searchQuery)}</div>
      )}

      <div>
        {isEditing ? (
          <Button onClick={handleSave} disabled={editText.trim() === ""}>
            Save
          </Button>
        ) : (
          <Button onClick={startEdit}>Edit</Button>
        )}
        <Button margin="0 0 0 5px" onClick={() => removeTask(task.id)}>
          Delete
        </Button>
      </div>
    </Wrapper>
  );
};

export default Task;

const Wrapper = styled.div<{
  selected?: boolean;
  completed?: boolean;
  isDragging?: boolean;
  disableDrag?: boolean;
  isEditing?: boolean;
}>`
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 6px;
  cursor: ${({ disableDrag, isEditing }) =>
    disableDrag || isEditing ? "pointer" : "grab"};
  opacity: ${({ selected }) => (selected ? 0.8 : 1)};

  border: ${({ selected }) => (selected ? "2px dashed #fff" : "none")};
  background-color: ${({ selected, completed }) =>
    selected ? "#8dd0fd" : completed ? "#d4edda" : "#f8d7da"};
  color: ${({ completed }) => (completed ? "green" : "red")};
  user-select: none;
  transition: background-color 0.3s, border-color 0.3s;

  // Mobile (≤ 767px)
  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    max-width: 280px;
  }
`;
