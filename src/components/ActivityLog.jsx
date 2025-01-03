import { useState, useEffect } from 'react';
import ExpandableCard from './ExpandableCard'; // Adjust the import path as necessary

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Fetch the list of activities from the API
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/activities');
        const activityList = await response.json();
        setActivities(activityList);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <ExpandableCard
      title="Activity Log"
      description="Keep track of recent activities."
      buttonLabel="Refresh Log"
      onButtonClick={() => window.location.reload()}
    >
      <div className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Recent Activities</h2>
        <ul className="space-y-4">
          {activities.map((activity, index) => (
            <li key={index} className="border border-gray-300 p-2 rounded-md">
              <span className="font-medium text-gray-800">{activity.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </ExpandableCard>
  );
};

export default ActivityLog;
