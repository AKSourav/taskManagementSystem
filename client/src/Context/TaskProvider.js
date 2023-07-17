import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const TaskProvider = ({ children }) => {

  const [user, setUser] = useState();
  const [selectedTask, setSelectedTask] = useState();
  const [tasks, setTasks] = useState([]);

  const Navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) Navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedTask,
        setSelectedTask,
        tasks,
        setTasks
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default TaskProvider;