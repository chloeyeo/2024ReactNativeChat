import React, {useState} from 'react';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import ChatScreen from './src/components/ChatScreen';
import uuidRandom from 'uuid-random';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [roomId, setRoomId] = useState('');

  // Generate a unique room ID when the component mounts
  React.useEffect(() => {
    const newRoomId = uuidRandom(); // Generate UUID using uuid-random
    setRoomId(newRoomId);
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000' : '#fff',
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {/* Pass roomId to ChatScreen */}
      <ChatScreen roomId={roomId} />
    </SafeAreaView>
  );
};

export default App;
