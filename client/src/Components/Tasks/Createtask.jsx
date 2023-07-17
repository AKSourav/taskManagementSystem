import React from 'react'
import TaskModal from '../utils/Taskmodal'

const Createtask = ({fetchAgain,setFetchagain}) => {
  return (
    <TaskModal fetchAgain={fetchAgain} setFetchagain={setFetchagain}/>
  )
}

export default Createtask