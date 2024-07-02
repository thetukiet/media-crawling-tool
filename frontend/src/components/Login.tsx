import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@material-ui/core';
import { login } from '../services/authService';
import {User} from "../models/User";
import {toastUtil} from "../utils/toastUtil";
import {ToastContainer} from "react-toastify";

interface LoginProps {
    onLogin: (token: string, user: User | null) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const {token, user} = await login(username, password);
        if (token != null) {
            onLogin(token, user);
        } else {
            toastUtil.error('Login failed');
        }
    };

    return (
        <Container maxWidth="xs">
            <ToastContainer position="top-right" autoClose={3000} />
            <Typography variant="h4" align="center">Login</Typography>
            <form onSubmit={handleLogin}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                >
                    Login
                </Button>
            </form>
        </Container>
    );
};

export default Login;