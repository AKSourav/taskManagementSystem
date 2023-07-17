import { Container } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/TaskProvider'
import Appa from '../../Graph/Appa';
import getData from './getData';

const Dashboard = ({tasks}) => {

  const {user} =ChatState();
  // const [user,setUser]=useState();
  const [data,setData]=useState();


  useEffect(()=>{
    user && getData(tasks,user,(dat)=>setData(dat));
    console.log('Dash:',data)
  },[tasks])


  return (
    <Container>
      {data && <Appa data={data}/>}
    </Container>
  )
}

export default Dashboard