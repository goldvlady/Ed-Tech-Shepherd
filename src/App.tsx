import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import theme from './theme';
import Booking from './views/Booking';
import BookSession from './views/BookSession';
import Onboard from './views/Onboard';
import OnboardStudent from './views/OnboardStudent';
import OnboardTutor from './views/OnboardTutor';

const RedirectToLanding:React.FC = () => {
  window.location.href = 'https://shepherdtutors.com/';
  return null;
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="onboard" element={<Onboard />}>
            <Route path="student" element={<OnboardStudent />} />
            <Route path="tutor" element={<OnboardTutor />} />

            <Route path="*" element={<Navigate to="student" />} />
            <Route path="" element={<Navigate to="student" />} />
          </Route>
          <Route path="book-session/:studentLeadId/:course" element={<BookSession />} />
          <Route path="booking/:bookingId/:studentOrTutor" element={<Booking />} />
          <Route path="booking/:bookingId" element={<Booking />} />

          <Route path="*" element={<RedirectToLanding />} />
          <Route path="" element={<RedirectToLanding />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
