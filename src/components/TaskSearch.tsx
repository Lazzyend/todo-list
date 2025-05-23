import React, { useMemo } from "react";
import { useTodoStore } from "../store/useTodoStore";
import Task from "./Task";
import styled from "styled-components";
import { Input } from "../styles";

const TaskSearch = () => {
  const searchQuery = useTodoStore((state) => state.searchQuery);
  const setSearchQuery = useTodoStore((state) => state.setSearchQuery);
  const tasks = useTodoStore((state) => state.tasks);
  const moveTask = useTodoStore((state) => state.moveTask);
  const toggleTaskSelection = useTodoStore(
    (state) => state.toggleTaskSelection
  );

  const results = useMemo(
    () =>
      Object.values(tasks).filter((task) =>
        task.text.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery, tasks]
  );

  return (
    <Wrapper>
      <Input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <ul>
          {results.map((task, index) => (
            <li key={task.id} style={{ marginBottom: "6px" }}>
              <Task
                task={task}
                index={index}
                columnId={task.columnId}
                toggleTaskSelection={toggleTaskSelection}
                moveTask={moveTask}
                disableDrag={true}
              />
            </li>
          ))}
        </ul>
      )}
    </Wrapper>
  );
};

export default TaskSearch;

const Wrapper = styled.div`
  width: 100%;

  // Mobile (≤ 767px)
  @media (max-width: 767px) {
    flex-direction: column;
  }
`;
