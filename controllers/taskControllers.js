const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");
const User = require("../models/userModel");
var _=require('lodash')

const createTask = asyncHandler(async (req,res)=>{
    const {title, description, assignedto,deadline,completed} = req.body;

    if(!assignedto || !title || !deadline) {
        res.status(400);
        throw new Error("Missing Employee details or title or days left for deadline")
    }

    

    const admin= await User.findById(req.user._id);
    const employee= await User.findById(assignedto);
    if(!admin || !employee)
    {
        res.status(400)
        throw new Error('Invalid admin or employee');
    }
    if(deadline<=0)
    {
        throw new Error('Enter valid deadline(in days)')
    }

    if(employee.admin){
        throw new Error('Cant Assign Task to Admin')
    }

    if(!admin.admin)
    {
        throw new Error('You are not admin');
    }

    var newTask = {
        admin: admin._id,
        title: _.capitalize(title.trim()),
        assignedto:employee._id,
        completed:completed
    };
    newTask.deadline=new Date((new Date(Date.now()).getTime() + (deadline* 24 * 60 * 60 * 1000)));
    if(description) newTask.description=description;

    try {
        var task= await Task.create(newTask);
        
        task= await User.populate(task, {
            path: "admin assignedto",
            select: "-password"
        })
        
        res.status(201).json(task);

    } catch (error) {
        res.status(400)
        throw new Error(error.message);
    }

});

// http://localhost:5000/api?title=""&assigned=""&
const allTasks= asyncHandler(async (req,res)=>{
    const {title,assignedto,admin,sortby,completed} = req.query;
    // console.log(req.query);
    const options={};
    if(title) options.title={$regex: title, $options: "i"}
    if(assignedto) options.assignedto=assignedto;
    if(admin) options.admin=admin;
    if(req.user.admin) options.admin=req.user._id;
    else options.assignedto=req.user._id;
    if(completed)
    {
        if(completed==='true') options.completed=true;
        if(completed==='false') options.completed=false;
    }

    //sort options
    const sortOptions={
    }
    if(sortby)
    {
        switch(sortby)
        {
            case 'SORT_TITLE_DES':  sortOptions.title=-1;
                break;
            case 'SORT_TITLE_ASC': sortOptions.title=1;
                break;
            case 'SORT_USER_DES': {
                if(req.user.admin)
                {
                    // sortOptions.assignedto={}
                    // sortOptions.assignedto.username=-1;
                    sortOptions['assignedto.username']=-1;
                }
                else
                {
                    // sortOptions.admin={}
                    // sortOptions.admin.username=-1
                    sortOptions['admin.username']=-1;
                }
            }
                break;
            case 'SORT_USER_ASC': {
                if(req.user.admin)
                {
                    // sortOptions.assignedto={}
                    // sortOptions.assignedto.username=1;
                    sortOptions['assignedto.username']=1;
                }
                else
                {
                    // sortOptions.admin={}
                    // sortOptions.admin.username=-1
                    sortOptions['admin.username']=1;
                }
            }
                break;
            case 'SORT_CREATED_DES': sortOptions.createdAt=-1;
                break;
            case 'SORT_CREATED_ASC': sortOptions.createdAt=1;
                break;
            case 'SORT_DEADLINE_DES': sortOptions.deadline=-1;
                break;
            case 'SORT_DEADLINE_ASC': sortOptions.deadline=1;
        }
    }

    // console.log(sortOptions)

    try {
        var tasks= await Task.find(options).populate('admin assignedto', '-password').sort(sortOptions)
        if(sortOptions["assignedto.username"])
            tasks=await tasks.sort((p1,p2)=>(p1.assignedto.username<p2.assignedto.username)?sortOptions["assignedto.username"]*-1:(p1.assignedto.username>p2.assignedto.username)?sortOptions["assignedto.username"]*1:0);
        if(sortOptions["admin.username"])
            tasks=await tasks.sort((p1,p2)=>(p1.admin.username<p2.admin.username)?sortOptions["admin.username"]*-1:(p1.admin.username>p2.admin.username)?sortOptions["admin.username"]*1:0);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(400)
        throw new Error(error);
    }
});

// http://localhost:5000/api/:taskId?
const updateTask=asyncHandler(async(req,res)=>{
    const taskId=req.params.taskId;

    if(!req.user.admin) throw new Error('You are Not admin')
    if(!taskId) throw new Error('taskId is undefined');

    const {title,completed,description,assignedto,deadline} = req.body;
    const updates={};
    // console.log(req.body)

    var count=0;
    if(title) updates.title=_.capitalize(title.trim());
    if(description) updates.description=description;
    if(deadline!=undefined && deadline>0){
        updates.deadline=new Date((new Date(Date.now()).getTime() + (deadline* 24 * 60 * 60 * 1000)))
    }
    if(assignedto)
    {
        const employee= await User.findById(assignedto);
        if(employee && employee.admin===false)
            updates.assignedto=assignedto;
        else if(employee) throw new Error(`task can't be assigned to an admin `)
    }
    if(completed!=undefined)
    {
        if(completed==true) count=1;
        else if(completed==false) count-1;
        updates.completed=completed;
    }
    // console.log(updates);
    try {
        const task= await Task.findByIdAndUpdate(taskId,updates).populate('admin assignedto','-password');
        if(completed!=undefined && completed!=task.completed)
        {
            const employee= await User.findByIdAndUpdate(task.assignedto,{$inc:{tasksdone:count}}, {new: true });
            const admin= await User.findByIdAndUpdate(req.user._id,{$inc:{tasksdone:count}}, {new: true });
        }
        res.status(200).json(task)
    } catch (error) {
        res.status(400)
        throw new Error(error.message);
    }
})

const deleteTask=asyncHandler(async (req,res)=>{
    const {taskId}=req.body;
    // console.log("TaskId to be deleted:",taskId)
    if(!req.user.admin)
    {
        throw new Error('This action is only allowed by Admin');
    }
    try{
        await Task.findOneAndDelete({_id:taskId,admin:req.user._id});

        res.json({message:"Successfully Deleted!"})
    }catch(error)
    {
        console.log(error);
        throw new Error(error.message);
    }
})

module.exports={createTask, allTasks, updateTask, deleteTask};