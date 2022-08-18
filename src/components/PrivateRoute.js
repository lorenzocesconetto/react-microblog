import { Spinner } from "react-bootstrap";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";

export default function PrivateRoute({ children }) {
  const { user } = useUser();
  const location = useLocation();

  if (user === undefined) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" />
      </div>
    );
  } else if (user === null) {
    const url = location.pathname + location.search + location.hash;
    return <Navigate to="/login" state={{ next: url }}></Navigate>;
  } else {
    return children;
  }
}
export { PrivateRoute };
