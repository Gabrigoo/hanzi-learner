const getErrorMessage = (code: string | undefined): string => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'E-mail is already registered';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/user-not-found':
      return 'User not registered';
    case 'auth/too-many-requests':
      return 'Too many requests, please wait';
    case 'auth/wrong-password':
      return 'Password is incorrect';
    case 'auth/invalid-email':
      return 'Invalid e-mail format';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in not finished';
    case 'auth/account-exists-with-different-credential':
      return 'Account already exists with a different credential. You can still link your accounts.';
    default:
      alert(`Unhandled error:${code}`);
      return 'Unhandled error';
  }
};

export default getErrorMessage;
