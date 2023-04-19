import { useState, useEffect } from "react";
import styled from "@emotion/styled";
// import "./index.css";

import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import WorksPage from "./pages/WorksPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";

const Container = styled.div`
  position: relative;
  width: 100%;
  height: calc(100vh * 4);
  overflow: hidden;
`;

const Navbar = styled.nav`
  position: fixed;
  top: 0;
  right: 0;
  height: 2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const NavItem = styled.a`
  margin-left: 1rem;
  color: var(--primary-white);
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const App = () => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [currentIndex, setCurrentIndex] = useState(0);

  const toggle = () => {
    const currentPosition = window.scrollY + 0.35 * windowHeight;
    const index = parseInt(currentPosition / windowHeight);
    setCurrentIndex(index);
  };

  useEffect(() => {
    toggle();
    window.addEventListener("scroll", toggle);
    return () => {
      window.removeEventListener("scroll", toggle);
    };
  }, [windowHeight]);

  const handleNavItemClick = (index) => {
    const topOffset = index * windowHeight;
    window.scrollTo({
      top: topOffset,
      behavior: "smooth",
    });
  };
  
  return (
    <Container>
      <HomePage className={currentIndex === 0 ? "toggled" : ""} />
      <AboutPage className={currentIndex === 1 ? "toggled" : ""} />
      <WorksPage className={currentIndex === 2 ? "toggled" : ""} />
      <ContactPage className={currentIndex === 3 ? "toggled" : ""} />
      <Navbar id="navbar">
        <NavItem href="#home" onClick={ () => handleNavItemClick(0)}>Home</NavItem>
        <NavItem href="#about" onClick={ () => handleNavItemClick(1)}>About</NavItem>
        <NavItem href="#works" onClick={ () => handleNavItemClick(2)}>Works</NavItem>
        <NavItem href="#contact" onClick={ () => handleNavItemClick(3)}>Contact</NavItem>
      </Navbar>
    </Container>
  );
};

export default App;
