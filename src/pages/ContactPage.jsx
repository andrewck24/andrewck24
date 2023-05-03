import styled from "@emotion/styled";
import Section from "../components/Section";

import { ReactComponent as Cakeresume } from "../icons/cakeresume.svg";
import { ReactComponent as Github } from "../icons/github_badge.svg";
import { ReactComponent as Linkedin } from "../icons/linkedin.svg";

const Container = styled(Section)`
  background-color: var(--primary-blue);
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(4, minmax(0, 1fr));
`;

const Header = styled.div`
  border-right: 1px solid var(--dark-white);
  padding-right: 1rem;
  justify-content: right;
  font-size: 3rem;
  grid-column: 1;
  grid-row: 2 / 4;
  display: flex;
`;

const IconsZone = styled.div`
  grid-column: 2;
  grid-row: 2 / 4;
  grid-template-columns: repeat(3, minmax(0, 1fr));
`;

const IconContainer = styled.a`
  display: flex;
  svg {
    /* stroke: var(--dark-white); */
    /* fill: var(--dark-white); */
    width: 5rem;
    height: 5rem;
  }
`;


const ContactPage = () => {
  return (
    <Container>
      <Header>ANDREW TSENG</Header>
      <IconsZone>
        <IconContainer href="https://www.cakeresume.com/me/andrewHB614">
          <Cakeresume />
        </IconContainer>
        <IconContainer href="https://github.com/AndrewCK24">
          <Github />
        </IconContainer>
        <IconContainer href="https://www.linkedin.com/in/li-wei-tseng-b6120b202/">
          <Linkedin />
        </IconContainer>
      </IconsZone>
    </Container>
  );
};

export default ContactPage;
