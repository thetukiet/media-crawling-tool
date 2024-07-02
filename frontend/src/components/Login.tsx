import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@material-ui/core';
import { login } from '../services/authService';
import { User } from "../models/User";
import { toastUtil } from "../utils/toastUtil";
import { ToastContainer } from "react-toastify";
import styled from 'styled-components';

interface LoginProps {
    onLogin: (token: string, user: User | null) => void;
}

const CenteredContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  text-align: center;
  margin-top: 80px;
`;

const Title = styled(Typography)`
  margin-bottom: 40px !important;
`;

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const { token, user } = await login(username, password);
        if (token != null) {
            onLogin(token, user);
        } else {
            toastUtil.error('Login failed');
        }
    };

    return (
        <CenteredContainer maxWidth="xs">
            <ToastContainer position="top-right" autoClose={3000} />
            <Title variant="h4">Simple Web Scraper</Title>

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
        </CenteredContainer>
    );
};

export default Login;
