import React, { useState } from 'react'
import { Grid,Paper, Avatar, TextField, Button, Typography,FormControlLabel, Checkbox} from '@material-ui/core'
import {toast, ToastContainer} from 'react-toastify';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

const Login=({handleChange})=>{
    const [email_username,setLogin] = useState();
    const [password,setPassword]= useState(); 
    const Navigate=useNavigate();

    const handleSubmit= async (e)=>{

        e.preventDefault();
        if(!email_username || !password)
        {
            console.log('Please Enter all fields!');
            toast.warn('Please Enter all fields!', {
                position: toast.POSITION.TOP_RIGHT
            });
            return
        }

        try{
            const config={
                headers:{
                    "Content-Type":"application/json"
                }
            }
            const {data}= await axios.post('/api/user/login',{email_username,password},config);
            console.log(data);

            localStorage.setItem('userInfo',JSON.stringify(data));
            Navigate('/tasks');
        }
        catch(error)
        {
            console.log(error.response.data)
            toast.error(error.response.data.message,{
                position:toast.POSITION.TOP_RIGHT
            });
        }
    }

    const paperStyle={padding :20,height:'auto',width:300, margin:"0 auto"}
    const btnstyle={margin:'8px 0'}
    return(
        <Grid>
        <ToastContainer/>
            <Paper  style={paperStyle}>
                <Grid align='center'>
                    <Typography variant="h2" gutterBottom>
                        Sign In
                    </Typography>
                </Grid>
                <form onSubmit={(e)=>e.preventDefault()}>
                    <TextField label='Username' placeholder='Enter username/Email' fullWidth required value={email_username} onChange={(e)=>setLogin(e.target.value)}/>
                    <TextField label='Password' placeholder='Enter password' type='password' fullWidth required value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <Button type='submit' color='primary' variant="contained" style={btnstyle} fullWidth onClick={handleSubmit}>Sign in</Button>
                </form>
            </Paper>
        </Grid>
    )
}

export default Login;