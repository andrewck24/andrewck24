import React, { useState } from "react";
import styled from "@emotion/styled";

import BurgerBtn from "./BurgerBtn";
import handleNavItemClick from "../modules/handleNavItemClick";

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

const NavItem = styled.button`
  background: none;
  font-size: 1rem;
  border: none;
  margin-right: 1rem;
  color: var(--primary-white);
  text-decoration: none;
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
  const [unfold, setUnfold] = useState(false);

  const handleBurgerBtnClick = (event) => {
    console.log("BurgerBtn clicked");
    setUnfold(!unfold);
  };

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

{
  /* <NavItem
  onClick={() => handleNavItemClick(0, vh)}
  className={currentIndex === 0 ? "toggled" : ""}
>
  Home
</NavItem>
<NavItem
  onClick={() => handleNavItemClick(1, vh)}
  className={currentIndex === 1 ? "toggled" : ""}
>
  About
</NavItem>
<NavItem
  onClick={() => handleNavItemClick(2, vh)}
  className={currentIndex === 2 ? "toggled" : ""}
>
  Works
</NavItem>
<NavItem
  onClick={() => handleNavItemClick(3, vh)}
  className={currentIndex === 3 ? "toggled" : ""}
>
  Contact
</NavItem> */
}
