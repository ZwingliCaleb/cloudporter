import { useState, useEffect } from 'react';
import ExpandableCard from './ExpandableCard';

const FileList = () => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch('/api/files');
                
                // Log the raw response to debug the issue
                const responseText = await response.text();
                console.log('Response Text:', responseText);

                // Attempt to parse the response as JSON
                let fileList;
                try {
                    fileList = JSON.parse(responseText);
                } catch (parseError) {
                    throw new Error('Received non-JSON response');
                }

                // Ensure that the parsed result is an array
                if (Array.isArray(fileList)) {
                    setFiles(fileList);
                } else {
                    throw new Error('Parsed response is not an array');
                }
            } catch (error) {
                console.error('Error fetching files:', error);
                setError('Failed to fetch files. Please try again later.');
            }
        };

        fetchFiles();
    }, []);

    return (
        <ExpandableCard
            title="File List"
            description="View all your uploaded files here."
            buttonLabel="Refresh List"
            onButtonClick={() => window.location.reload()}
        >
            <div className="bg-white shadow-md rounded-lg p-8">
                <h2 className="text-2xl font-semibold mb-6 text-center">Uploaded Files</h2>
                {error && <p className="text-red-500">{error}</p>}
                <ul className="space-y-4">
                    {Array.isArray(files) && files.map((file, index) => (
                        <li key={index} className="border border-gray-300 p-2 rounded-md flex justify-between items-center">
                            <span className="font-medium text-gray-800">{file.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </ExpandableCard>
    );
};

export default FileList;
