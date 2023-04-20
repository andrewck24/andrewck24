import React, { useState } from "react";
import styled from "@emotion/styled";

import Btn from "./Btn";
import BurgerBtn from "./BurgerBtn";
import useNavbarActions from "../modules/navbarActions";

const Container = styled.nav`
  position: fixed;
  top: 0;
  right: 0;
  height: 2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  @media screen and (max-width: 600px) {
    height: 100vh;
    width: 60%;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-end;
    &.unfold {
      background: linear-gradient(
        270deg,
        var(--dark-blue) 0%,
        transparent 100%
      );
    }
  } ;
`;

const NavItem = styled(Btn)`
  margin-right: 1rem;
  &:hover {
    text-decoration: underline;
  }
  &.toggled {
    text-shadow: 0 0 0.5rem var(--primary-white);
    font-weight: 700;
  }
  @media screen and (max-width: 600px) {
    display: none;
    font-size: 2rem;
    padding: 0.75rem;
    &.unfold {
      display: flex;
    }
  } ;
`;

const NavBar = (props) => {
  const { vh, currentIndex } = props;
  const { unfold, handleBurgerBtnClick, handleNavItemClick } = useNavbarActions();

  const pageArr = ["Home", "About", "Works", "Contact"];
  return (
    <Container className={unfold ? "unfold" : ""}>
      <BurgerBtn onClick={handleBurgerBtnClick} />
      {pageArr.map((pageName, index) => (
        <NavItem
          key={index}
          onClick={() => handleNavItemClick(index, vh)}
          className={`
            ${currentIndex === index ? "toggled" : ""}
            ${unfold ? "unfold" : ""}
          `}
        >
          {pageName}
        </NavItem>
      ))}
    </Container>
  );
};

export default NavBar;
