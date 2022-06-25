import React, {useState, useEffect} from 'react';

// initialize Context 
const AuthContext = React.createContext({
    isLoggedIn: false,
    onLogout: () => {},
    onLogin: (email, password) => {},
});


export const AuthContextProvider = (props) => {
// global isLoggedIn state 
const [isLoggedIn, setIsLoggedIn] = useState(false);

// this effect runs automatically because it has no dependencies defined
// it checks to see if local storage has the isLoggedIn Identifier saved and sets the isLoggedIn state to true if the item exists
useEffect(() => {
    const storedUserLoggedInInfo = localStorage.getItem('isLoggedIn');

    if (storedUserLoggedInInfo === '1') {
      setIsLoggedIn(true);
    }
  })

// the logout handler simply removes the isLoggedIn item (Identifier) from local storage
const logoutHandler = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false)
}

// the login handler sets the item in localstorage to identify that a user is logged in
// after a user is logged in the logoutHandler must be called to remove the item from local storage and set the isLoggedIn state to false  
const loginHandler = () => {
    localStorage.setItem('isLoggedIn', '1');
    setIsLoggedIn(true)
}

// returns a Context Provider that passes in our local functions to be accessible to anything that this provider is wrapped around
// In this case, to provide access globally, what we do is wrap the whole app with AuthContext.Provider in index.js
    return <AuthContext.Provider value={{
        isLoggedIn: isLoggedIn,
        onLogout: logoutHandler,
        onLogin: loginHandler
    }}>{props.children}</AuthContext.Provider>
}

export default AuthContext;