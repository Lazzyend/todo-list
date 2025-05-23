import React, { useRef, useState } from "react";
import { ColumnType, TaskType } from "../types";
import { useTodoStore } from "../store/useTodoStore";
import Task from "./Task";
import styled from "styled-components";
import { useDrag, useDrop } from "react-dnd";
import { Button, Input } from "../styles";

export const ItemTypes = {
  TASK: "TASK",
  COLUMN: "COLUMN",
};

type DragItem = {
  id: string;
  index: number;
  type: string;
};
type ColumnProps = {
  column: ColumnType;
  index: number;
  toggleTaskSelection: (taskId: string) => void;
};
const Column = ({ column, index, toggleTaskSelection }: ColumnProps) => {
  const { tasks, addTask, removeColumn, moveColumn } = useTodoStore();

  const toggleSelectAllInColumn = useTodoStore(
    (state) => state.toggleSelectAllInColumn
  );

  const filterStatus = useTodoStore((state) => state.filterStatus);

  const filteredTaskIds = column.taskIds.filter((taskId) => {
    const task = tasks[taskId];
    if (!task) return false;

    if (filterStatus === "completed") return task.completed;
    if (filterStatus === "incomplete") return !task.completed;
    return true;
  });

  const [text, setText] = useState("");

  const editingTaskId = useTodoStore((state) => state.editingTaskId);
  const canDrag = !editingTaskId;

  const columnTasks: TaskType[] = filteredTaskIds
    .map((id) => tasks[id])
    .filter((t): t is TaskType => t !== undefined);

  const ref = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const [, dropColumn] = useDrop<DragItem>({
    accept: ItemTypes.COLUMN,
    hover(item, monitor) {
      if (!ref.current || item.id === column.id) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveColumn(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [, dropTask] = useDrop<DragItem & { selectedIds: string[] }>({
    accept: ItemTypes.TASK,
    drop(item, monitor) {
      if (monitor.didDrop()) return;

      const idsToMove = item.selectedIds ?? [item.id];
      const toColId = column.id;
      const state = useTodoStore.getState();
      const allTasks = state.tasks;

      const grouped: Record<string, string[]> = {};
      idsToMove.forEach((id) => {
        const t = allTasks[id];
        if (t.columnId === toColId) return;
        (grouped[t.columnId] ??= []).push(id);
      });

      Object.entries(grouped).forEach(([fromColId, batchIds]) => {
        state.moveMultipleTasks(
          batchIds,
          fromColId,
          toColId,
          column.taskIds.length
        );
      });

      return { handled: true };
    },
  });

  const [, dragColumn] = useDrag({
    type: ItemTypes.COLUMN,
    canDrag,
    item: { id: column.id, index },
  });

  dragColumn(dropColumn(ref));

  const setBodyRef = (node: HTMLDivElement | null) => {
    if (node) {
      bodyRef.current = node;
      dropTask(node);
    }
  };

  const headerRef = useRef<HTMLDivElement>(null);
  dragColumn(headerRef);

  return (
    <Wrapper ref={ref}>
      <Header ref={headerRef}>
        <HeaderText>{column.title}</HeaderText>
        <Button onClick={() => removeColumn(column.id)}>Delete Column</Button>
      </Header>
      <CreateBlock>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            if (text.trim()) {
              addTask(column.id, text);
              setText("");
            }
          }}
        >
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="New task"
          />
          <div>
            <Button type="submit">Add Task</Button>
            <Button
              type="button"
              margin="0 0 0 5px"
              onClick={() => toggleSelectAllInColumn(column.id)}
            >
              Select All
            </Button>
          </div>
        </Form>
      </CreateBlock>
      <Body ref={setBodyRef}>
        {columnTasks.map((task: TaskType, taskIndex: number) => (
          <Task
            key={task.id}
            task={task}
            index={taskIndex}
            columnId={column.id}
            moveTask={(taskId, toIndex, fromColId, toColId) =>
              useTodoStore
                .getState()
                .moveTask(taskId, toIndex, fromColId, toColId)
            }
            toggleTaskSelection={toggleTaskSelection}
          />
        ))}
      </Body>
    </Wrapper>
  );
};

export default Column;

const Wrapper = styled.div`
  background-color: #7c8c97;
  margin: 40px;
  width: 25%;
  min-width: 300px;
  min-height: 250px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }

  // Desktop (≥ 1024px)
  @media (min-width: 1024px) {
    width: 23%;
  }

  // Tablet (768px - 1023px)
  @media (max-width: 1023px) and (min-width: 768px) {
    width: 48%;
    margin: 20px;
  }

  // Mobile (≤ 767px)
  @media (max-width: 767px) {
    width: 100%;
    margin: 10px 0;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px 10px 0 0;
  padding: 10px;
  cursor: grab;
  border-bottom: 2px solid #425058;
  background-color: #6a7b85;
  color: #fff;
`;

const HeaderText = styled.div`
  font-size: 20px;
  padding: 10px;
  font-weight: 600;
`;

const CreateBlock = styled.div`
  padding: 7px;
  background-color: #6f808a;
  border-radius: 6px;
`;

const Body = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  padding: 10px;
  overflow-y: auto;
`;

const Form = styled.form`
  display: flex;
  gap: 10px;
  justify-content: space-between;
  flex-wrap: wrap;
`;
