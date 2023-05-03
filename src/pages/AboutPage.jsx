import styled from "@emotion/styled";
import Section from "../components/Section";

const Container = styled(Section)`
  background-color: var(--primary-orange);
  grid-template-rows: repeat(8, minmax(0, 1fr));
  row-gap: 1rem;
  justify-content: center;
`;

const QuoteBox = styled.div`
  max-width: 28rem;
  background-color: var(--dark-white);
  color: var(--dark-blue);
  font-size: 1rem;
  text-align: center;
  display: grid;
  grid-template-rows: repeat(4, minmax(0, 1fr));
`;

const QuoteBox1 = styled(QuoteBox)`
  grid-row: 2 / 5;
`;

const QuoteBox2 = styled(QuoteBox)`
  grid-row: 5 / 8;
`;

const QuoteContent = styled.div`
  grid-row: 2 / 4;
`;

const QuoteText = styled.p`
  padding: 0 2rem;
  margin-block-start: 0.5rem;
  margin-block-end: 0.5rem;
`;

const QuoteMain = styled(QuoteText)`
  font-size: 1.2rem;
  font-weight: 700;
`;

const AboutPage = () => {
  return (
    <Container>
      <QuoteBox1>
        <QuoteContent>
          <QuoteMain>I'm a Pull-Stack Developer.</QuoteMain>
          <QuoteText>
            I just pull things off the Internet and put it into my code.
          </QuoteText>
        </QuoteContent>
      </QuoteBox1>
      <QuoteBox2>
        <QuoteContent>
          <QuoteMain>我是全端工程師。</QuoteMain>
          <QuoteText>把網路上的程式碼全部端進來的工程師。</QuoteText>
          <QuoteText>就連這句話也是端過來的XD</QuoteText>
        </QuoteContent>
      </QuoteBox2>
    </Container>
  );
};

export default AboutPage;
