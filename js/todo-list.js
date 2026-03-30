const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const renderCalender = (date)=>{
    const days = document.getElementById('day')
    const startDay = new Date(date.getFullYear() , date.getMonth() , 1).getDay()
    const currectYear = document.getElementById("current")
    const today = new Date()
    days.innerHTML = ''
    
    const endDay = new Date(date.getFullYear() , date.getMonth()+1 , 0).getDate()
    let previousMonthDays =  new Date(date.getFullYear() , date.getMonth() , 0).getDate()
    currectYear.innerText = months[date.getMonth()] + ' ' + date.getFullYear()
    for(let i = startDay ; i>0 ; i--){
    
        const div = document.createElement('div')
        
        div.textContent = previousMonthDays - i + 1
        div.className = 'previous'
        days.append(div)
    }

    for(let i =1 ;i<=endDay ; i++){
       
        const div = document.createElement('div')
        div.addEventListener('click' ,()=>{
            changeDateUpdate(i)
           
        })
        div.textContent =  i 
        if (i === today.getDate() &&date.getMonth() === today.getMonth() &&date.getFullYear() === today.getFullYear())  {
        div.classList.add('current')
    }
        if(i==date.getDate() ){
        div.className =  'selected'
        }
        days.append(div)
    }
   const nextDays = 42 - (startDay + endDay);
    for (let i = 1; i <= nextDays; i++) {
        const div = document.createElement('div');
        div.textContent = i;
        div.className = 'previous'
        days.append(div);
    }
}

const taskTitle = document.getElementById('title')
const taskDescription = document.getElementById('description')
const taskPriority = document.getElementById('priority')
const taskDueDate = document.getElementById('due-date')
const taskTime = document.getElementById('time')
const formData  =  [
    taskTitle , taskDescription , taskPriority , taskDueDate , taskTime
]
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
let editable = true;
let today = new Date()




const changeDateUpdate  = async (date) =>{
    console.log(date)
    console.log('came here ')
    today = new Date(today.getFullYear() , today.getMonth() , date)
    renderCalender(today)
    await refreshAll()

}

let todayTask = []
let weekTask =[]
let monthTask = [] 
let category = 'today'


renderCalender(today)


const getFullweekStartAndEnd = (date) => {
    const start = date.getDate() - date.getDay();
    let end = start + 6;
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    
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
    console.log(weekDeatils)
    currentWeekCard.innerText = weekDeatils.startDate.getDate() + ` ${months[weekDeatils.startDate.getMonth()].substring(0,3)} - ` + weekDeatils.endDate.getDate() + ` ${months[weekDeatils.endDate.getMonth()].substring(0,3)}  `
}

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


const previousButton = document.getElementById('prev')
const nextButton = document.getElementById('next')


previousButton.addEventListener('click', () => {
    today = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    renderCalender(today)
    UpdateCurrectMonth(today)
    UpdateCurrentDay(today)
    UpdateCurrentWeek(today)
})
nextButton.addEventListener('click', () => {
    today = new Date(today.getFullYear(), today.getMonth() + 1, 1)
    renderCalender(today)
    UpdateCurrectMonth(today)
    UpdateCurrentDay(today)
    UpdateCurrentWeek(today)
})




const openTaskDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("TaskDB", 1);

        request.onupgradeneeded = (e) => {
            const db = e.target.result;

            if (!db.objectStoreNames.contains("tasks")) {
                db.createObjectStore("tasks", { keyPath: "id" });
            }
        };

        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(new Error(e));
    });
};

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

// Add global check box add eventListener 
document.addEventListener('change', async (e) => {
    if (e.target.type === 'checkbox') {
        const taskId = e.target.dataset.id;

        await UpdateStatusDB({
            id: taskId,
            status: e.target.checked
        });

       
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
        console.log(taskId)
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
    const card = e.target.closest('.todo-card');
    if(card){
        openEditTaskPopUp(card.id)
    }

});
const addTaskDatabase =async (taskData) =>{
    try {
    const db = await openTaskDB()
    const tx = db.transaction('tasks' ,  'readwrite')
    const store = tx.objectStore('tasks')

    store.put(taskData)
    tx.oncomplete = () => {
            console.log("Task saved in IndexedDB");
            
            return true
        };

    tx.onerror = () => {
            console.log("Error saving user");
            notification("Error : Try again" , STATUS.FAIL)
            return false
    };}
    catch{
        console.log('Error')
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
            request.onerror = () => reject("Fetch Error");
        });

        return tasks;
    } catch (error) {
        console.error('Error:', error);
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

    }catch(e){
        notification('Internal Error' , STATUS.FAIL)
        console.log(e)
    }
}


// Updating the Status 
const UpdateStatusDB = async({id , status})=>{
    console.log(id)
    try {
        const db = await openTaskDB()
        const tx = db.transaction('tasks' , 'readwrite')
        const store = tx.objectStore('tasks')


        const task = await new Promise((resolve , reject) =>{
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(new Error("Error fetching Task"));
        })
        
        //Print task
        console.log(task)
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
    }catch(e){
        console.log(e)
        return null;
    }

}



