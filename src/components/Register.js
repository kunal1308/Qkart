import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [formData, setFormData] = useState({
    username:"",
    password:"",
    confirmPassword:""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = (e) =>{
 const [key,value] =[e.target.name, e.target.value]
  setFormData({...formData, [key]:value})
 }
 

  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  
  const register = async (formData) => {
    // setIsLoading(true)
    console.log(formData)
 if(!validateInput(formData)){
  return
 }
  try{
    setIsLoading(true)
    await axios.post(`${config.endpoint}/auth/register` , {
      username:formData.username,
      password:formData.password}
    )
    setIsLoading(false);
    setFormData({
      username:"",
      password:"",
      confirmPassword:""
    });
    enqueueSnackbar("Registered Successfully",{variant:"success",success:"true", autoHideDuration:5000});
    
    history.push("/login")
    }
     catch(error){
      setIsLoading(false)
      if(error.response && (error.response.status===400)){
        // setIsLoading(false)
        return enqueueSnackbar(error.response.data.message,{variant:"Error", autoHideDuration:5000})
      }else{
        // setIsLoading(false)
        return enqueueSnackbar("Username is already taken", {variant:"Error",success:"false",autoHideDuration:5000})
      }
     }
  };
    
   
  
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  
  const validateInput = (data) => {
    if(!data.username){
      enqueueSnackbar("Username is a required field",{variant:"warning"})
      return false;
    }
    if(data.username.length<6){
      enqueueSnackbar("Username must be at least 6 characters",{
        variant:"warning"
      })
      return false
    }
    if(!data.password){
      enqueueSnackbar("Password is a required field",{
        variant:"warning"
      })
      return false
    } 
    if(data.password.length<6){
      enqueueSnackbar("Password must be at least 6 characters",{
        variant:"warning"
      })
      return false
    }
    if(data.password!==data.confirmPassword){
      enqueueSnackbar("Passwords do not match",{
        variant:"warning"
      })
      return false
      }
      return true
    };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={0.5} className="form">
          <h2 className="title">Register</h2>
          <TextField onChange={handleInput}
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            required
            value={formData.username}
          />
          <TextField onChange={handleInput}
            id="password"
            value={formData.password}
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            required
          />
          <TextField onChange={handleInput}
            id="confirmPassword"
            value={formData.confirmPassword}
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            required
          />

          {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress size={25} color="primary" />
           </Box>
          ) : (
           <Button className="button" variant="contained" onClick={async()=>await register(formData)}>
            Register Now
           </Button>
          )}
          <p className="secondary-action">
            Already have an account?{" "}
             <Link className="link" to="/login">
              Login here
            </Link>
            </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
