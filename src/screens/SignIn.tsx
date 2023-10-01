import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { AuthContext, AuthContextType } from '../context/AuthContext';

const SignIn = () => {
    const [accountHandle, setAccountHandle] = useState('');
    const [password, setPassword] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [error, setError] = useState('');

    const { login } = useContext<AuthContextType>(AuthContext);

    const handleAccountHandleChange = (text: string) => {
        setAccountHandle(text);
        validateInputs(text, password);
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        validateInputs(accountHandle, text);
    };

    const validateInputs = (accountHandle: string, password: string) => {
        const accountHandleRegex = /^[a-zA-Z0-9]+$/;
        const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
        setIsValid(accountHandleRegex.test(accountHandle) && passwordRegex.test(password));
    };

    const handleSignIn = async () => {
        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                body: JSON.stringify({
                    account_handle: accountHandle,
                    password: password
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                login();
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
                placeholder="AccountHandle"
                value={accountHandle}
                onChangeText={handleAccountHandleChange}
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
