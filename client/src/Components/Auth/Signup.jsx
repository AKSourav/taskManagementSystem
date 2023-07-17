import React, { useState } from 'react'
import { Grid, Paper, Typography, TextField, Button } from '@material-ui/core'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const Signup = () => {

    const [username,setUsername]= useState();
    const [name,setName]= useState();
    const [email,setEmail]= useState();
    const [password,setPassword]= useState();
    const [confirmpassword,setConfirmPassword]= useState();
    const [admin,setAdmin]= useState(false);
    const Navigate=useNavigate();
    
    
    const handleSubmit= async (e)=>{
        
        e.preventDefault();
        if(!username || !name || !email || !password || !confirmpassword )
        {
            toast.warn('Please Enter all fields!', {
                position: toast.POSITION.TOP_RIGHT
            });
            return;
        }
        
        if(password!==confirmpassword)
        {
            return toast.warn('Password and Confirm Password must be same!');
        }
        
        const  credential={username,name,email,password,admin};
        
        const config ={
            headers: {
                "Content-type" : "application/json",
            },
        };
        
        
        try{
            const {data}= await axios.post(
                "/api/user",
                credential,
                config
                );
                
                localStorage.setItem("userInfo",JSON.stringify(data));
                return Navigate('/tasks');
            
        } catch(error) {
            console.log(error.response.data.message);
            toast.error(error.response.data.message, {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }


    const paperStyle = { padding: 20, width: 300, margin: "0 auto" }
    const headerStyle = { margin: 0 }
    return (
        <Grid>
        <ToastContainer/>
            <Paper style={paperStyle}>
                <Grid align='center'>
                    <Typography variant="h2" gutterBottom>
                        Sign Up
                    </Typography>
                    <Typography variant='caption' gutterBottom>Please fill this form to create an account !</Typography>
                </Grid>
                <form>
                    <TextField fullWidth label='Name' placeholder="Enter your name" value={name} onChange={(e)=>setName(e.target.value)} />
                    <TextField fullWidth label='Username' placeholder="Create a username" value={username} onChange={(e)=>setUsername(e.target.value)} />
                    <TextField fullWidth label='Email' placeholder="Enter your email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                    <TextField fullWidth label='Password' placeholder="Enter your password" type='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <TextField fullWidth label='Confirm Password' placeholder="Confirm your password" type='password' value={confirmpassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
                    <FormControlLabel
                        control={<Checkbox name="admin" onChange={(e)=>setAdmin(!admin)}/>}
                        label="Want to Join as an Admin?."
                    />
                    <Button type='submit' variant='contained' color='primary' onClick={handleSubmit} >Sign up</Button>
                </form>
            </Paper>
        </Grid>
    )
}

export default Signup;