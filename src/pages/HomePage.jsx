import styled from "@emotion/styled";
import Section from "../components/Section";

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

const HomePage = () => {
  return (
    <Container>
      <Header>Andrew Tseng</Header>
    </Container>
  );
};

export default HomePage;
