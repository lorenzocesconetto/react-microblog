import { render, screen } from "@testing-library/react";
import App from "./App";

it("renders the brand element", () => {
  // Render
  render(<App />);

  // Select elements
  const brand = screen.getByText(/Microblog/);
  // const element = screen.getByTestId("brand-logo");
  const title = screen.getByTestId("page-title");

  // Make assertions
  // brand
  expect(brand).toBeInTheDocument();
  expect(brand).toHaveClass("navbar-brand");
  // page title
  // expect(title).toHaveTextContent("Login"); // Allows to have more text, just has to "contain"
  expect(title.textContent).toEqual("Login");
});
