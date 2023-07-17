import React, { useEffect, useState } from 'react'
import ProfileModal from '../utils/ProfileModal';
import { ChatState } from '../../Context/TaskProvider';

const Profile = () => {
  const {user}=ChatState();
  return (
    <>
      { user && <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
        <h5>View Your Profile:</h5>
        <ProfileModal user={user} />
      </div>}
    </>
  )
}

export default Profile