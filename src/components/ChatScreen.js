import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import useSocket from '../clientService/SocketService';

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Listener for incoming messages
    socket.on('get_message', message => {
      setMessages(prevMessages => [...prevMessages, message.message]);
    });

    // Cleanup function to disconnect socket on unmount
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const sendMessage = () => {
    if (message.trim() !== '') {
      // Emit message to server
      socket.emit('send_message', {
        message: message,
        room: 'a', // Replace with room ID
      });
      setMessage(''); // Clear input after sending message
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.messageContainer}>
        {messages.map((msg, index) => (
          <Text key={index} style={styles.messageText}>
            {msg}
          </Text>
        ))}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flex: 1,
    padding: 10,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});

export default ChatScreen;
