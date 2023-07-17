import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Box } from '@material-ui/core';
import ProfileModal from './ProfileModal';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          {/* <CloseIcon /> */}
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function TaskinfoModal({task}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant='outlined' size="small" sx={{height:'2rem',width:'6rem'}} onClick={handleClickOpen}> {task.completed?<p style={{color:'green'}}>Completed</p>:(new Date(Date.now())>new Date(task.deadline))?<p style={{color:'red'}}>Due</p>:<p style={{color:'yellow'}}>Pending</p>} </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" variant="h4" onClose={handleClose}>
          {task.title}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <p >
            <span style={{fontWeight:'bold'}}>Description: </span><p style={{overflowY:'scroll',height:'10rem',width:'100%'}}>{task.description}</p>
          </p>
          <Typography variant='h9' gutterBottom>
            <span>CreatedAt: </span>{`${new Date(task.createdAt).toLocaleString().split(',')[0]}`}
          </Typography>
          <br/>
          <Typography variant='h7' gutterBottom>
            <span>Deadline: </span>{`${new Date(task.deadline).toLocaleString().split(',')[0]}`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Box>
            <span style={{fontWeight:'bold'}}>AssignedBy </span><ProfileModal user={task.admin} />
          </Box>
          &nbsp;
          <Box>
            <span style={{fontWeight:'bold'}}>AssignedTo </span><ProfileModal user={task.assignedto} />
          </Box>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
