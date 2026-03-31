// Declaring All variable 
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const username = JSON.parse(localStorage.getItem('currentUser')) || null
const taskTitle = document.getElementById('title')
const taskDescription = document.getElementById('description')
const taskPriority = document.getElementById('priority')
const taskDueDate = document.getElementById('due-date')
const taskTime = document.getElementById('time')
const formData  =  [taskTitle , taskDescription , taskPriority , taskDueDate , taskTime]
const taskCreationBtn = document.getElementById('popup-submit')
const resetButton = document.getElementById('reset-button')
const main = document.querySelector('main')
const todayTaskContainer = document.getElementById('todo-list-today');
const weekTaskContainer = document.getElementById('todo-list-week');
const monthTaskContainer = document.getElementById('todo-list-month');
const todaysProgress = document.getElementById('today-progress')
const weeksProgress = document.getElementById('week-progress')
const monthProgress = document.getElementById('month-progress')
const todayPercentage = document.getElementById('todays-precentage')
const todayCompleted = document.getElementById('today-completed')
const todayPending = document.getElementById('today-pending')
const weekPercentage = document.getElementById('week-precentage')
const weekCompleted = document.getElementById('week-completed')
const weekPending = document.getElementById('week-pending')
const monthPercentage = document.getElementById('month-precentage')
const monthCompleted = document.getElementById('month-completed')
const monthPending = document.getElementById('month-pending')
const taskHeaderProgressMonth = document.getElementById('task-progress-month')
const taskHeaderProgressDay = document.getElementById('task-progress-today')
const taskHeaderProgressWeek = document.getElementById('task-progress-week')
const taskCards = document.querySelectorAll('.todo-card')
const editBtn = document.getElementById('edit-button')
const userImg = document.getElementById('user-image')
const previousButton = document.getElementById('prev')
const nextButton = document.getElementById('next')
const taskPopUpElement  =  document.getElementById('create-task')
const closeButton = document.getElementById('close-button')
const cat = ['today' , 'week' , 'month']
const rightIcon = `<i class="fa-regular fa-circle-check"></i>`
const icons = {today: 'fa-calendar-day',week: 'fa-calendar-week',month: 'fa-calendar'};
const STATUS = {
    SUCCESS: "success",
    FAIL: "fail"
};
const PRIORITY = {
    HIGH : 'high',
    MEDIUM :'medium' ,
    LOW :'low'
}

const CATAGORY = {
    TODAY :'today' , 
    MONTH : 'month' , 
    WEEK : 'week'
}




let editable = true;
let today = new Date()
let todayTask = []
let weekTask =[]
let monthTask = [] 
let category = 'today'
let currentTaskId =  ''



const changeDateUpdate  = async (date) =>{
    // Chnage the calender date 
    today = new Date(today.getFullYear() , today.getMonth() , date)
    renderCalender(today)
    await refreshAll()

}




//Notification function
const notification = (message, status) => {
    const div = document.createElement("div");
    div.className = "notification";

    div.innerHTML = `
        <h2 class="notification-message ${status}" style='background:none;'>${message}</h2>
        <div class="progress-bar ${status}"></div>
    `;

    main.appendChild(div);

    setTimeout(() => {
        div.remove();
    }, 5000);
};




//Update the current day tags 

// Getting the Week Details 
const getFullweekStartAndEnd = (date) => {
    const start = date.getDate() - date.getDay();
    let end = start + 6;
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    // Check weather its a month end
    if (end > daysInMonth) {
        const nextMonthDays = end - daysInMonth;
        return {
            startDate: new Date(date.getFullYear(), date.getMonth(), start),
            endDate: new Date(date.getFullYear(), date.getMonth() + 1, nextMonthDays)
        };
    }
    
    return {
        startDate: new Date(date.getFullYear(), date.getMonth(), start),
        endDate: new Date(date.getFullYear(), date.getMonth(), end)
    };
};

// get cuurent Month tag 
const currectMonthCard = document.getElementById('current-month')
// Get the current week paragraph tag
const currentWeekCard = document.getElementById('current-week')
// Get the currect day 
const currentDayCard = document.getElementById('current-day')
const UpdateCurrentDay = (today)=>{
    currentDayCard.innerText = `${today.getDate()}` + ` ${months[today.getMonth()]}` + ` ${today.getFullYear()}`
}

