import { Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header, PublicRoute, PrivateRoute } from "./components";
import { ApiProvider, FlashProvider, UserProvider } from "./contexts";
import {
  ExplorePage,
  EditUserPage,
  FeedPage,
  LoginPage,
  UserPage,
  RegistrationPage,
  ChangePasswordPage,
  ResetRequestPage,
  ResetPage,
} from "./pages";

export default function App() {
  return (
    <Container fluid className="App">
      <BrowserRouter>
        <FlashProvider>
          <ApiProvider>
            <UserProvider>
              <Header />
              <Routes>
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <LoginPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/registration"
                  element={
                    <PublicRoute>
                      <RegistrationPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/reset-request"
                  element={
                    <PublicRoute>
                      <ResetRequestPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/reset"
                  element={
                    <PublicRoute>
                      <ResetPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="*"
                  element={
                    <PrivateRoute>
                      <Routes>
                        <Route path="/" element={<FeedPage />} />
                        <Route path="/explore" element={<ExplorePage />} />
                        <Route path="/user/:username" element={<UserPage />} />
                        <Route path="/edit" element={<EditUserPage />} />
                        <Route
                          path="/password"
                          element={<ChangePasswordPage />}
                        />
                        <Route path="*" element={<Navigate to="/" />} />
                      </Routes>
                    </PrivateRoute>
                  }
                />
              </Routes>
            </UserProvider>
          </ApiProvider>
        </FlashProvider>
      </BrowserRouter>
    </Container>
  );
}
