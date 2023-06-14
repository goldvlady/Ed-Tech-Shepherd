import { Box, ChakraProvider, Spinner } from '@chakra-ui/react';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'bootstrap/dist/css/bootstrap-reboot.min.css';
import 'bootstrap/dist/css/bootstrap-utilities.min.css';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import mixpanel from 'mixpanel-browser';
import React, { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { BrowserRouter, useLocation, useSearchParams } from 'react-router-dom';

import resourceStore from './state/resourceStore';
import userStore from './state/userStore';
import theme from './theme';
import CreatePassword from './views/CreatePassword';
import BookmarkedTutors from './views/Dashboard/BookmarkedTutors';
import Marketplace from './views/Dashboard/Marketplace';
import Messaging from './views/Dashboard/Messaging';
import MyTutors from './views/Dashboard/MyTutors';
import Tutor from './views/Dashboard/Tutor';
import DashboardIndex from './views/Dashboard/index';
import DashboardLayout from './views/Dashboard/layout';
import ForgotPassword from './views/ForgotPassword';
import Home from './views/Home';
import Login from './views/Login';
import Offer from './views/Offer';
import OnboardStudent from './views/OnboardStudent';
import OnboardTutor from './views/OnboardTutor';
import CompleteProfile from './views/OnboardTutor/complete_profile';
import SendTutorOffer from './views/SendTutorOffer';
import Session from './views/Session';
import Signup from './views/Signup';
import PendingVerification from './views/VerificationPages/pending_verification';
import VerificationSuccess from './views/VerificationPages/successful_verification';
import WelcomeLayout from './views/WelcomeLayout';

const RedirectToLanding: React.FC = () => {
  window.location.href = 'https://shepherdtutors.com/';
  return null;
};

const AuthAction = (props: any) => {
  const [params] = useSearchParams();
  const mode = params.get('mode')?.toLowerCase();

  if (mode === 'resetpassword') {
    return <CreatePassword {...props} />;
  }

  return <></>;
};

const RequireAuth = ({
  authenticated,
  unAuthenticated,
}: {
  authenticated: any;
  unAuthenticated: any;
}) => {
  const { fetchUser, user } = userStore();
  const [loadingUser, setLoadingUser] = useState(true);

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [obtainedUserAuthState, setObtainedUserAuthState] = useState(false);

  useEffect(() => {
    onAuthStateChanged(getAuth(), async (user) => {
      setObtainedUserAuthState(true);
      setFirebaseUser(user);
      console.log(user, 'USE');

      try {
        if (user) {
          await fetchUser();
        }
      } catch (e) {
        console.log('LOGINERROR', e);
      }
      setLoadingUser(false);
    });
  }, []);

  return obtainedUserAuthState && !loadingUser ? (
    firebaseUser && user ? (
      authenticated
    ) : (
      unAuthenticated
    )
  ) : (
    <Box p={5} textAlign="center">
      <Spinner />
    </Box>
  );
};

const AppRoutes: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    mixpanel.track('App Page Viewed', location);
  }, [location]);

  useEffect(() => {
    mixpanel.track_links('a', 'Clicked Link', (el: Element) => {
      return {
        target: el.getAttribute('href'),
      };
    });
  }, []);

  return (
    <Routes>
      <Route element={<WelcomeLayout />}>
        <Route path="onboard">
          <Route path="student" element={<OnboardStudent />} />
          <Route path="tutor" element={<OnboardTutor />} />
          <Route path="*" element={<Navigate to="student" />} />
          <Route path="" element={<Navigate to="student" />} />
        </Route>

        <Route path="verification_pending" element={<PendingVerification />} />
        <Route path="verification_success" element={<VerificationSuccess />} />

        <Route
          path="login"
          element={
            <RequireAuth
              authenticated={<Navigate to={'/dashboard'} />}
              unAuthenticated={<Login />}
            />
          }
        />

        <Route
          path="signup"
          element={
            <RequireAuth
              authenticated={<Navigate to={'/dashboard'} />}
              unAuthenticated={<Signup />}
            />
          }
        />
        <Route
          path="forgot-password"
          element={
            <RequireAuth
              authenticated={<Navigate to={'/dashboard'} />}
              unAuthenticated={<ForgotPassword />}
            />
          }
        />
        <Route path="auth-action" element={<AuthAction />} />
      </Route>

      <Route path="complete_profile" element={<CompleteProfile />} />

      <Route
        path="login"
        element={
          <RequireAuth authenticated={<Navigate to={'/dashboard'} />} unAuthenticated={<Login />} />
        }
      />
      <Route
        path="signup"
        element={
          <RequireAuth
            authenticated={<Navigate to={'/dashboard'} />}
            unAuthenticated={<Signup />}
          />
        }
      />
      <Route
        path="forgot-password"
        element={
          <RequireAuth
            authenticated={<Navigate to={'/dashboard'} />}
            unAuthenticated={<ForgotPassword />}
          />
        }
      />
      <Route path="auth-action" element={<AuthAction />} />

      <Route path="home" element={<Home />} />
      <Route
        path="dashboard"
        element={
          <RequireAuth
            authenticated={<DashboardLayout children />}
            unAuthenticated={<DashboardLayout children />}
            // unAuthenticated={<Navigate to={"/login"} />}
          />
        }>
        {/* <Route element={<DashboardLayout children />}> */}

        <Route path="tutor/:tutorId/offer" element={<SendTutorOffer />} />
        <Route path="offer/:offerId" element={<Offer />} />

        <Route path="home" element={<DashboardIndex />} />

        <Route path="find-tutor" element={<Marketplace />} />
        <Route path="find-tutor/tutor/" element={<Tutor />} />
        <Route path="my-tutors" element={<MyTutors />} />
        <Route path="saved-tutors" element={<BookmarkedTutors />} />
        <Route path="messaging" element={<Messaging />} />
        <Route path="" element={<Navigate to="home" />} />
        <Route path="*" element={<Navigate to="home" />} />
      </Route>

      <Route
        path="session/:bookingId"
        element={
          <RequireAuth authenticated={<Session />} unAuthenticated={<Navigate to={'/login'} />} />
        }
      />
    </Routes>
  );
};

function App() {
  const { fetchResources, resourcesLoaded } = resourceStore();

  const doFetchResources = useCallback(async () => {
    await fetchResources();
  }, []);

  useEffect(() => {
    doFetchResources();
  }, [doFetchResources]);

  if (!resourcesLoaded) {
    return (
      <ChakraProvider theme={theme}>
        <Box p={5} textAlign="center">
          <Spinner />
        </Box>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
