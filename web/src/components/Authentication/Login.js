import React from 'react';
import {GoogleLogin} from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";

function Login({setUser}) {
    const onSuccess = (res) => {
        var tokenData = jwtDecode(res.credential);
        var loginData = {
            googleId: tokenData.sub,
            ...tokenData
        }
        setUser(loginData);
        localStorage.setItem("login", JSON.stringify(loginData));
    };

    const onFailure = (res) => {
        console.error("Login failed: res:", res);
    };

    return (
        <div>
            <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                id='login'
                buttonText="Login"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                style={{marginTop: "100px"}}
                isSignedIn={true}
                auto_select={true}
            />
        </div>
    );
}

export default Login;