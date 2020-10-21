const handleError = (error, setError) => {
    switch (error.code) {
        case "auth/email-already-in-use":
            setError('User is already registered');
            break;
        case "auth/weak-password":
            setError('Password should be at least 6 characters');
            break;
        case "auth/user-not-found":
            setError('User not registered');
            break;
        case "auth/wrong-password":
            setError('Password is incorrect');
            break;
        case "auth/invalid-email":
            setError('Invalid e-mail format');
            break;
        case "auth/popup-closed-by-user":
            setError('Google sign-in not finished');
            break;
        default:
            setError('Unhandled error');
            break;
    }
    setTimeout(() => {setError(null)}, 5000)
}

export default handleError;