import styled from "@emotion/styled";

const Section = styled.div`
  /* position: absolute;
  top: 0;
  left: 0; */
  position: relative;
  /* width: 100vw; */
  height: calc(100vh - 4rem);
  padding: 2rem;
  display: grid;
  column-gap: 1rem;
  /* opacity: 0; */
  transition: opacity 0.5s ease-in-out;
  &.toggled {
    /* opacity: 1; */
  }
`;

export default Section;
