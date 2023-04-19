import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import NavBar from "./components/NavBar.jsx";
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

  return (
    <Container>
      <HomePage className={currentIndex === 0 ? "toggled" : ""} />
      <AboutPage className={currentIndex === 1 ? "toggled" : ""} />
      <WorksPage className={currentIndex === 2 ? "toggled" : ""} />
      <ContactPage className={currentIndex === 3 ? "toggled" : ""} />
      <NavBar vh={windowHeight} currentIndex={currentIndex} />
    </Container>
  );
};

export default App;
