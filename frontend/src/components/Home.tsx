import React, {useEffect, useState} from 'react';
import {Link, Outlet, useLocation, useNavigate} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {User} from "../models/User";
import {MenuLinks} from "../constants/menuConstants";
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

interface HomeProps {
    onLogout: () => void;
    user: User | null | undefined;
}

const Home: React.FC<HomeProps> = ({ onLogout, user }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState<string>(MenuLinks.MEDIA_GALLERY);

    useEffect(() => {
        const currentPath = location.pathname.split('/')[2];
        if (currentPath) {
            setActiveMenu(currentPath);
        } else {
            navigate('/home/'+ MenuLinks.MEDIA_GALLERY);
        }
    }, [location, navigate]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <ToastContainer position="top-right" autoClose={3000} />
            {/* Top Panel */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
                backgroundColor: '#2c3e50',
                color: 'white',
            }}>
                <h2 style={{ margin: 0 }}>Simple Web Scraper</h2>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px' }}>{user?.fullName}</span>
                    <FaUser style={{ marginRight: '10px' }} />
                    <button
                        onClick={onLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        <FaSignOutAlt style={{ marginRight: '5px' }} />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ display: 'flex', flex: 1 }}>
                <div style={{
                    width: '200px',
                    backgroundColor: '#34495e',
                    padding: '20px 0',
                }}>
                    <nav>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li>
                                <Link
                                    to={"/home/" + MenuLinks.MEDIA_GALLERY}
                                    onClick={() => setActiveMenu(MenuLinks.MEDIA_GALLERY)}
                                    style={{
                                        display: 'block',
                                        padding: '10px 20px',
                                        color: activeMenu === MenuLinks.MEDIA_GALLERY ? '#3498db' : 'white',
                                        backgroundColor: activeMenu === MenuLinks.MEDIA_GALLERY ? '#2c3e50' : 'transparent',
                                        textDecoration: 'none',
                                        transition: 'background-color 0.3s',
                                    }}
                                >
                                    Media Gallery
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={"/home/" + MenuLinks.WEB_SCRAPING}
                                    onClick={() => setActiveMenu(MenuLinks.WEB_SCRAPING)}
                                    style={{
                                        display: 'block',
                                        padding: '10px 20px',
                                        color: activeMenu === MenuLinks.WEB_SCRAPING ? '#3498db' : 'white',
                                        backgroundColor: activeMenu === MenuLinks.WEB_SCRAPING ? '#2c3e50' : 'transparent',
                                        textDecoration: 'none',
                                        transition: 'background-color 0.3s',
                                    }}
                                >
                                    Web Scraping
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                <div style={{ flex: 1, padding: '20px', backgroundColor: '#ecf0f1' }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};


export default Home;