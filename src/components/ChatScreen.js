import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from 'react-native';
import useSocket from '../clientService/SocketService';

const ChatScreen = ({roomId}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]); // Correct initialization
  const socket = useSocket();
  const scrollViewRef = useRef();

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
        room: roomId,
      });
      setMessage(''); // Clear input after sending message
      // Update sentMessages immutably
      setSentMessages(prevSentMessages => [...prevSentMessages, message]);
      // Scroll to the bottom of ScrollView after sending message
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-end',
          paddingHorizontal: 10,
        }}
        style={{flex: 1}}>
        <View style={styles.messageContainer}>
          {messages.map((msg, index) => (
            <View
              key={`received-message-${index}`}
              style={styles.receivedMessageContainer}>
              <Text style={styles.messageText}>{msg}</Text>
            </View>
          ))}
          {sentMessages.map((message, idx) => (
            <View
              key={`sent-message-${idx}`}
              style={styles.sentMessageContainer}>
              <Text style={styles.messageText}>{message}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
    // paddingBottom: 10,
  },
  messageText: {
    fontSize: 16,
    // marginBottom: 10,
    color: 'black',
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sentMessageContainer: {
    backgroundColor: '#dedede', // Grey background for sent messages
    alignSelf: 'flex-end',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginLeft: 20, // Adjust margin from right screen wall
    maxWidth: '80%', // Maximum width for the bubble
  },
  receivedMessageContainer: {
    backgroundColor: '#dedede', // Grey background for received messages
    alignSelf: 'flex-start',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginRight: 20, // Adjust margin from right screen wall
    maxWidth: '80%', // Maximum width for the bubble
  },
});

export default ChatScreen;
