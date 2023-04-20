import React from "react";
import styled from "@emotion/styled";

import Btn from "./Btn";
import { ReactComponent as BurgerIcon } from "./../icons/burger_menu.svg";

const Container = styled(Btn)`
  width: auto;
  display: none;
  /* align-items: center;
  justify-content: center; */
  &:hover {
    text-decoration: underline;
  }
  svg {
    width: 2.5rem;
    height: 2.5rem;
    fill: var(--primary-white);
  }
  @media screen and (max-width: 600px) {
    display: flex;
  } ;
`;

const BurgerBtn = ({ onClick }) => {
  return (
    <Container title="unfold menu" onClick={onClick}>
      <BurgerIcon />
    </Container>
  );
};

export default BurgerBtn;
