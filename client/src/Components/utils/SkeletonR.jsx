import * as React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export default function SkeletonR() {
  return (
    <Box sx={{ width: "100%" }}>
      <Skeleton animation="wave" sx={{ height: "5vh" }} />
      <Skeleton animation="wave" sx={{ height: "5vh" }} />
      <Skeleton animation="wave" sx={{ height: "5vh" }} />
      <Skeleton animation="wave" sx={{ height: "5vh" }} />
    </Box>
  );
}