import React from "react";
import styled from "@emotion/styled";
// FIXME: This import is not working
// import { ReactComponent as BurgerIcon } from "./../icons/burger_menu.svg";

const BurgerBtn = styled.button`
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
    width: 3rem;
    height: 3rem;
    fill: var(--primary-white);
  }
  @media screen and (max-width: 600px) {
    display: flex;
  } ;
`;

const BurgerMenu = () => (
  <BurgerBtn>
    <svg xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 18L20 18"
        stroke="#ede5cf"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M4 12L20 12"
        stroke="#ede5cf"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M4 6L20 6"
        stroke="#ede5cf"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  </BurgerBtn>
);

export default BurgerMenu;
