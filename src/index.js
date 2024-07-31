import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { UserProvider } from './context/UserContext';
import reportWebVitals from "./reportWebVitals";
import {sendToVercelAnalytics} from "./vitals";

ReactDOM.render(
    <React.StrictMode>
        <UserProvider>
            <App />
        </UserProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
reportWebVitals(sendToVercelAnalytics)