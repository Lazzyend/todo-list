import React, { useState } from "react";
import { useTodoStore } from "../store/useTodoStore";
import { Button, Input } from "../styles";

const ColumnManager = () => {
  const addColumn = useTodoStore((state) => state.addColumn);
  const [title, setTitle] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (title.trim()) addColumn(title);
        setTitle("");
      }}
    >
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New column title"
      />
      <Button margin="0 0 0 5px" type="submit">
        Add Column
      </Button>
    </form>
  );
};

export default ColumnManager;
