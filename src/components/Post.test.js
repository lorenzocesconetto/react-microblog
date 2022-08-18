import { render, screen } from "@testing-library/react";
import { Post } from "./Post";
import { BrowserRouter } from "react-router-dom";

it("renders all the components of the post", () => {
  // Render component
  const post = {
    text: "Hello",
    author: {
      username: "susan",
      avatar_url: "https://random.com/avatar/susan",
    },
    timestamp: "2022-01-01T00:00:00.000Z",
  };
  render(
    <BrowserRouter>
      <Post post={post} />
    </BrowserRouter>
  );

  // Get elements
  const message = screen.getByText("Hello");
  const authorLink = screen.getByText("susan");
  const avatar = screen.getByAltText("susan");
  const timestamp = screen.getByText(/^.* ago$/);

  // Assert expectations
  // message
  expect(message).toBeInTheDocument();
  // authorLink
  expect(authorLink).toBeInTheDocument();
  expect(authorLink).toHaveAttribute("href", "/user/susan");
  // avatar
  expect(avatar).toBeInTheDocument();
  expect(avatar).toHaveAttribute("src", "https://random.com/avatar/susan&s=48");
  // timestamp
  expect(timestamp).toBeInTheDocument();
  expect(timestamp).toHaveAttribute(
    "title",
    "Fri Dec 31 2021 21:00:00 GMT-0300 (Brasilia Standard Time)"
  );
});
