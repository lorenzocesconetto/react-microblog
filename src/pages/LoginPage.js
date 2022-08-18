import Body from "../components/Body";
import { Form, Button } from "react-bootstrap";
import InputField from "../components/InputField";
import { useState, useRef, useEffect } from "react";
import { useUser } from "../contexts/UserProvider";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useFlash } from "../contexts/FlashProvider";

export default function LoginPage() {
  const [formErrors, setFormErrors] = useState({ username: "", password: "" });
  const usernameFieldRef = useRef();
  const passwordFieldRef = useRef();
  const { login } = useUser();
  const navigate = useNavigate();
  const flash = useFlash();
  const location = useLocation();

  useEffect(() => {
    usernameFieldRef.current.focus();
  }, []);

  const onSubmit = async e => {
    e.preventDefault();

    const username = usernameFieldRef.current.value;
    const password = passwordFieldRef.current.value;

    const errors = {};
    if (!username) {
      errors.username = "Username or Email required";
    }
    if (!password) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);

    if (errors.username || errors.password) {
      return;
    }
    try {
      await login(username, password);
    } catch (err) {
      flash(err.message, "danger");
      return;
    }
    let next = "/";
    if (location.state && location.state.next) {
      next = location.state.next;
    }
    navigate(next);
  };

  return (
    <Body>
      <h1 data-testid="page-title">Login</h1>
      <Form onSubmit={onSubmit}>
        <InputField
          name="username"
          label="Username or email"
          error={formErrors.username}
          fieldRef={usernameFieldRef}
        />
        <InputField
          name="password"
          label="Password"
          type="password"
          error={formErrors.password}
          fieldRef={passwordFieldRef}
        />
        <Button type="submit" variant="primary">
          Login
        </Button>
      </Form>
      <hr />
      <p>
        Forgot your password? You can <Link to="/reset-request">reset it</Link>.
      </p>
      <p>
        Don&apos;t have an account?{" "}
        <Link to="/registration">Register here</Link>!
      </p>
    </Body>
  );
}
export { LoginPage };
