import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Welcome to CloudPorter!</h1>
        <p className="text-xl mt-4">Effortlessly interact with AWS services!</p>
        <div className="mt-8">
            <Link href="/upload">
                <button className="bg-blue-500 text-white px-6 py-2 rounded m-2">
                    Upload to S3
                </button>
            </Link>
            <Link href ="/submit">
                <button className="bg-green-500 text-white px-6 py-2 rounded m-2">
                    Submit Data
                </button>
            </Link>
        </div>
    </div>
  )
}

export default HomePage