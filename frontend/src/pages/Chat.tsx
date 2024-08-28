import React from 'react'
import {Box, Typography, Avatar} from '@mui/material'
import { useAuth } from '../context/AuthContext';
const Chat = () =>{
    const auth = useAuth();
    return <Box sx={{display:'flex',flex:1,width:'100%',height:"100%",mt:3,gap:3}}>
        <Box sx={{display:{md:"flex",xs:"none", sm: "none"}}}>
            <Box sx={{display:"flex",width:"100%",height:"60vh",bgcolor:"rgb(17,29,39)",borderRadius:5,flexDirection:'column',mx:3}}>
                <Avatar sx={{mx:"auto",my:2,bgcolor:'white',color:'black',fontWeight:700,}}>{auth?.user?.name[0]}{auth?.user?.name.split("")[1][0]}</Avatar>
                <Typography sx ={{mx:'auto',fontFamily:"work sans"}}>
                    You are talking to a ChatBot!
                </Typography>
                <Typography sx ={{mx:'auto',fontFamily:"work sans", my: 4 , p:3}}>
                    You can ask it any questions related to Business, Education, Concepts , Facts, and many more. However, avoid sharing your personal information and sensitive data.
                </Typography>
            </Box>
        </Box>
    </Box>
}

export default Chat