const UpdateCurrectMonth = (today)=>{
    currectMonthCard.innerText =   months[today.getMonth()] + " " + today.getFullYear()
}

const UpdateCurrentWeek = (today) =>{
    let weekDeatils = getFullweekStartAndEnd(today)
    // Change the current Week
    currentWeekCard.innerText = weekDeatils.startDate.getDate() + ` ${months[weekDeatils.startDate.getMonth()].substring(0,3)} - ` + weekDeatils.endDate.getDate() + ` ${months[weekDeatils.endDate.getMonth()].substring(0,3)}  `
}



// Previous button of the calendar
previousButton.addEventListener('click', () => {
    today = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    renderCalender(today)
    UpdateCurrectMonth(today)
    UpdateCurrentDay(today)
    UpdateCurrentWeek(today)
})
//Netx button of the calender 
nextButton.addEventListener('click', () => {
    today = new Date(today.getFullYear(), today.getMonth() + 1, 1)
    renderCalender(today)
    UpdateCurrectMonth(today)
    UpdateCurrentDay(today)
    UpdateCurrentWeek(today)
})

// User profile in navbar 
userImg.addEventListener('click' ,()=> {
    globalThis.location.href = '/html/home.html'
})
// Logout in navbar
const logout  = ()=>{
    localStorage.removeItem("currentUser")
    globalThis.location.href = '/html/index.html'
}



// User DB connection
const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("UserDB", 1);

        request.onupgradeneeded = (e) => {
            const db = e.target.result;

            if (!db.objectStoreNames.contains("users")) {
                db.createObjectStore("users", { keyPath: "username" });
            }
        };

        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(new Error(e));
    });
};
// Get user from database
const getUser = async ()  =>{

    try {
         const db = await openDB();

        const tx = db.transaction("users", "readonly");
        const store = tx.objectStore("users");

        const user = await new Promise((resolve, reject) => {
            const request = store.get(username);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(new Error("Error fetching user"));
        
        
        
        });
        userImg.src =  URL.createObjectURL(user.profileImage);
    
    }
        catch(e){
            notification("Error Reload again" + e , STATUS.FAIL)
        }
}




// Create task object 
function createTask({id=crypto.randomUUID(), title, description, priority, date, time, category, createdBy , started = false }) {
     return {
        id: id,

        content: {
            title: title.trim(),
            description: description.trim()
        },

        schedule: {
            date,
            time,
            type: category 
        },

        priority: {
            level: priority 
        },

        status: {
            started :  started,
            completed: false,
            completedAt: null
        },
        metadata: {
            createdAt: new Date(),
            updatedAt: null ,
            createdBy : createdBy
        }
    };
}




// Task DB connection 
const openTaskDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("TaskDB", 1); 

        request.onupgradeneeded = (e) => {
            const db = e.target.result;

            let store;
            if (db.objectStoreNames.contains("tasks")) {
                store = e.target.transaction.objectStore("tasks");
            } else {
                store = db.createObjectStore("tasks", { keyPath: "id" });
            }

            
            if (!store.indexNames.contains("createdBy")) {
                store.createIndex("createdBy", "metadata.createdBy", { unique: false });
            }
        };

        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(new Error(e));
    });
};

