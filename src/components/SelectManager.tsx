import styled from "styled-components";
import { Button } from "../styles";
import { useTodoStore } from "../store/useTodoStore";

const SelectManager = () => {
  const selectAllTasks = useTodoStore((state) => state.toggleAllTaskSelection);
  const makeCompleteSelected = useTodoStore(
    (state) => state.makeCompleteSelected
  );
  const makeIncompleteSelected = useTodoStore(
    (state) => state.makeIncompleteSelected
  );

  return (
    <ButtonWrapper>
      <Button onClick={selectAllTasks}>Select All</Button>
      <Button margin="0 0 0 5px" onClick={makeCompleteSelected}>
        Make Complete
      </Button>
      <Button margin="0 0 0 5px" onClick={makeIncompleteSelected}>
        Make Incomplete
      </Button>
    </ButtonWrapper>
  );
};

export default SelectManager;
const ButtonWrapper = styled.div`
  margin-top: 10px;
`;
