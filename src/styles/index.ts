import styled from "styled-components";

export const Button = styled.button<{ margin?: string }>`
  background-color: #fafbfc;
  border: 1px solid rgba(27, 31, 35, 0.15);
  border-radius: 6px;
  box-shadow: rgba(27, 31, 35, 0.04) 0 1px 0,
    rgba(255, 255, 255, 0.25) 0 1px 0 inset;
  box-sizing: border-box;
  color: #24292e;
  cursor: pointer;
  display: inline-block;
  font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  padding: 4px 8px;
  margin: ${({ margin }) => margin};

  &:hover {
    background-color: #f3f4f6;
    text-decoration: none;
    transition-duration: 0.1s;
  }

  &:focus {
    outline: 1px transparent;
  }

  // Mobile (≤ 767px)
  @media (max-width: 767px) {
    width: 100%;
    display: block;
    margin: 6px 0;
    font-size: 16px;
    padding: 8px 12px;
  }
`;

export const Input = styled.input`
  padding: 3px 6px;
  font-size: 14px;
  line-height: 20px;
  color: #24292e;
  vertical-align: middle;
  background-color: #ffffff;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  outline: none;
  box-shadow: rgba(225, 228, 232, 0.2) 0px 1px 0px 0px inset;

  &:focus {
    border-color: #0366d6;
    outline: none;
    box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;
  }

  // Mobile (≤ 767px)
  @media (max-width: 767px) {
    width: 100%;
    font-size: 16px;
    padding: 8px 10px;
    box-sizing: border-box;
  }
`;
