import axios from "axios";
import { useContext, useRef } from "react";
import "./register.css";
import { useHistory } from "react-router";
import { AuthContext } from "../../context/AuthContext";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const isEmail = v=>{
    return /.+@.+\..+/.test(v);
};
const {dispatch,error} = useContext(AuthContext);
  const handleClick = async (e) => {
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else if (email.current.value === '' ) {
      email.current.setCustomValidity("Email is required");
    } else if (username.current.value === '') {
      username.current.setCustomValidity("Username is required");
    } else if (!isEmail(email.current.value)) {
      email.current.setCustomValidity("Invalid email");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axios.post(`${BACKEND_URL}/auth/register`, user);
        history.push("/login");
      } catch (err) {
        dispatch({type: 'REGISTRATION_FAILURE', payload: err.response.data});
      }
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Lamasocial</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Lamasocial.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={e=>e.preventDefault()}>
            <input
              placeholder="Username"
              ref={username}
              className="loginInput"
            />
            <input
              placeholder="Email"
              ref={email}
              className="loginInput"
              type="email"
            />
            <input
              placeholder="Password"
              ref={password}
              className="loginInput"
              type="password"
              minLength="6"
            />
            <input
              placeholder="Password Again"
              ref={passwordAgain}
              className="loginInput"
              type="password"
            />
            <button onClick={handleClick} className="loginButton" type="submit">
              Sign Up
            </button>
            <button onClick={()=>history.push({
              pathname: "/login"
            })} className="loginRegisterButton">Log into Account</button>
            {error && <p style={{color:'red'}}>{error.message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
