import styled from "styled-components";

const StyledButton = styled.button`
  background: ${({ $bg }) => $bg || "#000"};
  color: ${({ $color }) => $color || "#fff"};
  font-family: ${({ $font }) => $font || "sans-serif"};
  width: 95%;
  margin: auto;
  border: 0;
  padding: 10px 0;
  border-radius: 8px;

  &:hover {
    opacity: 0.9;
  }
`;

const Button = ({ text, bg, color, font }) => {
  return (
    <StyledButton type="submit" $bg={bg} $color={color} $font={font}>
      {text? text:"Button"}
    </StyledButton>
  );
};

export default Button;
