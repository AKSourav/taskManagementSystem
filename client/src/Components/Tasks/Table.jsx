import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@material-ui/core';
import TaskModal from '../utils/Taskmodal';
import { ChatState } from '../../Context/TaskProvider';
import ProfileModal from '../utils/ProfileModal';
import TaskinfoModal from '../utils/TaskinfoModal';


export default function DenseTable({tasks,fetchAgain,setFetchagain}) {

  var {user}=ChatState();

  return (
    <TableContainer component={Paper} maxWidth="lg">
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>ID(Click to Update)</TableCell>
            <TableCell align="right">Title</TableCell>
            <TableCell align="right">Description&nbsp;</TableCell>
            <TableCell align="right">{user && user.admin?"Assignedto":"Admin"}&nbsp;</TableCell>
            <TableCell align="right">Deadline&nbsp;</TableCell>
            <TableCell align="right">Status(Click for details)&nbsp;</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((row) => (
            <TableRow
              key={row._id}
              // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
              <TaskModal task={row} fetchAgain={fetchAgain} setFetchagain={setFetchagain}/>
              </TableCell>
              <TableCell align="right">{row.title}</TableCell>
              <TableCell align="right" style={{display:'flex',justifyContent:'flex-start'}}><p style={{overflow:"hidden",width:"30vh",height:'8vh'}}>{row.description}</p></TableCell>
              <TableCell align="right">{user && user.admin?<ProfileModal user={row.assignedto}/>:<ProfileModal user={row.admin}/>}</TableCell>
              <TableCell align="right">{`${new Date(row.deadline).toLocaleString().split(',')[0]}`}</TableCell>
              <TableCell align="right"><TaskinfoModal task={row}/></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
