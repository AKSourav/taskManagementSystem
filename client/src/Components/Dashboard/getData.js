const getData=(tasks,user,cb)=>{
    var dat=[]
    tasks.map((task,i)=>{
        var index=-1
        if(dat.length>0 && user.admin) index=dat.findIndex((e)=>e.username==task.assignedto.username);
        if(dat.length>0 && !user.admin) index=dat.findIndex((e)=>e.username==task.admin.username);
        if(index!==-1)
        {
          dat[index].assigned++;
          if(task.completed) dat[index].completed++;
          else dat[index].pending++;
        }
        else
        {
          var e={completed:0,pending:0,assigned:1}
          if(user.admin) e.username=task.assignedto.username
          if(!user.admin) e.username=task.admin.username
          if(task.completed) e.completed++;
          else e.pending++;
          dat=[...dat,e];
        }
      })
      console.log('getData:',dat);
    cb(dat);
}

export default getData