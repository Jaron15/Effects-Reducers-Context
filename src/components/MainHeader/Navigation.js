import React, {useContext} from 'react';
import AuthContext from '../../store/auth-context';

import classes from './Navigation.module.css';

const Navigation = () => {
  // provide AuthContext to render jsx dynamically
  // using the isLoggedIn and onLogout functions passed in using AuthContextProvider in '../../store/auth-context'
  const ctx = useContext(AuthContext)

  return (

          <nav className={classes.nav}>
          <ul>
            {ctx.isLoggedIn && (
              <li>
                <a href="/">Users</a>
              </li>
            )}
            {ctx.isLoggedIn && (
              <li>
                <a href="/">Admin</a>
              </li>
            )}
            {ctx.isLoggedIn && (
              <li>
                <button onClick={ctx.onLogout}>Logout</button>
              </li>
            )}
          </ul>
        </nav>
   
  );
};

export default Navigation;