//Adding Task to the database 
const addTaskDatabase =async (taskData) =>{
    try {
    const db = await openTaskDB()
    const tx = db.transaction('tasks' ,  'readwrite')
    const store = tx.objectStore('tasks')

    store.put(taskData)
    tx.oncomplete = () => { 
            return true
        };

    tx.onerror = () => {
            
            notification("Error : Try again" , STATUS.FAIL)
            return false
    };}
    catch{
        notification("Error : Try again" , STATUS.FAIL)
        return false
    }

}
const getTaskDatabase = async () => {
    try {
        const db = await openTaskDB();
        const tx = db.transaction('tasks', 'readonly');
        const store = tx.objectStore('tasks');

        const tasks = await new Promise((resolve, reject) => {
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(new Error("Fetch Error"));
        });

        return tasks;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
};


// Get data by username 
const getTasksByUsername = async (username) => {
    try {
        const db = await openTaskDB();
        const tx = db.transaction("tasks", "readonly");
        const store = tx.objectStore("tasks");

        const index = store.index("createdBy");

        const tasks = await new Promise((resolve, reject) => {
            const request = index.getAll(username);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(new Error("Error fetching by username"));
        });

        return tasks;
    } catch (err) {
        console.error(err);
        return [];
    }
};


// Deleteing the task based on the taskId

const deleteTaskByTaskId = async (taskId)=>{
    try {
        const db = await openTaskDB()
        const tx = db.transaction('tasks' , 'readwrite')
        const store = tx.objectStore('tasks')


        await new Promise((resolve , reject) =>{
            const request = store.delete(taskId);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(new Error("Error fetching Task"));
        })
        notification("Deleted Successfully")

    }catch{
        notification('Internal Error' , STATUS.FAIL)
      
    }
}


// Updating the Status 
const UpdateStatusDB = async({id , status})=>{
  
    try {
        const db = await openTaskDB()
        const tx = db.transaction('tasks' , 'readwrite')
        const store = tx.objectStore('tasks')


        const task = await new Promise((resolve , reject) =>{
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(new Error("Error fetching Task"));
        })
        
     
        // Updated int states 
        task.status.completed = status
        if(status){
            task.status.completedAt = new Date()
        }else {
            task.status.completedAt = null
        }
        
        task.metadata.updatedAt = new Date()

         // Adding to the database 
        await new Promise((resolve , reject)=>{
            const req = store.put(task)
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(new Error("Fetch Error"));
        })
        return task.schedule.type
    }catch{
        return null;
    }

}

// Get the task by ID

const getTaskById = async(taskId)=>{
    try {
        const db = await openTaskDB();
        const tx = db.transaction('tasks', 'readonly');
        const store = tx.objectStore('tasks');

        const tasks = await new Promise((resolve, reject) => {
            const request = store.get(taskId);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(new Error("Fetch Error"));
        });

        return tasks;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}



// Get the task count  based on date - 0 - 3 
const getAllTaskCalender = async(date )=>{
    try {
        const db = await openTaskDB()
        const tx = db.transaction('tasks' , 'readonly')
        const store = tx.objectStore('tasks')
        const index = store.index("createdBy");

        const tasks = await new Promise((resolve, reject) => {
            const request = index.getAll(username);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(new Error("Error fetching by username"));
        });

        const taskCountByDay = tasks.reduce((acc, task) => {
                const taskDate = new Date(task.schedule.date);                    
                        if (taskDate.getMonth() === date.getMonth() && taskDate.getFullYear() === date.getFullYear()) {
                            const day = taskDate.getDate();

                            acc[day] = (acc[day] || 0) + 1;
                        }

                        return acc;
                    }, {});
        return taskCountByDay;
    }
    catch{
        return []
    }
}


// Render the calender 
const renderCalender = async (date)=>{
    const allTaskDate =  await getAllTaskCalender(date)
    const days = document.getElementById('day')
    const startDay = new Date(date.getFullYear() , date.getMonth() , 1).getDay()
    const currectYear = document.getElementById("current")
    const today = new Date()
    days.innerHTML = ''
    
    const endDay = new Date(date.getFullYear() , date.getMonth()+1 , 0).getDate()
    let previousMonthDays =  new Date(date.getFullYear() , date.getMonth() , 0).getDate()
    currectYear.innerText = months[date.getMonth()] + ' ' + date.getFullYear()
    // Dates before the month
    for(let i = startDay ; i>0 ; i--){
    
        const div = document.createElement('div')
        
        div.textContent = previousMonthDays - i + 1
        div.className = 'previous'
        days.append(div)
    }

    // Date of the month 
    for(let i =1 ;i<=endDay ; i++){
       
        const div = document.createElement('div')
        div.addEventListener('click' ,()=>{
            changeDateUpdate(i)
           
        })
        
        div.textContent =  i 
        div.className =  'text-day'
        
        if (i === today.getDate() &&date.getMonth() === today.getMonth() &&date.getFullYear() === today.getFullYear())  {
        div.classList.add('current')
    }
        if(i==date.getDate() ){
        div.className =  'selected'
        }
        if(allTaskDate[i]){
            div.classList.add(`day-${Math.min(allTaskDate[i], 3)}`)
        }
        days.append(div)
    }
    // Days after the month 
   const nextDays = 42 - (startDay + endDay);
    for (let i = 1; i <= nextDays; i++) {
        const div = document.createElement('div');
        div.textContent = i;
        div.className = 'previous'
        days.append(div);
    }
}
//Pop up to comfirm delete the task 
const openAndCheck = () =>{
    return new Promise((resolve) => {
        const div = document.createElement('div');
        div.className = 'confirmation-popup';
        div.innerHTML = `
            <div class="popup-content">
                <h3>Confirm Delete</h3>
                <p>Are you sure you want to delete this task?</p>
                <div class="popup-buttons">
                    <button class="btn delete-confirm">Delete</button>
                    <button class="btn cancel-confirm">Cancel</button>
                </div>
            </div>
        `;
        
        main.appendChild(div);
        
        div.querySelector('.delete-confirm').addEventListener('click', () => {
            div.remove();
            resolve(true);
        });
        
        div.querySelector('.cancel-confirm').addEventListener('click', () => {
            div.remove();
            resolve(false);
        });
    });
};

// Function used to get task and divied based on the catogory
const getAllTaskAndDivide = async()=>{
    let weekDeatils = getFullweekStartAndEnd(today)
    todayTask = [];
    weekTask = [];
    monthTask = [];
   
    if(!username){
        notification("Login and continue" , STATUS.FAIL)
        globalThis.location.href = '/html/index.html'
    }
    const allTask = await getTasksByUsername(username);


    let  filteredTask = allTask.filter((element)=>{
        const taskDate = new Date(element.schedule.date);
        if(element.schedule.type === CATAGORY.TODAY){
            return taskDate.toDateString() === today.toDateString();
        }
        if(element.schedule.type === CATAGORY.WEEK){
            return taskDate >= weekDeatils.startDate && taskDate < new Date(weekDeatils.endDate.getTime() + 24 * 60 * 60 * 1000)
        }
        if(element.schedule.type === CATAGORY.MONTH){
            return taskDate.getFullYear() === today.getFullYear() && taskDate.getMonth() === today.getMonth()
        }
        return false
    })
    filteredTask.sort((a,b)=>{
        return a.status.completed - b.status.completed || new Date(a.schedule.date) - new Date(b.schedule.date)
    })
    // push the element into the each respective array 
    filteredTask.forEach((element) =>{
        if(element.schedule.type === CATAGORY.TODAY){
            todayTask.push(element)
        }else if(element.schedule.type === CATAGORY.WEEK){
            weekTask.push(element)
        }else {
            monthTask.push(element)
        }
    })
}
// Find th progress precentage 
const findAllPercentage = ()=>{
    let completedDayCount = 0 ;
    let completedWeekCount = 0 ;
    let completedMonthCount = 0 ;
    monthTask.forEach((element)=>{
        if(element.status.completed){
            completedMonthCount++;
        }
    })
    todayTask.forEach((element)=>{
         if(element.status.completed){
            completedDayCount++;
        }
    })
    weekTask.forEach((element)=>{
        if(element.status.completed){
            completedWeekCount++;
        }
    })

    return {
        dayPercentage : Number.isNaN(( completedDayCount / todayTask.length).toFixed(1) *100 ) ? 0 :( completedDayCount / todayTask.length).toFixed(1) *100  , 
        weekPercentage : Number.isNaN((completedWeekCount /  weekTask.length ).toFixed(1)*100 ) ?0 :(completedWeekCount /  weekTask.length ).toFixed(1)*100 ,
        monthPercentage :Number.isNaN((completedMonthCount / monthTask.length).toFixed(1) *100 ) ? 0 :((completedMonthCount / monthTask.length).toFixed(1) *100 ) ,
        dayCount : completedDayCount ,
        dayRemaining : todayTask.length - completedDayCount , 
        weekCount : completedWeekCount ,
        WeekRemaining : weekTask.length - completedWeekCount , 
        monthCount : completedMonthCount ,
        monthRemaining : monthTask.length - completedMonthCount , 
    }
}



// Task Card 
const todoCard = ({ id, title, time, priority , status  }) => {
    
    const div = document.createElement('div');
    div.className = 'todo-card';
    div.id =  id
    if(status){
        div.classList.add('checked')
    }
    div.innerHTML = `
        <div class="check-box-div">
            <input type="checkbox" data-id="${id}"  ${status ? 'checked' : ''} >
        </div>
        <div class="todo-info-div">
            <p>${title}</p>
            <p>${time}</p>
        </div>
        <div class="priority-div">
            <div class="priority ${priority.toLowerCase()}">
                <p>${priority.toUpperCase()}</p>
            </div>
        </div>
        <div class="delete"><i class="fa-solid fa-trash-can"></i></div>
    `;

    return div; 
};

// Task card for adding the task
const addTaskButton =  ()=>{
    const div = document.createElement('div')
    div.className = 'add-task'
    div.innerHTML = `<button class="today-add-task btn">
                                + Add Task
                            </button>
                    `
    return div;
}
// Open the task popup
const openAddTaskPopUp = (category = 'today')=>{
    
    taskPopUpElement.style.display = 'flex' 
    document.body.classList.add('no-scroll');
    
}

// Update the list  of days 
const UpdateTodaysTodo = () => {
    

    todayTaskContainer.innerHTML = '';
    
    todayTask.forEach((element) => {
        todayTaskContainer.append(
            todoCard({
                id: element.id,
                title: element.content.title,
                time: element.schedule.time,
                priority: element.priority.level , 
                status : element.status.completed
            })
        );
    });
    if(todayTask.length === 0){
        const p = document.createElement('p')
        p.innerText = 'No task Found'
        todayTaskContainer.append(p)
    }
    // todayTaskContainer.append(addTaskButton())
};

// Update the list  of week
const UpdateWeekTodo = () => {
   
    weekTaskContainer.innerHTML = '';
    weekTask.forEach((element) => {
        weekTaskContainer.append(
            todoCard({
                id: element.id,
                title: element.content.title,
                time: element.schedule.time,
                priority: element.priority.level,
                status : element.status.completed
            })
        );
    });
    if(weekTask.length === 0){
        const p = document.createElement('p')
        p.innerText = 'No task Found'
        weekTaskContainer.append(p)
    }
    // weekTaskContainer.append(addTaskButton())
};
// Update the list  of Month
const UpdateMonthTodo = () => {
    
    monthTaskContainer.innerHTML = '';
    monthTask.forEach((element) => {
        monthTaskContainer.append(
            todoCard({
                id: element.id,
                title: element.content.title,
                time: element.schedule.time,
                priority: element.priority.level,
                status : element.status.completed
            })
        );
    });
    if(monthTask.length === 0){
        const p = document.createElement('p')
        p.innerText = 'No task Found'
        
        monthTaskContainer.append(p)
    }
    // monthTaskContainer.append(addTaskButton())
};





// Refresh task edit sections 
const refreshTaskEdit = async (taskId)=>{
    const task = await getTaskById(taskId)

    formData.forEach((element)=>{
        element.disabled = true
    })

    cat.forEach((id)=>{
        const element = document.getElementById(`${id}-catogory`)
        element.classList.remove('active')
    })
    const catElement = document.getElementById(`${task.schedule.type}-catogory`)
    catElement.classList.add('active')

    const icon = catElement.querySelector('i');
    if (icon) {
        icon.className = 'fa-regular fa-circle-check'; 
    }
    cat.forEach((elementId) => {
        const element = document.getElementById(`${elementId}-catogory`)
        element.classList.add('disable')
    });

    editBtn.disabled = false
    taskTitle.value =  task.content.title
    taskDescription.value = task.content.description
    taskPriority.value = task.priority.level
    taskDueDate.value =  task.schedule.date
    taskTime.value = task.schedule.time

    taskCreationBtn.innerText =  'Confirm'
}


// Open the edit task popup 

const openEditTaskPopUp = async(taskId)=>{
    localStorage.setItem('taskId' , JSON.stringify(taskId))
    await refreshTaskEdit(taskId)

    taskPopUpElement.style.display = 'flex' 
    document.body.classList.add('no-scroll');
    
}
// add the edit button 
const addEditButton = ()=>{
    const i = document.createElement('i')
    i.classList.add('fa-solid' , 'fa-pen');
    editBtn.innerText = ''
    editBtn.append(i)
    editBtn.append('Edit')
}

// Edit bnt in popup 
editBtn.addEventListener('click' ,async ()=>{
    if(editable){
        formData.forEach((element)=>{
            element.disabled = false } 
        )
        editable = false
        editBtn.innerText = 'Cancel'
        cat.forEach((elementId) => {
            const element = document.getElementById(`${elementId}-catogory`)
            element.classList.remove('disable')
        })
    }else {
        addEditButton()
        const taskid = JSON.parse(localStorage.getItem('taskId' ))
        await refreshTaskEdit(taskid)
        editable = true
    }
}
)
// Clear all the input and update 
const  refreshAllInputs = ()=>{
    editable = false
     cat.forEach((elementId) => {
        const element = document.getElementById(`${elementId}-catogory`)
        element.classList.remove('disable')
            
    
    })
    formData.forEach((element)=>{
        if(element.id == 'priority'){
            element.value = 'HIGH'
        
        }
        else 
        element.value = '';
        element.disabled = false;
    })
    
}

// Close of the popup 
closeButton.addEventListener("click" ,  ()=>{
    taskPopUpElement.style.display = 'none'
    document.body.classList.remove('no-scroll');
    refreshAllInputs()
    refreshAll()
    addEditButton()
})
// Check weathe rthe formmis valid 
const isFormValid = () => {
    // Is empty 
    for (let element of formData) {
        if (element.value.trim() === '') {
            notification("All fields must be filled", STATUS.FAIL);
            return false;
        }
    }
    const selectedDate = new Date(formData[3].value);
    const selectedTime = formData[4].value;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Date check 
    if (selectedDate.getTime() < today.getTime()) {
        notification('Date cannot be past', STATUS.FAIL);
        return false;
    }
    // Time check 
    if (selectedDate.toDateString() === new Date().toDateString() && selectedTime) {
        const [hours, minutes] = selectedTime.split(':').map(Number);
        const selectedDateTime = new Date(selectedDate);
        selectedDateTime.setHours(hours, minutes, 0, 0);
        const now = new Date();
        if (selectedDateTime < now) {
            notification('Time cannot be in the past', STATUS.FAIL);
            return false;
        }

}
    return true;
};





// Create New task 
taskCreationBtn.addEventListener('click', async ()=>{
    // get the username form local storage 
   
    if(!username){
        notification("Login and continue" , STATUS.FAIL)
       
        globalThis.location.href = '/html/index.html'
    }
    if(!isFormValid()) return
    const taskId = JSON.parse(localStorage.getItem('taskId'))
    if(taskId){
      
        const task = createTask({id:taskId, title: taskTitle.value, description: taskDescription.value.trim(), priority:taskPriority.value.trim(), date: taskDueDate.value, time: taskTime.value, category: category, createdBy: username, started: true })
        await addTaskDatabase(task)
        notification("Task Updated " , STATUS.SUCCESS)
        refreshAllInputs()
        localStorage.removeItem('taskId')
        addEditButton()
        return
    }
    // get the category 

    // get all the values 
    // // create a task object
    const task = createTask({ title: taskTitle.value, description: taskDescription.value.trim(), priority:taskPriority.value.trim(), date: taskDueDate.value, time: taskTime.value, category: category, createdBy: username, started: true })
  
    await addTaskDatabase(task)
    notification("Task Added " , STATUS.SUCCESS)
    // refreash all inputs 
    formData.forEach((element)=>{
        element.disabled = false
    })
    closeButton.click()
    editBtn.disabled = false
    taskTitle.value =  ''
    taskDescription.value =''
    taskPriority.value = 'HIGH'
    taskDueDate.value =  ''
    taskTime.value =''
    editable = true

    // update in the database 
})

// Reset button to clear al the input 
resetButton.addEventListener('click' , ()=>{
    formData.forEach((element)=>{
        if(element.id == 'priority'){
            element.value = 'HIGH'
        }
        else 
        element.value = ''
    })
})


// Catogeroy change the type
const refeshCatogory = () =>{
    cat.forEach((elementId) => {
        const element = document.getElementById(`${elementId}-catogory`);
        //Add event Listener
        element.addEventListener('click', () => {
            cat.forEach((id) => {
                const el = document.getElementById(`${id}-catogory`);
                el.classList.remove('active');

                const icon = el.querySelector('i');
                if (icon) {
                    icon.className = `fa-solid ${icons[id]}`; 
                }
            });

        
            element.classList.add('active');
            category =  element.id.split('-')[0]
            const icon = element.querySelector('i');
            if (icon) {
                icon.className = 'fa-regular fa-circle-check'; 
            }
        });});
}

// Progress bar 
const conicGradient = (startG , endG , startR , endR)=>{
    return `conic-gradient(#22c55e 0% ${endG}%, #ef4444 ${endG}% 100%)`
}
// Update the progress 
const UpdateProgress = ()=>{
    // FInding the precentage of all the category
    const precentages = findAllPercentage()

    //Update the background to the required progress
    todaysProgress.style.background =  conicGradient(0 ,precentages.dayPercentage , precentages.dayPercentage , 100 )
    weeksProgress.style.background =  conicGradient(0 , precentages.weekPercentage , precentages.weekPercentage , 100)
    monthProgress.style.background  = conicGradient(0, precentages.monthPercentage , precentages.monthPercentage , 100)
    //Today Text 
    todayCompleted.innerText = precentages.dayCount 
    todayPending.innerText = precentages.dayRemaining
    //Week text
    weekCompleted.innerText = precentages.weekCount
    weekPending.innerText = precentages.WeekRemaining
    //Month text
    monthCompleted.innerText = precentages.monthCount
    monthPending.innerText = precentages.monthRemaining
    // Check weather at least one task is present 
    if(precentages.dayPercentage === 0 && precentages.dayCount==0 && precentages.dayRemaining==0){
        todayPercentage.innerHTML =  '<p>NO TASK</p>'
        todayPercentage.classList.add('percentage-donut-text')
    }else {
        todayPercentage.classList.remove('percentage-donut-text')
        todayPercentage.innerHTML =  precentages.dayPercentage + '&percnt;';
    }
    
    if(precentages.weekPercentage === 0 && precentages.weekCount==0 && precentages.WeekRemaining==0){
        weekPercentage.innerHTML =  '<p>NO TASK</p>'
        weekPercentage.classList.add('percentage-donut-text')
    }else {
        weekPercentage.classList.remove('percentage-donut-text')
         weekPercentage.innerHTML = precentages.weekPercentage + '&percnt;'
    }
    if(precentages.monthPercentage === 0 && precentages.monthCount==0 && precentages.monthRemaining==0){
        monthPercentage.innerHTML =  '<p>NO TASK</p>'
        monthPercentage.classList.add('percentage-donut-text')
    }else{ 
        monthPercentage.classList.remove('percentage-donut-text')
    monthPercentage.innerHTML = precentages.monthPercentage + '&percnt;';
}
    taskHeaderProgressDay.style.width = `${precentages.dayPercentage}%`
    taskHeaderProgressMonth.style.width = `${precentages.monthPercentage}%`
    taskHeaderProgressWeek.style.width = `${precentages.weekPercentage}%`
}


const refreshAll= async () =>{
    await getAllTaskAndDivide();
    getUser()
    renderCalender(today)
    refeshCatogory()
    UpdateTodaysTodo();
    UpdateWeekTodo();
    UpdateMonthTodo();
    UpdateCurrentWeek(today)
    UpdateCurrectMonth(today)
    UpdateCurrentDay(today)
    UpdateProgress()
}

// Add global check box add eventListener 
document.addEventListener('change', async (e) => {
    if (e.target.type === 'checkbox') {
        const taskId = e.target.dataset.id;

        await UpdateStatusDB({id: taskId,status: e.target.checked });

       
        todayTask = [];
        weekTask = [];
        monthTask = [];

        
        await getAllTaskAndDivide();

        
        UpdateTodaysTodo();
        UpdateWeekTodo();
        UpdateMonthTodo();
        UpdateProgress()
    }
 
});
// Delete the task 
document.addEventListener('click' , async (e)=>{
    if(e.target.closest('.delete')){
        const taskId = e.target.closest('.todo-card').id
        if(!await openAndCheck()) return 
        await deleteTaskByTaskId(taskId)
        todayTask = [];
        weekTask = [];
        monthTask = [];

        
        await getAllTaskAndDivide();

        
        UpdateTodaysTodo();
        UpdateWeekTodo();
        UpdateMonthTodo();
        UpdateProgress()
    
    
    }
    });


// Add event Listerner to open the task editing 
document.addEventListener('click', (e) => {
    if (e.target.closest('input')) return;
    if(e.target.closest('.delete')) return;
    const card = e.target.closest('.todo-card');
    if(card){
        openEditTaskPopUp(card.id)
    }

});









refreshAll()
