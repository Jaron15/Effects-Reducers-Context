import React, { useState, useEffect, useReducer, useContext, useRef } from 'react';
import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../UI/Input/Input';

// when dispatchEMail or dispatchPassword is called the corresponding reducer function is called 
// based on the type that is passed in, one of the if statements will be executed setting setting the form state objects values  
const emailReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return {value: action.val, isValid: action.val.includes("@")}
  }
  if (action.type === 'INPUT_BLUR') {
    return {value: state.value, isValid: state.value.includes("@")}
  }
  return {value: '', isValid: false}
};

// the USER_INPUT action takes the current user input from a field to assign values with onChange (whenever a field is edited)
// the INPUT_BLUR action refers to the state for values and is called with onBlur (whenever a user clicks out of a field) 
const passwordReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return {value: action.val, isValid: action.valLen > 6}
  }
  if (action.type === 'INPUT_BLUR') {
    return {value: state.value, isValid: state.valLen > 6}
  }
  return {value: '', isValid: false}
};


const Login = (props) => {
  // form validity state
  const [formIsValid, setFormIsValid] = useState(false);

  // useReducers control the form state
  const [emailState, dispatchEmail] = useReducer(emailReducer,
     {value: '', isValid: null});

  // The first argument passed in (passwordReducer in the example below) is an updating function called on with dispatch (dispatchPassword below)
  // and defined above, outside of Login()
  const [passwordState, dispatchPassword] = useReducer(passwordReducer,
    {value: '', isValid: null});

    // establishing a connection to the Context API found in '../../store/auth-context'
    const authCtx = useContext(AuthContext);

    // creates references to each input
    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    // destructure email/passwordState.isValid from email/passwordState, set by reducer function, into email/passwordIsValid variable
    const { isValid: emailIsValid } = emailState; 
    const { isValid: passwordIsValid } = passwordState;


  // form validity effect ran everytime the [emailIsValid, passwordIsValid] dependencies are changed
  useEffect(() => {
    // setTimeout makes effect run only after not typing for 500 milliseconds
      const Identifier = setTimeout(() => {
        console.log("Checking for validity!");
        // sets setFormIsValid to true if email and password are valid as set by useReducers
        setFormIsValid(
          emailIsValid && passwordIsValid
        );
      }, 500);
  //(cleanup function) Resets timeout timer everytime effect is ran [dependencies]
      return () => {
        clearTimeout(Identifier)
        console.log('CLEANUP');
      };
    }, [emailIsValid, passwordIsValid])

 
    // this is where we call on the dispatch functions defined above and pass in the type of action
    const emailChangeHandler = (event) => {
    dispatchEmail({type: 'USER_INPUT', val: event.target.value})

  };
  // these action types are USER_INPUT because that is what were targeting 
  // they will be called with onChange therefore updating consistently to catch any user input (i.e. the name changeHandler)
  const passwordChangeHandler = (event) => {
    dispatchPassword({type: 'USER_INPUT',
     valLen: event.target.value.trim().length,
     val: event.target.value })

  };


  // the validate handlers are INPUT_BLUR action types as they are called with onBlur meaning when a user clicks outside of the given field
  const validateEmailHandler = () => {
    dispatchEmail({type: 'INPUT_BLUR',})
  };

  const validatePasswordHandler = () => {
    dispatchPassword({type: 'INPUT_BLUR',})
  };

  // onSubmit we use the Context brought in to use the onLogin function if the formIsValid state is true
  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      authCtx.onLogin(emailState.value, passwordState.value)
    }
    // if its not true than we check the email and password validity in that order and if one is not valid 
    // it is highlighted using the focus function targeted by defined input refs
    else if (!emailIsValid) {
      emailInputRef.current.focus();
    }
    else {
      passwordInputRef.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
       <Input
       ref={emailInputRef}
       id="email"
       label="E-Mail" 
       type="email" 
       isValid={emailIsValid} 
       value={emailState.value} 
       onChange={emailChangeHandler} 
       onBlur={validateEmailHandler}
       />
      <Input 
      ref={passwordInputRef}
      id="password"
      label="Password" 
      type="password" 
      isValid={passwordIsValid} 
      value={passwordState.value} 
      onChange={passwordChangeHandler} 
      onBlur={validatePasswordHandler}
      />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} >
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
