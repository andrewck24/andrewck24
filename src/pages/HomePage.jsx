import styled from "@emotion/styled";
import Section from "../components/Section";

import { ReactComponent as HtmlIcon } from "../icons/html5.svg";
import { ReactComponent as CssIcon } from "../icons/css3.svg";
import { ReactComponent as JsIcon } from "../icons/javascript_1.svg";
import { ReactComponent as ReactIcon } from "../icons/react.svg";
import { ReactComponent as PythonIcon } from "../icons/python.svg";

const Container = styled(Section)`
  background-image: linear-gradient(
    60deg,
    var(--dark-blue) 0%,
    var(--dark-aquamarine) 100%
  );
  grid-template-rows: repeat(6, minmax(0, 1fr));
`;

const Header = styled.h1`
  width: 100%;
  /* font-family: "Times New Roman", monospace; */
  font-weight: 700;
  font-size: 4.5rem;
  grid-row: 4;
`;

const SkillStack = styled.div`
  grid-row: 3;
  display: flex;
  flex-wrap: wrap-reverse;
  svg {
    height: 2rem;
    filter: brightness(2.5);
  }
`;

const HomePage = () => {
  return (
    <Container>
      <Header>Andrew Tseng</Header>
      <SkillStack>
        <HtmlIcon />
        <CssIcon />
        <JsIcon />
        <ReactIcon />
        <PythonIcon />
      </SkillStack>
    </Container>
  );
};

export default HomePage;
