import {
  useLocation,
  useSearchParams,
  useNavigate
} from 'react-router-dom';
import { useEffect, useMemo, Suspense, lazy } from 'react';
import userStore from '../state/userStore';
import chameleon from '@chamaeleonidae/chmln';
import { useAuth } from '../providers/auth.provider';
import { usePostHog } from 'posthog-js/react';
import { isProduction } from '../util';
import { Box, ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import ShepherdSpinner from '../views/Dashboard/components/shepherd-spinner';
import { Navigate, Route, Routes, useRoutes } from 'react-router';
import WelcomeLayout from '../views/WelcomeLayout';
import OnboardStudent from '../views/OnboardStudent/index';
import OnboardTutor from '../views/OnboardTutor';
import ForgotPassword from '../views/ForgotPassword';
import Login from '../views/Login';
import CreatePassword from '../views/CreatePassword';
import PendingVerification from '../views/VerificationPages/pending_verification';
import VerificationSuccess from '../views/VerificationPages/successful_verification';
import VerifyEmail from '../views/VerificationPages/verify_email';
import CompleteProfile from '../views/OnboardTutor/complete_profile';
import PendingActivation from '../views/VerificationPages/pending_activation';
import Signup from '../views/Signup';
import Home from '../views/Home';
import Feedback from '../views/Feedback';
import Session from '../views/Session';
import DashboardLayout from '../views/Dashboard/layout';
import NewNote from '../views/Dashboard/Notes/NewNotes';
import FlashCard from '../views/Dashboard/FlashCards';
import DocChat from '../views/Dashboard/DocChat';
const HomeWorkHelp = lazy(() => import('../views/Dashboard/HomeWorkHelp'));
import TakeQuizzes from '../views/Dashboard/Quizzes/take';
import Tutor from '../views/Dashboard/Tutor';
import TutorDashboardLayout from '../components/Layout';

import Notes from '../views/Dashboard/Notes/index';
import PinnedNotes from '../views/Dashboard/Notes/PinnedNotes/PinnedNotes';
import SendTutorOffer from '../views/Dashboard/SendTutorOffer';
import Offer from '../views/Dashboard/Offer';
import DashboardIndex from '../views/Dashboard';
import Marketplace from '../views/Dashboard/Marketplace';
import MyTutors from '../views/Dashboard/MyTutors';
import Bounties from '../views/Dashboard/Bounties';
import StudentBounty from '../views/Dashboard/Bounties/Bounty';
import BookmarkedTutors from '../views/Dashboard/BookmarkedTutors';
import Messaging from '../views/Dashboard/Messaging';
import StudentSettings from '../views/Dashboard/AccountSettings';
import CreateFlashCard from '../views/Dashboard/FlashCards/create';
import EditFlashCard from '../views/Dashboard/FlashCards/edit';
import Library from '../views/Dashboard/Library';
import CreateStudyPlans from '../views/Dashboard/StudyPlans/create';
import StudyPlans from '../views/Dashboard/StudyPlans';
import CoursePlan from '../views/Dashboard/StudyPlans/coursePlan';
import Quizzes from '../views/Dashboard/Quizzes';
import CreateQuizzes from '../views/Dashboard/Quizzes/create';

import TutorDashboard from '../views/TutorDashboard/index';
import Clients from '../views/TutorDashboard/Clients';
import Client from '../views/TutorDashboard/Clients/client';
import TutorOffers from '../views/TutorDashboard/Offers/index';
import TutorBounties from '../views/TutorDashboard/Bounties/index';
import TutorSettings from '../views/TutorDashboard/AccountSettings';


const studentRoutes = [
  { path: 'notes/new-note', element: <NewNote /> },
  // { path: 'new-note', element: <TestNewNote /> },
  // { path: 'notes/new-note/:id', element: <NewNote /> },
  { path: 'notes', element: <Notes /> },
  { path: 'pinned', element: <PinnedNotes /> },
  { path: 'tutor/:tutorId/offer', element: <SendTutorOffer /> },
  { path: 'offer/:offerId', element: <Offer /> },
  { path: '', element: <DashboardIndex /> },
  // { path: 'docchat', element: <DocChat /> },
  { path: 'find-tutor', element: <Marketplace /> },
  { path: 'find-tutor/:subjectId', element: <Marketplace /> },
  // { path: 'find-tutor/tutor/', element: <Tutor /> },
  { path: 'my-tutors', element: <MyTutors /> },
  { path: 'bounties', element: <Bounties /> },
  { path: 'bounties/:bountyId', element: <StudentBounty /> },
  { path: 'saved-tutors', element: <BookmarkedTutors /> },
  { path: 'messaging', element: <Messaging /> },
  { path: 'account-settings', element: <StudentSettings /> },
  // { path: 'ace-homework/:id', element: <HomeWorkHelp /> },
  { path: 'ace-homework', element: <HomeWorkHelp /> },
  { path: 'flashcards/create', element: <CreateFlashCard /> },
  { path: 'flashcards', element: <FlashCard /> },
  // { path: 'flashcards/:flashcardId', element: <FlashCard /> },
  { path: 'flashcards/:id/edit', element: <EditFlashCard /> },
  { path: 'library', element: <Library /> },
  { path: 'create-study-plans', element: <CreateStudyPlans /> },
  { path: 'study-plans', element: <StudyPlans /> },
  { path: 'study-plans/:planId', element: <CoursePlan /> },
  { path: 'library/subjects/:subjectId', element: <Library /> },
  { path: 'library/topics/:topicId', element: <Library /> },
  { path: 'library/decks/:deckId', element: <Library /> },
  // quizzes
  { path: 'quizzes', element: <Quizzes /> },
  { path: 'quizzes/create', element: <CreateQuizzes /> }
  // { path: 'quizzes/take', element: <TakeQuizzes /> }
];

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

const AuthAction = (props: any) => {
  const [params] = useSearchParams();
  const mode = params.get('mode')?.toLowerCase();

  if (mode === 'resetpassword') {
    return <CreatePassword {...props} />;
  }

  return <></>;
};

const userRoutes = {
  student: studentRoutes,
  tutor: tutorRoutes,
  both: [...studentRoutes, ...tutorRoutes]
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
        <ShepherdSpinner />
      </Box>
    );
  }

  if (isAuthenticated && !user?.isVerified) {
    navigate('/verify_email');
  }
  return isAuthenticated ? authenticated : unAuthenticated;
};

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const { fetchNotifications, fetchUserDocuments } = userStore();
  /* chameleon.io NPM script */

  chameleon.init(
    'S9mtu3rwhjnyCB5YCEJ8wL946DrhUsVByQcsQKo6tTAWqP-1QmYSE-ExIRqucDjaOrhGTJ',
    { fastUrl: 'https://fast.chameleon.io/' }
  );

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
  const posthog = usePostHog();

  const RedirectToExternal = ({ url }) => {
    useEffect(() => {
      window.location.href = url;
    }, [url]);

    return null; // render nothing
  };

  useEffect(() => {
    if (isAuthenticated) {
      // fetchNotifications();
      if (userData) {
        chameleon.identify(userData?._id, {
          // REQUIRED, the unique ID of each user in your database (e.g. 23443 or "690b80e5f433ea81b96c9bf6")
          email: userData?.email, // RECOMMENDED, email is used as the key to map user data for integrations
          name: `${userData?.name.first} ${userData?.name.last}` // RECOMMENDED, name can be used to greet and/or personalize content: ;
        });

        if (isProduction) {
          posthog.identify(userData?._id, {
            email: userData?.email,
            name: `${userData?.name.first} ${userData?.name.last}`
          });
        }
      }
      userData && fetchUserDocuments(userData._id);
    }
    /* eslint-disable */
  }, [isAuthenticated, posthog]);

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
          <ShepherdSpinner />
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
            unAuthenticated={
              <RedirectToExternal url="https://shepherd.study/" />
            }
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
      <Route path="feedback" element={<Feedback />} />
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
        path="/dashboard/notes/new-note/:id"
        element={
          <DashboardLayout>
            <NewNote />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/flashcards/:flashcardId"
        element={
          <DashboardLayout>
            <FlashCard />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/docchat"
        element={
          <DashboardLayout>
            <DocChat />
          </DashboardLayout>
        }
      />

      <Route
        path="/dashboard/ace-homework/:id"
        element={
          <Suspense fallback={<ShepherdSpinner />}>
            <DashboardLayout>
              <HomeWorkHelp />
            </DashboardLayout>
          </Suspense>
        }
      />
      <Route
        path="/dashboard/quizzes/take"
        element={
          <DashboardLayout>
            <TakeQuizzes />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/find-tutor/tutor/"
        element={
          <DashboardLayout>
            <Tutor />
          </DashboardLayout>
        }
      />

      <Route
        path="/dashboard"
        element={
          <Suspense fallback={<ShepherdSpinner />}>
            <RequireAuth
              authenticated={<RenderLayout />}
              unAuthenticated={<Navigate to={'/login'} />}
            />
          </Suspense>
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

export default AppRoutes;
