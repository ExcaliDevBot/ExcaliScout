import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "../Navbar/Navbar";
import "./Login.css";


function Login() {
    return (
        <div>
            <Navbar />
            <br/>
            <LoginForm />
        </div>
    );
}

function LoginForm() {
    return (
        <div>
            <h2>Login into your account:</h2>
            <form>
                <label htmlFor="UserName">UserName:</label><br />
                <input type="text" id="fname" name="fname" /><br />
                <br/>
                <label htmlFor="Password">Password:</label><br />
                <input type="text" id="lname" name="lname" />
            </form>
            <br/>
            <button>Login</button>
        </div>
    );
}

export default Login;