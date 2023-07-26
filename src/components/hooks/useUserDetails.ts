export interface UserDetails {
  email?: string;
  userId?: string;
  emailVerified?: boolean;
  photoURL?: string;
  uid?: string;
  found: boolean;
}

/**
 * Get parsed user information already saved to the local storage
 *
 * @returns  UserDetails instance
 */
export const useUserDetails = (): UserDetails => {
  const user = sessionStorage.getItem('UserDetails');
  if (!user) {
    return { found: false };
  }
  try {
    const userDetails: UserDetails = JSON.parse(user);
    if (!userDetails.uid) {
      return { found: false };
    }
    return {
      found: true,
      email: userDetails.email,
      userId: userDetails.uid,
      emailVerified: userDetails.emailVerified,
      photoURL: userDetails.photoURL
    };
  } catch (error: any) {
    return { found: false };
  }
};
