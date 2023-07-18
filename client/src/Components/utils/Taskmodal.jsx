import React,{useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {toast,ToastContainer} from 'react-toastify';
import axios from 'axios';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@material-ui/core';
import { ChatState } from '../../Context/TaskProvider';
import { Stack } from '@mui/material';
import SkeletonR from './SkeletonR';

export default function TaskModal({task,fetchAgain,setFetchagain}) {
  var {user,Navigate}=ChatState();
  const [open, setOpen] = React.useState(false);
  const [searchQuery,setSearchQuery]=useState("");
  const [searchResults,setSearchResults]=useState([]);
  const [textDisable,setTextDisable]=useState(false);
  const [targetId,setTargetId]=useState();
  var defaultData={title:"",description:"",assignedto:"",deadline:0,completed:false};
  const [options,setOptions]= useState(defaultData);
  const [taskstatus,setTaskstatus]= useState('NA');
  const [getusersloading,setGetusersloading]= useState(false);

  const RadioOptions=['INCOMPLETE','COMPLETE','NA']
  
  useEffect(()=>{
    if(task)
    {
      const dateNow = new Date(Date.now());
      const dateDealine = new Date(task.deadline);
      var diffTime = Math.abs(dateDealine - dateNow);
      if(diffTime<0) diffTime=0;
      const DaysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setOptions({...options,title:task.title,description:task.description,assignedto:task.assignedto._id,deadline:DaysLeft,completed:task.completed})
    }
  },[])

  const getUsers=async (e)=>{
    setGetusersloading(true);
    if(!user) return
    var url=`/api/user?searchQuery=${searchQuery}`;
    console.log(url)

    try{
      if(user)
      {
        const config={
          headers:{
            Authorization: `Bearer ${user.token}`
          }
        }
        const {data} = await axios.get(url,config);
        setSearchResults(data);
      }

    }catch(error)
    {
      console.log(error)
        console.log(error.response.data.message);
    }
    setGetusersloading(false);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit= async ()=>{
    const user=JSON.parse(localStorage.getItem('userInfo'));
    var url='/api/task/';
    if(task) url=url+task._id;
    console.log(url);

    const body={};
    if(options.title.length>0) body.title=options.title;
    if(options.description.length>0) body.description=options.description;
    if(targetId && targetId.length>0) body.assignedto=targetId;
    if(options.deadline) body.deadline=options.deadline;
    if(taskstatus===RadioOptions[0]) body.completed=false;
    if(taskstatus===RadioOptions[1]) body.completed=true;

    console.log(body);

    try{
      const config={
        headers:{
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      }
        if(task)
        {
            const {data} = await axios.patch(url,body,config);
            toast.success("Success",{
              position: toast.POSITION.TOP_RIGHT
            })
        }
        else
        {
            const {data} = await axios.post(url,body,config);
            data && toast.success("Success", {
              position: toast.POSITION.TOP_RIGHT
            })
        }
      }catch(error)
      {
        toast.error(error.response.data.message, {
          position: toast.POSITION.TOP_RIGHT
        })
        console.log(`Here:`,error.response.data.message);
      }
    setFetchagain(!fetchAgain);
    setOptions({title:"",description:"",assignedto:"",deadline:0,completed:false});
    clearTarget();
    handleClose();
  }

  const handleDelete=async ()=>{
    const url=`/api/task`;
    if(!user)
    {
      Navigate('/');
      return;
    }
    if(!user.admin)
    {
      alert('This Action is only allowed by admin');
      return;
    }
    
    try{
      const config={
        headers:{
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        data:{
          taskId:task._id
        }
      }

      const {data}= await axios.delete(url,config);

      toast.success(data.message,{
        position: toast.POSITION.TOP_RIGHT
      })
      handleClose();
      setFetchagain(!fetchAgain)
    }catch(error)
    {
      console.log(error);
      toast.error(error.response.data.message,{
        position: toast.POSITION.TOP_RIGHT
      })
    }
  }

  const handleSearch=(e)=>{
    setSearchQuery(e.target.value);
    getUsers();
  }

  const handleTarget=(target)=>{
    console.log("handleTarget");
    setSearchQuery(target.username);
    setTargetId(target._id);
    setTextDisable(true);
    setSearchResults([]);
  }

  const clearTarget=()=>{
    setSearchQuery("");
    setTargetId();
    setTextDisable(false);
  }


  return (
    <div>
        <ToastContainer/>
      <Button sx={{ fontSize: { xs: '1rem' } ,height:{xs: '100%', md: '100%'}}} variant="outlined" onClick={handleClickOpen}>
        {(task?task._id:"Create New Task")}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{(task)?"Update Task":"Create Task"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {(task)?`Enter respective Fields to Update(assignedto:${task.assignedto.username})`:"Enter all Fields!"}
          </DialogContentText>
            <form style={{display:"flex",flexDirection:"column"}}>
                <TextField variant="outlined" id="standard-basic" label="Title" value={options.title} onChange={(e)=>setOptions({...options,title:e.target.value})} autoComplete='off'/>
                <br/>
                <div style={{}}>
                    <TextField id="outlined-size-small" defaultValue="Small" size="small" variant='outlined'  label={(user && user.admin)?"Search Employee":"Search Admin"} value={searchQuery} onChange={handleSearch}  disabled={textDisable} autoComplete='off'/>
                    {textDisable && <Button variant='outlined' onClick={clearTarget}>Clear</Button> }
                    {getusersloading && <SkeletonR/>}
                    
                    {!getusersloading && searchResults.length>0 &&
                      <Stack style={{height:"20vh",overflowY:'scroll',maxHeight:'15vh'}}>
                        {searchResults.map((user)=>{
                          const color=(user.admin)?'red':'green'
                          return <Button style={{color:color}} key={user._id} onClick={()=>handleTarget(user)}>{user.username}</Button>
                        })}
                      </Stack>
                    }

                </div>
                <br/>
                <TextField variant="outlined" id="standard-basic" label="Description" value={options.description} onChange={(e)=>setOptions({...options, description:e.target.value})} autoComplete='off'/>
                <br/>
                <TextField variant="outlined" id="standard-basic" type='number' label="Deadline(in Days)" value={options.deadline} onChange={(e)=>setOptions({...options, deadline:e.target.value})} autoComplete='off'/>
                <br/>
                <FormControl>
                  <FormLabel id="demo-controlled-radio-buttons-group">Action</FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={taskstatus}
                    onChange={(e)=>setTaskstatus(e.target.value)}
                  >
                    <FormControlLabel value='NA' control={<Radio />} label="None" />
                    <FormControlLabel value='COMPLETE' control={<Radio />} label="Complete" />
                    <FormControlLabel value='INCOMPLETE' control={<Radio />} label="Incomplete" />
                  </RadioGroup>
                </FormControl>
            </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {task && user && user.admin && <Button variant='contained' style={{backgroundColor:'red'}}  onClick={handleDelete} >Delete</Button>}
          <Button onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
