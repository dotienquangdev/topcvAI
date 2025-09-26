import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NavController = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Kết nối Server-Sent Events
        const eventSource = new EventSource('http://localhost:5001/navigate');
        
        eventSource.onmessage = (event) => {
            const path = event.data.trim();
            if (path && path !== '/') {
                console.log('Navigate to:', path);
                navigate(path);
            }
        };

        return () => eventSource.close();
    }, [navigate]);

    return null; // Component không render gì
};

export default NavController;
