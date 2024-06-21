import {useEffect, useState} from 'react';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:9092'; // Replace with your Socket.IO server URL

const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Clean up function to disconnect the socket when component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return socket;
};

export default useSocket;
