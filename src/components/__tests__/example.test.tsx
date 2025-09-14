import { render, screen } from '@testing-library/react';

// Example component test
describe('Example Test', () => {
  it('should render test example', () => {
    render(<div data-testid="example">Hello World</div>);
    
    expect(screen.getByTestId('example')).toBeInTheDocument();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});