import React from "react";
import styled from "@emotion/styled";
import "../App.css";

const Container = styled.nav`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 2rem;
  z-index: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const NavLink = styled.a`
  font-family: "Times New Roman", Times, serif;
  font-size: 1.5rem;
  display: block;
  width: auto;
  padding: 0 0.5rem;
  color: var(--primary-white);
  text-align: center;
  text-decoration: none;

  &.toggled {
    text-shadow: 0 0 0.5rem var(--primary-white);
    font-weight: 700;
  }

  &.burger {
    display: none;
    width: 3rem;
    align-items: center;
    justify-content: center;
  }
`;

const NavBar = () => (
  <Container>
    <NavLink></NavLink>
  </Container>
);

export default NavBar;
