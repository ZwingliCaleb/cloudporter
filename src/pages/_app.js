// pages/_app.js
import '../styles/globals.css'; 
import React from 'react';
import Amplify from 'aws-amplify';
import awsconfig from '../src/aws-exports';

Amplify.configure(awsconfig);

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
