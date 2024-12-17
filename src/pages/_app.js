// pages/_app.js
import '../styles/globals.css'; // Ensure this line is included
import React from 'react';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
