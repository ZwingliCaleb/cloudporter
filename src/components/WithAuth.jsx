import React from 'react';
import { useRouter } from 'next/router';
import Auth from '../services/Auth';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    React.useEffect(() => {
      if (!Auth.isAuthenticated()) {
        router.replace('/login');
      }
    }, []);

    if (!Auth.isAuthenticated()) {
      return null;  // or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
