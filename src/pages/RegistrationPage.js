import Body from "../components/Body";
import { Button, Form } from "react-bootstrap";
import InputField from "../components/InputField";
import { useEffect, useRef, useState } from "react";
import { useApi } from "../contexts/ApiProvider";
import { useNavigate } from "react-router-dom";
import { useFlash } from "../contexts/FlashProvider";

export default function RegistrationPage() {
  const [formErrors, setFormErrors] = useState({});
  const usernameFieldRef = useRef();
  const emailFieldRef = useRef();
  const passwordFieldRef = useRef();
  const password2FieldRef = useRef();
  const api = useApi();
  const navigate = useNavigate();
  const flash = useFlash();

  useEffect(() => {
    usernameFieldRef.current.focus();
  }, []);

  const onSubmit = async e => {
    e.preventDefault();
    const username = usernameFieldRef.current.value;
    const email = emailFieldRef.current.value;
    const password = passwordFieldRef.current.value;
    const password2 = password2FieldRef.current.value;

    const errors = {};
    // Client form validation
    if (!username) {
      errors.username = "Username is required";
    }
    if (!email) {
      errors.email = "Email is required";
    }
    if (!password) {
      errors.password = "Password is required";
    }
    if (password !== password2) {
      errors.password2 = "Passwords don't match";
    }
    setFormErrors(errors);
    if (Object.keys(errors).length) {
      return;
    }

    // Server form validation
    const data = await api.post("/users", {
      username,
      email,
      password,
    });
    if (!data.ok) {
      setFormErrors(data.body.errors.json);
      return;
    }
    // Successful register
    navigate("/login");
    flash("You have successfully registered!", "success");
  };

  return (
    <Body>
      <h1>Register</h1>

      <Form onSubmit={onSubmit}>
        <InputField
          name="username"
          label="Username"
          error={formErrors.username}
          fieldRef={usernameFieldRef}
        />
        <InputField
          name="email"
          label="Email"
          error={formErrors.email}
          fieldRef={emailFieldRef}
        />
        <InputField
          name="password"
          label="Password"
          type="password"
          error={formErrors.password}
          fieldRef={passwordFieldRef}
        />
        <InputField
          name="password2"
          label="Enter your password again"
          type="password"
          error={formErrors.password2}
          fieldRef={password2FieldRef}
        />
        <Button type="submit" variant="primary">
          Register
        </Button>
      </Form>
    </Body>
  );
}
export { RegistrationPage };
