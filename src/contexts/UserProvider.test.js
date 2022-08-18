import { render, screen, act } from "@testing-library/react";
import UserProvider, { useUser } from "./UserProvider";
import ApiProvider from "./ApiProvider";
import FlashProvider from "./FlashProvider";
import { useEffect, useState } from "react";
import { ACCESS_TOKEN_STORAGE_KEY } from "../constants";
import userEvent from "@testing-library/user-event";

const realFetch = global.fetch;

beforeAll(() => {
  global.fetch = jest.fn();
});

afterAll(() => {
  global.fetch = realFetch;
});

afterEach(() => {
  localStorage.clear();
});

const Test = ({ username, password }) => {
  const [error, setError] = useState();
  const { login, user } = useUser();

  useEffect(() => {
    (async () => {
      try {
        await login(username, password);
      } catch (err) {
        act(() => setError(err.message));
      }
    })();
  }, [login, username, password]);

  return <p>{user ? user.username : error}</p>;
};

it("logs user in", async () => {
  const urls = [];

  global.fetch
    .mockImplementationOnce(url => {
      urls.push(url);
      return {
        status: 200,
        ok: true,
        json: () => Promise.resolve({ access_token: "123" }),
      };
    })
    .mockImplementationOnce(url => {
      urls.push(url);
      return {
        status: 200,
        ok: true,
        json: () => Promise.resolve({ username: "susan" }),
      };
    });

  // render
  render(
    <FlashProvider>
      <ApiProvider>
        <UserProvider>
          <Test username="susan" password="password" />
        </UserProvider>
      </ApiProvider>
    </FlashProvider>
  );

  // select
  const element = await screen.findByText("susan");

  // assert
  expect(element).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(urls).toHaveLength(2);
  expect(urls[0]).toMatch(/^http.*\/api\/tokens$/);
  expect(urls[1]).toMatch(/^http.*\/api\/me$/);
});

it("doesn't login user with bad credentials", async () => {
  const urls = [];
  global.fetch.mockImplementationOnce(url => {
    urls.push(url);
    return {
      status: 401,
      ok: false,
      json: () => Promise.resolve({ description: "Bad credentials provided" }),
    };
  });

  // Render
  render(
    <FlashProvider>
      <ApiProvider>
        <UserProvider>
          <Test />
        </UserProvider>
      </ApiProvider>
    </FlashProvider>
  );

  // Select
  const element = await screen.findByText("Bad credentials provided");

  // Assertions
  expect(element).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(urls).toHaveLength(1);
  expect(urls[0]).toMatch(/^https?:\/\/.*\/api\/tokens$/);
});

it("logs the user out", async () => {
  const Test = () => {
    const { user, logout } = useUser();
    if (user) {
      return (
        <>
          <p>{user.username}</p>
          <button onClick={logout}>Logout</button>
        </>
      );
    } else if (user === null) {
      return <p>Logged out</p>;
    } else {
      return null;
    }
  };
  const urls = [];
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, "123");

  global.fetch
    .mockImplementationOnce(url => {
      urls.push(url);
      return {
        status: 200,
        ok: true,
        json: () => Promise.resolve({ username: "susan" }),
      };
    })
    .mockImplementationOnce(url => {
      urls.push(url);
      return {
        status: 204,
        ok: true,
        json: () => Promise.resolve(),
      };
    });

  // render
  render(
    <FlashProvider>
      <ApiProvider>
        <UserProvider>
          <Test />
        </UserProvider>
      </ApiProvider>
    </FlashProvider>
  );

  // select
  const element = await screen.findByText("susan");
  const button = await screen.findByText("Logout");

  // assert
  expect(element).toBeInTheDocument();
  expect(button).toBeInTheDocument();

  // Event
  userEvent.click(button);

  const element2 = await screen.findByText("Logged out");

  expect(element2).toBeInTheDocument();
  expect(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBeNull();
});
