import { Container, Navbar, NavDropdown, Nav, Image } from "react-bootstrap";
import { useUser } from "../contexts/UserProvider";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  const { user, logout } = useUser();
  return (
    <Navbar bg="light" sticky="top" className="Header">
      <Container>
        <Navbar.Brand as={Link} to="/" data-testid="brand-logo">
          Microblog
        </Navbar.Brand>

        {user && (
          <Nav>
            <NavDropdown
              align="end"
              title={<Image roundedCircle src={user.avatar_url + "&s=32"} />}
              id="nav-dropdown"
            >
              <NavDropdown.Item
                className="py-2"
                as={NavLink}
                to={`/user/${user.username}`}
              >
                Profile
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item className="py-2" as={NavLink} to="/password">
                Change password
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item className="py-2" onClick={logout}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
}

export { Header };
