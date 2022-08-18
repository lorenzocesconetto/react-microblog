import { render, screen, act } from "@testing-library/react";
import { useEffect } from "react";
import FlashMessage from "../components/FlashMessage";
import FlashProvider, { useFlash } from "./FlashProvider";

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

it("flashes a message", () => {
  const Test = () => {
    const flash = useFlash();

    useEffect(() => {
      flash("Message", "danger");
    }, [flash]);

    return null;
  };

  // Render waits until react renders everything (useEffect included)
  render(
    <FlashProvider>
      <FlashMessage />
      <Test />
    </FlashProvider>
  );

  // Get elements
  // const alert = screen.getByRole("alert");
  const alert = screen.getByTestId("flash-alert-message");

  // Assertions
  expect(alert).toHaveTextContent("Message");
  expect(alert).toHaveClass("alert-danger");
  expect(alert).toHaveAttribute("data-visible", "true");

  // act waits until react is done re-rendering
  // runAllTimers will run timers until next timing event
  act(() => jest.runAllTimers());

  expect(alert).toHaveAttribute("data-visible", "false");
});
