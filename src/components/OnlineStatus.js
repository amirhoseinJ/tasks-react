
import React, { useState, useEffect } from 'react';

function OnlineStatus() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);


    useEffect(() => {
        const intervalId = setInterval(() => {
            setIsOnline(navigator.onLine);
        }, 2000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);



    return (
        <div
            className={`fixed bottom-4 right-4 text-white py-2 px-4 rounded-full ${
            isOnline ? 'bg-green-500' : 'bg-red-500'}`}
            >

            {isOnline ? 'Online':'Offline'}
        </div>
    );
}

export default OnlineStatus;