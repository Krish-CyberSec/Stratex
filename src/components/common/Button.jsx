import styled from "styled-components";

const StyledButton = styled.button`
  background: ${({ $bg }) => $bg || "var(--university-blue)"};
  color: ${({ $color }) => $color || "#fff"};
  font-family: ${({ $font }) => $font || "sans-serif"};
  width: 100%;
  border: 0;
  padding: 11px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    box-shadow 160ms ease,
    transform 160ms ease;

  &:hover {
    background: ${({ $bg }) => $bg || "var(--university-blue-dark)"};
    box-shadow: 0 8px 18px rgba(6, 77, 131, 0.2);
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 3px solid rgba(255, 196, 0, 0.55);
    outline-offset: 2px;
  }
`;

const Button = ({ text, bg, color, font }) => {
  return (
    <StyledButton type="submit" $bg={bg} $color={color} $font={font}>
      {text ? text : "Button"}
    </StyledButton>
  );
};

export default Button;
