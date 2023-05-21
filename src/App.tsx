import { ChakraProvider } from '@chakra-ui/react';
import mixpanel from 'mixpanel-browser';
import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { BrowserRouter, useLocation, useSearchParams } from 'react-router-dom';
import theme from './theme';
import Booking from './views/Booking';
import BookSession from './views/BookSession';
import Onboard from './views/Onboard';
import OnboardStudent from './views/OnboardStudent';
import OnboardTutor from './views/OnboardTutor';
import Login from './views/Login';
import Signup from './views/Signup';
import Home from './views/Home';
import DashboardLayout from "./views/Dashboard/layout"
import DashboardIndex from "./views/Dashboard/index"
import Marketplace from "./views/Dashboard/Marketplace";
import Tutor from "./views/Dashboard/Tutor";
import WelcomeLayout from './views/WelcomeLayout';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'bootstrap/dist/css/bootstrap-reboot.min.css';
import 'bootstrap/dist/css/bootstrap-utilities.min.css';
import ForgotPassword from './views/ForgotPassword';
import CreatePassword from './views/CreatePassword';

const RedirectToLanding: React.FC = () => {
  window.location.href = 'https://shepherdtutors.com/';
  return null;
}

const AuthAction = (props: any) => {
  const [params] = useSearchParams()
  const mode = params.get('mode')?.toLowerCase();

  if (mode === 'resetpassword') {
    return <CreatePassword {...props} />
  }

  return <></>
}

const AppRoutes: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    mixpanel.track('App Page Viewed', location)
  }, [location]);

  useEffect(() => {
    mixpanel.track_links('a', 'Clicked Link', (el: Element) => {
      return {
        target: el.getAttribute('href')
      }
    });
  }, []);

  return <Routes>
    <Route element={<WelcomeLayout />}>
      <Route path="onboard">
        <Route path="student" element={<OnboardStudent />} />
        <Route path="tutor" element={<OnboardTutor />} />

        <Route path="*" element={<Navigate to="student" />} />
        <Route path="" element={<Navigate to="student" />} />
      </Route>

      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="auth-action" element={<AuthAction />} />
    </Route>

    <Route path="book-session/:studentLeadId/:course" element={<BookSession />} />
    <Route path="booking/:bookingId/:studentOrTutor" element={<Booking />} />
    <Route path="booking/:bookingId" element={<Booking />} />

    <Route path="home" element={<Home />} />

    <Route element={<DashboardLayout children />}>
      <Route path="dashboard" element={<DashboardIndex />} />
      <Route path="find-tutor" element={<Marketplace />} />
      <Route path="find-tutor/tutor" element={<Tutor />} />
      <Route path="" element={<Navigate to="dashboard" />} />
    </Route>
  </Routes >
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
