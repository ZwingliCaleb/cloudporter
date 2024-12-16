import React from 'react';
//import Link from 'next/link';
import { useRouter } from 'next/router';

const HomePage = () => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/upload')
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Title and tagline */}
      <h1 className="text-5xl font-extrabold text-gray-800">Welcome to CloudPorter!</h1>
      <p className="text-2xl mt-4 text-gray-600">Effortlessly interact with AWS services!</p>

      {/* Buttons for navigation */}
      <div className="mt-10 flex">
          <button
           className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all m-4"
           onClick={handleRedirect}
           >
            Upload to S3
          </button>
      </div>
    </div>
  );
}

export default HomePage;
