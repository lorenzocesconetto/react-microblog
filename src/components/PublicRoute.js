import { Spinner } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";

export default function PublicRoute({ children }) {
  const { user } = useUser();

  if (user === undefined) {
    return <Spinner animation="border" />;
  } else if (user === null) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
}
export { PublicRoute };
