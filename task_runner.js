const prompt = require("prompt-sync")();

class task_runner{

    eventQueue = [];

    currentRunning = -1;

    add_task= function(task){
        this.eventQueue.push(task);
        if(this.currentRunning == -1){
            this.execute_task(this.eventQueue[0]);
        }
    };
    remove_task = function(id){
        for(let idx in this.eventQueue){
            if(this.eventQueue[idx].id == id){
                this.eventQueue.splice(idx, 1);
                break;
            }
        }
        console.log("Sorry function with given id not found!!");
    };
    print_pending_tasks = function(){
        let str = "";
        if(this.eventQueue.length == 0){
            console.log("No pending tasks");
        }
        for(let task of this.eventQueue){
            str += task.id;
        }
        console.log("List of pending tasks are " + str);
    };
    print_running_task = function(){
        console.log(this.currentRunning == -1? "No current Running Tasks":`Current Running Task is ${this.currentRunning}`);
    };
    execute_task = function(task){
        let prom = task.task;
        let id = task.id;
        this.currentRunning = id;
        this.eventQueue.shift();
        prom.then((val)=>{
            console.log(`Function execution complete, value returned is `,val);
            this.currentRunning = -1;
            if(this.eventQueue.length != 0){
                this.execute_task(this.eventQueue[0]);
            }
        })
    }   

}

//example task
function foo(a,ms){
    return new Promise((resolve)=> setTimeout(()=> resolve(a), ms));
}


const obj = new task_runner;
// obj.add_task({task: foo(10,1000), id: 100});
// obj.add_task({task: foo(12,3000), id: 30});
// obj.add_task({task: foo(31, 0), id: 120});


function command_menu(){
    console.log(`
    1 for addTask
    2 for removeTask
    3 for printPendingTasks
    4 for printCurrentRunningTask
    `)
    const input = prompt("Enter your choice");
    switch(input){
        case '1':
            const val = prompt("Enter val of function");
            const t = prompt("Enter delay time");
            const id = prompt("Enter id of function");
            obj.add_task({task: foo(val, t), id: id});
            break;
        case '2':
            const inp = prom("Enter id of function to be removed");
            obj.remove_task(inp); 
            break;
        case '3':
            obj.print_pending_tasks(); 
            break;
        case '4': 
            obj.print_running_task();
            break;
    }
}

function event_loop(){
    // if(obj.currentRunning == -1 && obj.eventQueue.length>0){
    //     obj.execute_task(obj.eventQueue[0]);
    // }
    setTimeout(command_menu, 0);
    setTimeout(event_loop, 0);
}
event_loop();

