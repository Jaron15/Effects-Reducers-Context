import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import { AuthContextProvider } from './store/auth-context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
// AuthContextProvider is wrapping the App component in order to give access to isLoggedIn state management from anywhere in the app
<AuthContextProvider>
<App />
</AuthContextProvider>);
