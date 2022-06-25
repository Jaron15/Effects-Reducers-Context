import React, { useState, useEffect, useReducer, useContext, useRef } from 'react';
import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../UI/Input/Input';

const emailReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return {value: action.val, isValid: action.val.includes("@")}
  }
  if (action.type === 'INPUT_BLUR') {
    return {value: state.value, isValid: state.value.includes("@")}
  }
  return {value: '', isValid: false}
};

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
  const [formIsValid, setFormIsValid] = useState(false);
  //useReducers control the form state
  const [emailState, dispatchEmail] = useReducer(emailReducer,
     {value: '', isValid: null});

  const [passwordState, dispatchPassword] = useReducer(passwordReducer,
    {value: '', isValid: null});

    const authCtx = useContext(AuthContext);

    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    // destructure email/passwordstate.isValid into email/passwordIsValid
    const { isValid: emailIsValid } = emailState; 
    const { isValid: passwordIsValid } = passwordState;
  // form validity effect ran everytime the 
  // enteredEmail/Password state is changed
  useEffect(() => {
    // setTimeout makes effect run only after not typing for 500 milliseconds
      const Identifier = setTimeout(() => {
        console.log("Checking for validity!");
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

  const emailChangeHandler = (event) => {
    dispatchEmail({type: 'USER_INPUT', val: event.target.value})

    // setFormIsValid(
    //   emailState.isValid && passwordState.isValid
    // );
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({type: 'USER_INPUT',
     valLen: event.target.value.trim().length,
     val: event.target.value })

    // setFormIsValid(
    //   emailState.isValid && passwordState.isValid
    // );
  };

  const validateEmailHandler = () => {
    dispatchEmail({type: 'INPUT_BLUR',})
  };

  const validatePasswordHandler = () => {
    dispatchPassword({type: 'INPUT_BLUR',})
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      authCtx.onLogin(emailState.value, passwordState.value)
    }
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
