import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    username:"",
    password:"",
  });
  const [isLoading, setIsLoading] = useState(false);
  const history=useHistory();

  const handleInput = (e) =>{
 const [key,value] =[e.target.name, e.target.value]
  setFormData({...formData, [key]:value})
 }


  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */

  const login = async (formData) => {
    if(!validateInput(formData))return 
    setIsLoading(true)
     try{
      let response=await axios.post(`${config.endpoint}/auth/login` , {
        username:formData.username,
        password:formData.password
      });

      persistLogin(
        response.data
      );
      setFormData({
        usernameL:"",
        password:""
      })
      setIsLoading(false);
      enqueueSnackbar("Logged in successfully",{variant:"success",success:"true", autoHideDuration:5000});
     history.push("/");
    }
     catch(error){
      setIsLoading(false)
      if(error.response && (error.response.status===400)){
      //  setIsLoading(false)
        return enqueueSnackbar(error.response.data.message,{variant:"Error", autoHideDuration:5000})
      }else{
        // setIsLoading(false)
        return enqueueSnackbar( "Something went wrong. Check that the backend is running, reachable and returns valid JSON.", {variant:"Error",success:"false",autoHideDuration:5000})
      }
     }
  };
  

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */

   const validateInput = (data) => {
    if(!data.username){
      enqueueSnackbar("Username is a required field",{variant:"warning"})
      return false;
    }
    if(!data.password){
      enqueueSnackbar("Password is a required field",{
        variant:"warning"
      })
      return false
    } 
    return true
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} _username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  
 const persistLogin = async(response) => {
 
    console.log(response)
    localStorage.setItem("token", response.token)
    localStorage.setItem("username", response.username)
    localStorage.setItem("balance", response.balance)
   
    }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
        <h2 className="">Login</h2>
        <TextField onChange={handleInput}
        id="username"
        value={formData.username}
        label="Username"
        variant="outlined"
        title="Username"
        name="username"
        placeholder="Enter Username"
        fullWidth
        required
      />
      <TextField onChange={handleInput}
        id="password"
        value={formData.passwordassword}
        variant="outlined"
        label="Password"
        name="password"
        type="password"
        fullWidth
        placeholder="Enter your password"
        required
      />
      {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress size={25} color="primary" />
           </Box>
          ) : (
           <Button className="button" variant="contained" onClick={async()=>await login(formData)}>
            Login To Qkart
           </Button>
          )}
          <p className="secondary-action">
           Don't have an account?{" "}
             <Link className="link" to="/Register">
              Register Now
              </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
