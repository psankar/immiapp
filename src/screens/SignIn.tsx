import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import AuthContext from '../context/AuthContext';

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [error, setError] = useState('');

    const handleUsernameChange = (text: string) => {
        setUsername(text);
        validateInputs(text, password);
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        validateInputs(username, text);
    };

    const validateInputs = (username: string, password: string) => {
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
        setIsValid(usernameRegex.test(username) && passwordRegex.test(password));
    };

    const handleSignIn = async () => {
        try {
            const response = await fetch('/signin', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                // handle successful sign in
            } else {
                setError('Invalid username or password');
            }
        } catch (error) {
            setError('Network error');
        }
    };

    const handleForgotPassword = () => {
        // handle forgot password
    };

    return (
        <View>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={handleUsernameChange}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry
            />
            <Button title="Sign In" onPress={handleSignIn} disabled={!isValid} />
            <Text onPress={handleForgotPassword}>Forgot Password?</Text>
            {error ? <Text>{error}</Text> : null}
        </View>
    );
};

export default SignIn;
