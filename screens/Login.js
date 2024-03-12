import { View, Text, TextInput, StyleSheet, Button, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { getAuth, signInWithEmailAndPassword } from '../firebase/Config';
import Constants from 'expo-constants';

export default function Login({ setLogin }) {
    const [user, setUser] = useState('test@foo.com');
    const [password, setPassword] = useState('test2123');

    const login = () => {
        const auth = getAuth();

        signInWithEmailAndPassword(auth, user, password)
            .then((userCredential) => {
                console.log(userCredential.user);
                setLogin(true);
            }).catch((error) => {
                if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                    console.log('Invalid credentials');
                }
                else if (error.code === 'auth/too-many-requests') {
                    console.log('Too many attempts to login');
                }
                else {
                    console.log(error.code + ' ' + error.message);
                }
            });
    }

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.heading}>Login</Text>
                <Text style={styles.field}>Username</Text>
                <TextInput
                    style={styles.field}
                    placeholder='Type email here'
                    value={user}
                    onChangeText={text => setUser(text)}
                />
                <Text style={styles.field}>Password</Text>
                <TextInput
                    style={styles.field}
                    placeholder='Type password here'
                    value={password}
                    onChangeText={text => setPassword(text)}
                />
                <Button
                    style={styles.button}
                    title='Login'
                    type='button'
                    onPress={login}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Constants.statusBarHeight,
        marginLeft: 10,
        marginRight: 10
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 32
    },
    field: {
        fontSize: 16
    },
    button: {
        width: '100%'
    }
});