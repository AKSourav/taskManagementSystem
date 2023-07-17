import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Container } from '@material-ui/core';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ProfileModal({user}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
        {
            user && 
            <div>
                <Button onClick={handleOpen}>{user.username}</Button>
                <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={style}>
                    <Container  style={{display:'flex',justifyContent:'center'}}>
                        <Typography id="modal-modal-title" variant="h6" component="h2"  style={{fontWeight:'bold'}}>
                        {user.username}
                        </Typography>
                    </Container>
                    <hr/>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <span style={{fontWeight:'bold'}}>_id: </span>{user._id}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <span style={{fontWeight:'bold'}}>username: </span>{user.username}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <span style={{fontWeight:'bold'}}>Name: </span>{user.name}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <span style={{fontWeight:'bold'}}>Email: </span>{user.email}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {user.admin?<span style={{color:'red',fontWeight:'bold'}}>ADMIN</span>:<span style={{color:'green',fontWeight:'bold'}}>Employee</span>}
                    </Typography>
                </Box>
                </Modal>
          </div>
        }
    </>
  );
}