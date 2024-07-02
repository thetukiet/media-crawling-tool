import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import {User} from "./models/User";
import WebScraping from "./components/WebScraping";
import MediaGallery from "./components/MediaGallery/MediaGallery";
import {MenuLinks} from "./constants/menuConstants";

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userString = localStorage.getItem('user');
        const user : User = userString ? JSON.parse(userString) : null;
        if(token && user){
            setIsAuthenticated(true);
            setUser(user);
        }
    }, []);

    const login = (token: string, user: User | null) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        setIsAuthenticated(true);
        setUser(user)
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={
                    isAuthenticated ? <Navigate to="/home" /> : <Login onLogin={login} />
                } />

                <Route path="/home" element={
                    isAuthenticated ? <Home onLogout={logout} user = {user} /> : <Navigate to="/login" />
                }>
                    <Route index element={<h2>Welcome to Media Scraper</h2>} />
                    <Route path={MenuLinks.WEB_SCRAPING} element={<WebScraping />} />
                    <Route path={MenuLinks.MEDIA_GALLERY} element={<MediaGallery />} />
                </Route>

                <Route path="/" element={<Navigate to="/home/mediagallery" />} />
            </Routes>
        </Router>
    );
};

export default App;