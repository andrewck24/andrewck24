import React from "react";
import styled from "@emotion/styled";
import { ReactComponent as BurgerIcon } from "./../icons/burger_menu.svg";

const Container = styled.button`
  width: auto;
  display: none;
  background: none;
  border: none;
  align-items: center;
  justify-content: center;
  &:hover {
    text-decoration: underline;
  }
  svg {
    /* FIXME: 無法調整圖示大小 */
    width: 2.5rem;
    height: 2.5rem;
    fill: var(--primary-white);
  }
  @media screen and (max-width: 600px) {
    display: flex;
  };
`;

const BurgerBtn = () => (
  <Container>
    <BurgerIcon />
  </Container>
);

export default BurgerBtn;
