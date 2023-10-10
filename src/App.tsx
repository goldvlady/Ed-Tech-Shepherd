import TutorDashboardLayout from './components/Layout';
import { FlashCardModal } from './components/flashcardDecks';
import { useActiveUserPresence } from './hooks/setUserPrensence';
import { AuthProvider, useAuth } from './providers/auth.provider';
import flashcardStore from './state/flashcardStore';
import resourceStore from './state/resourceStore';
import userStore from './state/userStore';
import theme from './theme';
import CreatePassword from './views/CreatePassword';
import StudentSettings from './views/Dashboard/AccountSettings';
import BookmarkedTutors from './views/Dashboard/BookmarkedTutors';
import StudentBounty from './views/Dashboard/Bounties/Bounty';
import Bounties from './views/Dashboard/Bounties/index';
import DocChat from './views/Dashboard/DocChat';
import FlashCard from './views/Dashboard/FlashCards';
import FlashcardWizardProvider from './views/Dashboard/FlashCards/context/flashcard';
import CreateFlashCard from './views/Dashboard/FlashCards/create';
import HomeWorkHelp from './views/Dashboard/HomeWorkHelp';
import Library from './views/Dashboard/Library';
import Marketplace from './views/Dashboard/Marketplace';
import Messaging from './views/Dashboard/Messaging';
import MyTutors from './views/Dashboard/MyTutors';
import NewNote from './views/Dashboard/Notes/NewNotes';
import LexicalContext from './views/Dashboard/Notes/NewNotes/context';
import PinnedNotes from './views/Dashboard/Notes/PinnedNotes/PinnedNotes';
import Notes from './views/Dashboard/Notes/index';
import Offer from './views/Dashboard/Offer';
import SendTutorOffer from './views/Dashboard/SendTutorOffer';
import Tutor from './views/Dashboard/Tutor';
import DashboardIndex from './views/Dashboard/index';
import DashboardLayout from './views/Dashboard/layout';
import ForgotPassword from './views/ForgotPassword';
import Home from './views/Home';
import Landing from './views/Landing';
import Login from './views/Login';
import OnboardStudent from './views/OnboardStudent/index';
import OnboardTutor from './views/OnboardTutor';
import CompleteProfile from './views/OnboardTutor/complete_profile';
import Session from './views/Session';
import Signup from './views/Signup';
import TutorSettings from './views/TutorDashboard/AccountSettings';
import TutorBounties from './views/TutorDashboard/Bounties/index';
import Clients from './views/TutorDashboard/Clients';
import Client from './views/TutorDashboard/Clients/client';
import TutorOffers from './views/TutorDashboard/Offers/index';
import TutorDashboard from './views/TutorDashboard/index';
import PendingActivation from './views/VerificationPages/pending_activation';
import PendingVerification from './views/VerificationPages/pending_verification';
import VerificationSuccess from './views/VerificationPages/successful_verification';
import VerifyEmail from './views/VerificationPages/verify_email';
import WelcomeLayout from './views/WelcomeLayout';
import Messages from './views/messages';
import { Box, ChakraProvider, Spinner } from '@chakra-ui/react';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'bootstrap/dist/css/bootstrap-reboot.min.css';
import 'bootstrap/dist/css/bootstrap-utilities.min.css';
import mixpanel from 'mixpanel-browser';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Navigate, Route, Router, Routes, useRoutes } from 'react-router';
import {
  BrowserRouter,
  useLocation,
  useSearchParams,
  useNavigate
} from 'react-router-dom';
import 'stream-chat-react/dist/scss/v2/index.scss';
import { ThemeProvider } from 'styled-components';

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
  unAuthenticated
}: {
  authenticated: any;
  unAuthenticated: any;
}) => {
  const navigate = useNavigate();
  const {
    state: { isAuthenticated, loading, user }
  } = useAuth();

  if (loading) {
    return (
      <Box p={5} textAlign="center">
        <Spinner />
      </Box>
    );
  }

  if (isAuthenticated && !user?.isVerified) {
    navigate('/verify_email');
  }
  return isAuthenticated ? authenticated : unAuthenticated;
};

const TestNewNote = () => <div>this is the new note </div>;

const studentRoutes = [
  { path: 'new-note', element: <NewNote /> },
  // { path: 'new-note', element: <TestNewNote /> },
  { path: 'new-note/:id', element: <NewNote /> },
  { path: 'notes', element: <Notes /> },
  { path: 'pinned', element: <PinnedNotes /> },
  { path: 'tutor/:tutorId/offer', element: <SendTutorOffer /> },
  { path: 'offer/:offerId', element: <Offer /> },
  { path: '', element: <DashboardIndex /> },
  { path: 'docchat', element: <DocChat /> },
  { path: 'find-tutor', element: <Marketplace /> },
  { path: 'find-tutor/tutor/', element: <Tutor /> },
  { path: 'my-tutors', element: <MyTutors /> },
  { path: 'bounties', element: <Bounties /> },
  { path: 'bounties/:bountyId', element: <StudentBounty /> },
  { path: 'saved-tutors', element: <BookmarkedTutors /> },
  { path: 'messaging', element: <Messaging /> },
  { path: 'account-settings', element: <StudentSettings /> },
  { path: 'ace-homework', element: <HomeWorkHelp /> },
  { path: 'flashcards/create', element: <CreateFlashCard /> },
  { path: 'flashcards', element: <FlashCard /> },
  { path: 'flashcards/:flashcardId', element: <FlashCard /> },
  { path: 'library', element: <Library /> }
];

