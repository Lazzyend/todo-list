import React, { useEffect, useRef } from "react";
import { useTodoStore } from "./store/useTodoStore";
import Column from "./components/Column";
import TaskSearch from "./components/TaskSearch";
import ColumnManager from "./components/ColumnManager";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import styled from "styled-components";
import SelectManager from "./components/SelectManager";
import FilterManager from "./components/FilterManager";

const App = () => {
  const columns = useTodoStore((state) => state.columns);
  const moveTask = useTodoStore((state) => state.moveTask);

  const toggleTaskSelection = useTodoStore(
    (state) => state.toggleTaskSelection
  );

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
  }, [moveTask]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Wrapper>
        <h1>Todo List</h1>
        <TaskSearch />
        <ColumnManager />
        <FilterAndSelectWrapper>
          <SelectManager />
          <FilterManager />
        </FilterAndSelectWrapper>
        <ColumnWrapper ref={containerRef} className="flex gap-4 overflow-auto">
          {columns.map((col, index) => (
            <Column
              key={col.id}
              column={col}
              index={index}
              toggleTaskSelection={toggleTaskSelection}
            />
          ))}
        </ColumnWrapper>
      </Wrapper>
    </DndProvider>
  );
};

export default App;

const ColumnWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;

  // Mobile (≤ 767px)
  @media (max-width: 767px) {
    flex-direction: column;
  }
`;

const Wrapper = styled.div`
  margin-left: 20px;
  padding: 5px;
  user-select: none;
  -webkit-user-select: none;

  // Mobile (≤ 767px)
  @media (max-width: 767px) {
    margin-left: 10px;
    margin-right: 10px;
    padding: 0;
  }
`;

const FilterAndSelectWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-bottom: 16px;
  border-bottom: 2px solid gray;
  // Mobile (≤ 767px)
  @media (max-width: 767px) {
    flex-direction: column;
    gap: 10px;
  }
`;
