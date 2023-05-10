import { ChakraProvider } from '@chakra-ui/react';
import mixpanel from 'mixpanel-browser';
import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { BrowserRouter, useLocation } from 'react-router-dom';
import theme from './theme';
import Booking from './views/Booking';
import BookSession from './views/BookSession';
import Onboard from './views/Onboard';
import OnboardStudent from './views/OnboardStudent';
import OnboardTutor from './views/OnboardTutor';
import WelcomeLayout from './views/WelcomeLayout';

import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'bootstrap/dist/css/bootstrap-reboot.min.css';
import 'bootstrap/dist/css/bootstrap-utilities.min.css';

const RedirectToLanding: React.FC = () => {
  window.location.href = 'https://shepherdtutors.com/';
  return null;
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
    </Route>
    <Route path="book-session/:studentLeadId/:course" element={<BookSession />} />
    <Route path="booking/:bookingId/:studentOrTutor" element={<Booking />} />
    <Route path="booking/:bookingId" element={<Booking />} />

    <Route path="*" element={<RedirectToLanding />} />
    <Route path="" element={<RedirectToLanding />} />
  </Routes>
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
