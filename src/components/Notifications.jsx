import { useState, useEffect } from 'react';
import ExpandableCard from './ExpandableCard';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch the list of notifications from the API
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications');
        const notificationList = await response.json();
        setNotifications(notificationList);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <ExpandableCard
      title="Notifications"
      description="View your latest notifications."
      buttonLabel="Mark All as Read"
      onButtonClick={() => alert('All notifications marked as read!')}
    >
      <div className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Notifications</h2>
        <ul className="space-y-4">
          {notifications.map((notification, index) => (
            <li key={index} className="border border-gray-300 p-2 rounded-md">
              <span className="font-medium text-gray-800">{notification.message}</span>
            </li>
          ))}
        </ul>
      </div>
    </ExpandableCard>
  );
};

export default Notifications;
