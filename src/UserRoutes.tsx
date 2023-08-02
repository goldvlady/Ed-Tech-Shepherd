import TutorDashboardLayout from './components/Layout';
import userStore from './state/userStore';
import StudentSettings from './views/Dashboard/AccountSettings';
import BookmarkedTutors from './views/Dashboard/BookmarkedTutors';
import DocChat from './views/Dashboard/DocChat';
import FlashCard from './views/Dashboard/FlashCards';
import CreateFlashCard from './views/Dashboard/FlashCards/create';
import HomeWorkHelp from './views/Dashboard/HomeWorkHelp';
import Marketplace from './views/Dashboard/Marketplace';
import Messaging from './views/Dashboard/Messaging';
// Import your components
import MyTutors from './views/Dashboard/MyTutors';
import NewNote from './views/Dashboard/Notes/NewNotes';
import Notes from './views/Dashboard/Notes/index';
import Offer from './views/Dashboard/Offer';
import SendTutorOffer from './views/Dashboard/SendTutorOffer';
import Tutor from './views/Dashboard/Tutor';
import DashboardIndex from './views/Dashboard/index';
import DashboardLayout from './views/Dashboard/layout';
import Clients from './views/TutorDashboard/Clients';
import Client from './views/TutorDashboard/Clients/client';
import TutorOffer from './views/TutorDashboard/Offers/TutorOffer';
import TutorOffers from './views/TutorDashboard/Offers/index';
import TutorDashboard from './views/TutorDashboard/index';
import TutorSettings from './views/TutorDashboard/settings';
import { Box, Spinner } from '@chakra-ui/react';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { Navigate, useRoutes, useNavigate, Route } from 'react-router-dom';

// ... other imports
const RequireAuth = ({
  authenticated,
  unAuthenticated
}: {
  authenticated: any;
  unAuthenticated: any;
}) => {
  const {
    fetchUser,
    user: userData,
    fetchNotifications,
    fetchUserDocuments
  } = userStore();
  const [loadingUser, setLoadingUser] = useState(true);

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [obtainedUserAuthState, setObtainedUserAuthState] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(getAuth(), async (user) => {
      setObtainedUserAuthState(true);
      setFirebaseUser(user);

      if (user) {
        fetchUser()
          .then(() => {
            // navigate(
            //   userData?.type.includes('tutor')
            //     ? '/tutordashboard'
            //     : '/dashboard'
            // );
            fetchNotifications();
            fetchUserDocuments();
          })
          .catch((e) => {
            if (user.metadata.creationTime !== user.metadata.lastSignInTime) {
              navigate('/login');
            }
          });
      }
      setLoadingUser(false);
    });
    /* eslint-disable */
  }, []);

  return obtainedUserAuthState && !loadingUser ? (
    firebaseUser && userData ? (
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

// Student specific routes configuration
const studentRoutes = [
  { path: 'new-note', element: <NewNote /> },
  { path: 'tutor/:tutorId/offer', element: <SendTutorOffer /> },
  { path: 'offer/:offerId', element: <Offer /> },
  { path: '/notes', element: <Notes /> },
  { path: '/home', element: <DashboardIndex /> },
  { path: 'docchat', element: <DocChat /> },
  { path: '/find-tutor', element: <Marketplace /> },
  { path: 'find-tutor/tutor/', element: <Tutor /> },
  { path: 'my-tutors', element: <MyTutors /> },
  { path: 'saved-tutors', element: <BookmarkedTutors /> },
  { path: 'messaging', element: <Messaging /> },
  { path: 'account-settings', element: <StudentSettings /> },
  { path: 'ace-homework', element: <HomeWorkHelp /> },
  { path: 'flashcards/create', element: <CreateFlashCard /> },
  { path: 'flashcards', element: <FlashCard /> }
];

// Tutor specific routes configuration
const tutorRoutes = [
  { path: 'tutordashboard', element: <TutorDashboard /> },
  { path: 'tutordashboard/clients', element: <Clients /> },
  { path: 'tutordashboard/offers', element: <TutorOffers /> },
  { path: 'tutordashboard/offers/:id', element: <TutorOffer /> }
  // ... other tutor routes
];

// Layouts based on userType
const userLayouts = {
  student: <DashboardLayout children />,
  tutor: <TutorDashboardLayout children className />
};

// Routes based on userType
const userRoutes = {
  student: studentRoutes,
  tutor: tutorRoutes
};

// This component will detect the user type and render the respective Routes
const UserTypeRoutes = (props: any) => {
  const types = ['tutor', 'student'];
  const userType = types.includes('tutor') ? 'tutor' : 'student';
  // Get the routes and layout based on userType
  const userLayout = userLayouts[userType];
  const userRoute = userRoutes[userType];

  return (
    <Route
      {...props}
      path="/dashboard"
      element={
        userLayout ? (
          <RequireAuth
            authenticated={userLayout}
            unAuthenticated={<Navigate to={'/login'} />}
          />
        ) : (
          <Navigate to={'/login'} />
        )
      }
    >
      {userRoute &&
        userRoute.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
    </Route>
  );
};

export default UserTypeRoutes;
