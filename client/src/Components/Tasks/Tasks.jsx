import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/TaskProvider';
import Table from './Table';
import Createtask from './Createtask';
import { Box, Button, Container, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from '@material-ui/core';
import axios from 'axios';
import { Stack } from '@mui/material';
import Dashboard from '../Dashboard/Dashboard';
import Buffer from '../utils/Buffer';
import SkeletonR from '../utils/SkeletonR';

const Tasks = () => {

  const [fetchAgain,setFetchagain]= useState(false);


  var {user,tasks,setTasks,Navigate} =ChatState();
  const [title,setTitle]= useState("")
  const [searchQuery,setSearchQuery]=useState("");
  const [searchResults,setSearchResults]=useState([]);
  const [textDisable,setTextDisable]=useState(false);
  const [targetId,setTargetId]=useState();
  const [sortby,setSortby]=useState('');
  const [toggle,setToggle]= useState(false);
  const [loading,setLoading] = useState(true);
  const [getusersloading,setGetusersloading]= useState(false);
  const [taskstatus,setTaskstatus]= useState('NA');
  const RadioOptions=['INCOMPLETE','COMPLETE','NA'];


  const sortingMenu=[{value:'SORT_TITLE_DES',name:'Title(desc.)'},{value:'SORT_TITLE_ASC',name:'Title(asc.)'},{value:'SORT_USER_DES',name:'username(des.)'},{value:'SORT_USER_ASC',name:'username(asc.)'},{value:'SORT_CREATED_DES',name:'Newest first'},{value:'SORT_CREATED_ASC',name:'Older first'},{value:'SORT_DEADLINE_DES',name:'Deadline(desc.)'},{value:'SORT_DEADLINE_ASC',name:'Deadline(asc.)'}]

  const [toggleFilter,setTogglefilter]= useState(false);

  const getTasks=async()=>{
    setLoading(true);
    user = JSON.parse(localStorage.getItem("userInfo"));
    if(!user) return;

    var url='/api/task?';
    if(title.length>0) url=url+`title=${title}&`
    if(user.admin && targetId && targetId.length>0) url=url+`assignedto=${targetId}&`
    else if(targetId && targetId.length>0) url=url+`admin=${targetId}&`
    if(sortby) url=url+`sortby=${sortby}&`
    if(taskstatus===RadioOptions[0]) url=url+`completed=${false}&`
    if(taskstatus===RadioOptions[1]) url=url+`completed=${true}&`

    console.log(url);
    try{
      if(user)
      {
        const config={
          headers:{
            Authorization: `Bearer ${user.token}`
          }
        }
        const {data} = await axios.get(url,config);
        setTasks(data);
        console.log(tasks);
        setLoading(false)
      }

    }catch(error)
    {
      console.log(error)
        console.log(error.response.data.message);
    }

  }

  const getUsers=async (e)=>{
    if(!user) return
    var url=`/api/user?searchQuery=${searchQuery}`;
    console.log(url)
    setGetusersloading(true);
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

  useEffect(()=>{
    getTasks();
    console.log("useeffect");
  },[Navigate,fetchAgain])

  const handleSubmit=(e)=>{
    e.preventDefault();
    getTasks();
  }

  return (
    <>
    <div id="task_page" style={{width:"100%",height:"88.5vh",display:"flex",justifyContent:"space-between"}}>

      <Button variant='outlined' maxWidth='sx' size='small' style={{fontWeight:'bold',color:'#5892ea'}} onClick={()=>setTogglefilter(!toggleFilter)}>{toggleFilter?'Close':'Filter'}</Button>
      { toggleFilter &&
      <Container maxWidth="xs" id="task_page_filter" style={{display:'flex',alignItems:'flex-start',width:'40vh'}} >
        <form style={{display:"flex",flexDirection:"column"}}>
          <br/>
          <Typography variant='h6'>FILTER OPTIONS</Typography>
          <br/>
          <TextField id="outlined-size-small" defaultValue="Small" size="small" label="Title" variant="outlined" value={title} onChange={(e)=>setTitle(e.target.value)} autoComplete='off'/>
          <br/>
           <div style={{}}>
              <TextField id="outlined-size-small" defaultValue="Small" size="small" variant='outlined'  label={(user && user.admin)?"Search Employee":"Search Admin"} value={searchQuery} onChange={handleSearch}  disabled={textDisable} autoComplete='off'/>
              {textDisable && <Button variant='outlined' onClick={clearTarget}>Clear</Button> }
              {getusersloading && <SkeletonR/>}
              {!getusersloading && searchResults.length>0 && 
                <Stack style={{height:"20vh",overflowY:'scroll'}}>
                {searchResults.map((user)=>{
                  const color=(user.admin)?'red':'green';
                  return <Button style={{color:color}} onClick={()=>handleTarget(user)}>{user.username}</Button>
                })}
                </Stack>
              }
           </div>

           <br/>

           {/* <FormControlLabel> */}
              <FormLabel id="demo-controlled-radio-buttons-group">Choose Status</FormLabel>
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
            {/* </FormControlLabel> */}

          <br/>

          <div>
          <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              label="None"
              id="demo-simple-select"
              value={sortby}
              onChange={(e)=>setSortby(e.target.value)}
            >
              <MenuItem value={'None'}>None</MenuItem>
              {sortingMenu.map((menu,index)=>{
                return <MenuItem key={index} value={menu.value}>{menu.name}</MenuItem>
              })}
            </Select>
          </FormControl>
          </Box>
          <br/>
          </div>
          <Button variant='outlined' onClick={handleSubmit}>Apply Changes</Button>
        </form>
      </Container>
      }


      {toggleFilter && <hr/>}




      <Container maxWidth="lg" style={{overflow:"scroll"}}>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          {user && <Createtask fetchAgain={fetchAgain} setFetchagain={setFetchagain}/>}
          {user && <Button variant='outlined' onClick={()=>setToggle(!toggle)}>{toggle?"Open Table":"Open Dashboard"}</Button>}
        </div>
        {loading?<Buffer/>:<>
          {user && !toggle && (tasks && tasks.length>0) && <Table tasks={tasks} fetchAgain={fetchAgain} setFetchagain={setFetchagain}/>}
          {user && toggle && <Dashboard tasks={tasks}/>}
        </>}
      </Container>
    </div>
    </>
  )
}

export default Tasks