const getTaskById = async(taskId)=>{
    try {
        const db = await openTaskDB();
        const tx = db.transaction('tasks', 'readonly');
        const store = tx.objectStore('tasks');

        const tasks = await new Promise((resolve, reject) => {
            const request = store.get(taskId);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject("Fetch Error");
        });

        return tasks;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}
async function loadTasks() {
    const tasks = 
    console.log("Tasks:", tasks);  
}




const getAllTaskAndDivide = async()=>{
    let weekDeatils = getFullweekStartAndEnd(today)
    todayTask = [];
    weekTask = [];
    monthTask = [];
    const allTask = await getTaskDatabase();
    const localDate = today.getFullYear() + '-' + 
                  String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                  String(today.getDate()).padStart(2, '0');
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
    console.log("Todays ")
    console.log(todayTask)
    console.log(todayTask.length  )
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
const addTaskButton =  ()=>{
    const div = document.createElement('div')
    div.className = 'add-task'
    div.innerHTML = `<button class="today-add-task btn">
                                + Add Task
                            </button>
                    `
    return div;
}

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







const taskPopUpElement  =  document.getElementById('create-task')
const openAddTaskPopUp = (category = 'today')=>{
    
    taskPopUpElement.style.display = 'flex' 
    document.body.classList.add('no-scroll');
    
}
let currentTaskId =  ''
const refreshTaskEdit = async (taskId)=>{
    const task = await getTaskById(taskId)
    const cards =  document.getElementById(taskId)
    formData.forEach((element)=>{
        element.disabled = true
    })
    console.log(cat)
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
    console.log(task)
    editBtn.disabled = false
    taskTitle.value =  task.content.title
    taskDescription.value = task.content.description
    taskPriority.value = task.priority.level
    taskDueDate.value =  task.schedule.date
    taskTime.value = task.schedule.time
    
    taskCreationBtn.innerText =  'Confirm'
}
const openEditTaskPopUp = async(taskId)=>{
    localStorage.setItem('taskId' , JSON.stringify(taskId))
    await refreshTaskEdit(taskId)

    taskPopUpElement.style.display = 'flex' 
    document.body.classList.add('no-scroll');
    
}
const addEditButton = ()=>{
           const i = document.createElement('i')
        i.classList.add('fa-solid' , 'fa-pen');
        editBtn.innerText = ''
        editBtn.append(i)
        editBtn.append('Edit')
}
editBtn.addEventListener('click' ,async ()=>{
    if(editable){
        formData.forEach((element)=>{
        element.disabled = false } )
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
const closeButton = document.getElementById('close-button')
closeButton.addEventListener("click" ,  ()=>{
    taskPopUpElement.style.display = 'none'
    document.body.classList.remove('no-scroll');
    refreshAll()
    addEditButton()
})
const isFormValid = () => {
    for (let element of formData) {
        if (element.value.trim() === '') {
            notification("All fields must be filled", STATUS.FAIL);
            return false;
        }
    }
    return true;
};
// Create New task 
taskCreationBtn.addEventListener('click', async ()=>{
    // get the username form local storage 
    const username = localStorage.getItem('currentUser') || null
    console.log(username)
    if(!username){
        notification("Login and continue" , STATUS.FAIL)
       
        // globalThis.location.href = '/html/index.html'
    }
    if(!isFormValid()) return
    const taskId = JSON.parse(localStorage.getItem('taskId'))
    if(taskId){
        console.log(taskId)
        const task = createTask({id:taskId, title: taskTitle.value, description: taskDescription.value.trim(), priority:taskPriority.value.trim(), date: taskDueDate.value, time: taskTime.value, category: category, createdBy: username, started: true })
        await addTaskDatabase(task)
        notification("Task Updated " , STATUS.SUCCESS)
        formData.forEach((element)=>{
        element.disabled = false})
        closeButton.click()
        editBtn.disabled = false
        taskTitle.value =  ''
        taskDescription.value =''
        taskPriority.value = 'HIGH'
        taskDueDate.value =  ''
        taskTime.value =''
        cat.forEach((elementId) => {
            const element = document.getElementById(`${elementId}-catogory`)
            element.classList.remove('disable')
        })
    localStorage.removeItem('taskId')
    addEditButton()
        return
    }
    // get the category 

    // get all the values 
    // // create a task object
    const task = createTask({ title: taskTitle.value, description: taskDescription.value.trim(), priority:taskPriority.value.trim(), date: taskDueDate.value, time: taskTime.value, category: category, createdBy: username, started: true })
    console.log(taskDueDate.value)
    const taskStatus = await addTaskDatabase(task)
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


resetButton.addEventListener('click' , ()=>{
    formData.forEach((element)=>{
        if(element.id == 'priority'){
            element.value = 'HIGH'
        }
        else 
        element.value = ''
    })
})


const cat = ['today' , 'week' , 'month']
const rightIcon = `<i class="fa-regular fa-circle-check"></i>`

const icons = {
    today: 'fa-calendar-day',
    week: 'fa-calendar-week',
    month: 'fa-calendar'
};
const refeshCatogory = () =>{
cat.forEach((elementId) => {
    const element = document.getElementById(`${elementId}-catogory`);

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
    });
});
}

refeshCatogory()

const conicGradient = (startG , endG , startR , endR)=>{
    return `conic-gradient(#22c55e 0% ${endG}%, #ef4444 ${endG}% 100%)`
}

const UpdateProgress = ()=>{
    // FInding the precentage of all the category
    const precentages = findAllPercentage()
    console.log(precentages)
    //Update the background to the required progress
    todaysProgress.style.background =  conicGradient(0 ,precentages.dayPercentage , precentages.dayPercentage , 100 )
    
    weeksProgress.style.background =  conicGradient(0 , precentages.weekPercentage , precentages.weekPercentage , 100)
    monthProgress.style.background  = conicGradient(0, precentages.monthPercentage , precentages.monthPercentage , 100)
    
    todayCompleted.innerText = precentages.dayCount 
    todayPending.innerText = precentages.dayRemaining
    
    weekCompleted.innerText = precentages.weekCount
    weekPending.innerText = precentages.WeekRemaining
    
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
    UpdateTodaysTodo();
    UpdateWeekTodo();
    UpdateMonthTodo();
    UpdateCurrentWeek(today)
UpdateCurrectMonth(today)
UpdateCurrentDay(today)

    UpdateProgress()
}
refreshAll()
