import { Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MESSAGES, addDoc, collection, firestore, onSnapshot, query, serverTimestamp, orderBy } from './firebase/Config';
import { useEffect, useState } from 'react';
import { convertFirebaseTimeStampToJS } from './helpers/Functions';
import Constants from 'expo-constants';
import Login from './screens/Login';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const q = query(collection(firestore, MESSAGES), orderBy('created', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tempMessages = []

      querySnapshot.forEach((doc) => {

        const messageObject = {
          id: doc.id,
          text: doc.data().text,
          created: convertFirebaseTimeStampToJS(doc.data().created)
        }

        tempMessages.push(messageObject)
      });

      setMessages(tempMessages);
    });

    return () => {
      unsubscribe()
    }
  }, []);

  const save = async () => {
    const docRef = await addDoc(collection(firestore, MESSAGES), {
      text: newMessage,
      created: serverTimestamp()
    }).catch(error => console.log(error));

    setNewMessage('');
    console.log('Message saved.');
  }


  if (logged) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {
            messages.map((m) => (
              <View style={styles.message} key={m.id}>
                <Text style={styles.messageInfo}>{m.created}</Text>
                <Text>{m.text}</Text>
              </View>
            ))
          }
        </ScrollView>
        <View style={styles.bottomBar}>
          <TextInput
            placeholder='Send message...'
            value={newMessage}
            onChangeText={text => setNewMessage(text)}
          />
          <Button
            title="Send"
            type='button'
            onPress={save}
          />
        </View>
      </SafeAreaView>
    );
  }
  else {
    return (
      <Login setLogin={setLogged} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: '#fff'
  },
  message: {
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10
  },
  messageInfo: {
    fontSize: 12
  },
  bottomBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
  }
});
