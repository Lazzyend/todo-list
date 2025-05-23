import styled from "styled-components";
import { Button } from "../styles";
import { useTodoStore } from "../store/useTodoStore";

const FilterManager = () => {
  const setFilterStatus = useTodoStore((state) => state.setFilterStatus);

  return (
    <ButtonWrapper>
      <Button onClick={() => setFilterStatus("completed")}>
        Filter by Complete
      </Button>
      <Button margin="0 0 0 5px" onClick={() => setFilterStatus("incomplete")}>
        Filter by Incomplete
      </Button>
      <Button margin="0 0 0 5px" onClick={() => setFilterStatus("all")}>
        Reset Filters
      </Button>
    </ButtonWrapper>
  );
};

export default FilterManager;

const ButtonWrapper = styled.div`
  margin-top: 10px;
`;