// Tutor specific routes configuration
const tutorRoutes = [
  { path: 'tutordashboard', element: <TutorDashboard /> },
  { path: 'tutordashboard/clients', element: <Clients /> },
  { path: 'tutordashboard/clients/:clientId', element: <Client /> },
  { path: 'tutordashboard/offers', element: <TutorOffers /> },
  { path: 'tutordashboard/offer/:offerId', element: <Offer /> },
  { path: 'tutordashboard/bounties', element: <TutorBounties /> },
  { path: 'tutordashboard/bounties/:bidId', element: <TutorBounties /> },
  { path: 'tutordashboard/account-settings', element: <TutorSettings /> },
  { path: 'tutordashboard/messages', element: <Messaging /> }
];

const userLayouts = {
  student: <DashboardLayout children />,
  tutor: <TutorDashboardLayout children className />
};

// Routes based on userType
const userRoutes = {
  student: studentRoutes,
  tutor: tutorRoutes,
  both: [...studentRoutes, ...tutorRoutes]
};

const RenderLayout = () => {
  const matchedRoute = useRoutes(userRoutes.both);

  const isStudentRoute = studentRoutes.some(
    (route) => route.path === matchedRoute?.props?.match?.route?.path
  );
  const isTutorRoute = tutorRoutes.some(
    (route) => route.path === matchedRoute?.props?.match?.route?.path
  );

  if (isStudentRoute) {
    return userLayouts.student;
  } else if (isTutorRoute) {
    return userLayouts.tutor;
  } else {
    return <Navigate to="/404" />;
  }
};

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const { fetchNotifications, fetchUserDocuments } = userStore();
  const {
    state: { user: userData, loading, isAuthenticated }
  } = useAuth();

  const userType = useMemo(() => {
    return userData?.type?.includes('tutor') &&
      userData?.type?.includes('student')
      ? 'both'
      : userData?.type?.includes('tutor')
      ? 'tutor'
      : 'student';
  }, [userData]);

  const userRoute = userRoutes[userType];

  useEffect(() => {
    if (isAuthenticated) {
      // fetchNotifications();
      userData && fetchUserDocuments(userData._id);
    }
    /* eslint-disable */
  }, [isAuthenticated]);

  useEffect(() => {
    mixpanel.track('App Page Viewed', location);
  }, [location]);

  useEffect(() => {
    mixpanel.track_links('a', 'Clicked Link', (el: Element) => {
      return {
        target: el.getAttribute('href')
      };
    });
  }, []);

  if (loading) {
    return (
      <ChakraProvider theme={theme}>
        <Box
          p={5}
          textAlign="center"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          }}
        >
          <Spinner />
        </Box>
      </ChakraProvider>
    );
  }

  return (
    <Routes>
      <Route
        path=""
        element={
          <RequireAuth
            authenticated={<Navigate to={'/dashboard'} />}
            unAuthenticated={<Landing />}
          />
        }
      />
      <Route
        element={
          <WelcomeLayout />
          // <RequireAuth
          //   authenticated={<Navigate to={'/dashboard'} />}
          //   unAuthenticated={<WelcomeLayout />}
          // />
        }
      >
        <Route path="onboard">
          <Route path="student" element={<OnboardStudent />} />
          <Route path="tutor" element={<OnboardTutor />} />
          <Route path="*" element={<Navigate to="student" />} />
          <Route path="" element={<Navigate to="student" />} />
        </Route>

        <Route
          path="login"
          element={
            <Login />
            // <RequireAuth
            //   authenticated={<Navigate to={'/dashboard'} />}
            //   unAuthenticated={<Login />}
            // />
          }
        />

        <Route
          path="signup"
          element={
            <RequireAuth
              authenticated={<Navigate to={'/dashboard'} />}
              unAuthenticated={<OnboardStudent />}
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

      <Route path="verification_pending" element={<PendingVerification />} />
      <Route path="verification_success" element={<VerificationSuccess />} />

      <Route path="complete_profile" element={<CompleteProfile />} />
      <Route path="verify_email" element={<VerifyEmail />} />
      <Route path="activation_pending" element={<PendingActivation />} />

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
        path="session/:bookingId"
        element={
          <RequireAuth
            authenticated={<Session />}
            unAuthenticated={<Navigate to={'/login'} />}
          />
        }
      />
      <Route
        path="/dashboard"
        element={
          <RequireAuth
            authenticated={<RenderLayout />}
            unAuthenticated={<Navigate to={'/login'} />}
          />
        }
      >
        {userRoute &&
          userRoute.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
      </Route>
    </Routes>
  );
};

function App() {
  const { fetchResources } = resourceStore();
  const { flashcard } = flashcardStore();
  useActiveUserPresence();

  const doFetchResources = useCallback(async () => {
    await fetchResources();
    /* eslint-disable */
  }, []);

  useEffect(() => {
    doFetchResources();
  }, [doFetchResources]);

  return (
    <LexicalContext>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <BrowserRouter>
            <FlashcardWizardProvider>
              <FlashCardModal isOpen={Boolean(flashcard)} />
              <AppRoutes />
            </FlashcardWizardProvider>
          </BrowserRouter>
        </AuthProvider>
      </ChakraProvider>
    </LexicalContext>
  );
}

export default App;
