

const createUser = ({username = "", password = "",email = "",name = "",profileImage = null} = {}) => {
    return {
        username,
        password,
        email,
        name,
        profileImage
    };
};
const main = document.querySelector('main')
const userImg = document.getElementById('user-image')
const userHome = document.getElementById('user-logout')
const i = document.createElement('i')
i.classList.add("fa-solid" , "fa-house" ,'home-button')

userHome.append(i)
i.addEventListener('click' ,  ()=>{
    globalThis.location.href = '/html/todo-list.html'
})

let userDetails ;
const STATUS = {
    SUCCESS: "success",
    FAIL: "fail"
};
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
const updateUserDeatils = async ()=>{
    // Get user details from the local storage 
    const username =  JSON.parse(localStorage.getItem("currentUser"))
    const profileImage = document.getElementById("profile-image")
    let user ;
     try {
         const db = await openDB();

        const tx = db.transaction("users", "readonly");
        const store = tx.objectStore("users");
       
        user = await new Promise((resolve, reject) => {
            const request = store.get(username);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(new Error("Error fetching user"));
        });

        if(!user){
            console.log("User not found")
            notification("Usernot found" , STATUS.FAIL)
      
            
        }
        userDetails = user 
     }catch{
        notification("Able to load Try later"  , STATUS.FAIL)
        setTimeout(()=>{
            globalThis.location.href = '/html/index.html'
        },  5000)
     }
    // Update the Input values 
    const allElements = document.querySelectorAll('.user-inputs input')
    profileImage.src =  URL.createObjectURL(user.profileImage);
    userImg.src = URL.createObjectURL(user.profileImage)
    console.log(user['profileImage'])
    allElements.forEach((element)=>{
        if(user[element.id]){
          element.value =  user[element.id]  
        }
        else {
            element.value =  'Update the Value'
        }
        
    })

}
updateUserDeatils()
const onClickEditValues = (element) => {
    // The Id of button are in elementName-operation example password-edit
    const editButton = document.getElementById(`${element}-edit`)
    const correctButton = document.getElementById(`${element}-correct`)
    const wrongButton = document.getElementById(`${element}-xmark`)
    const input = document.getElementById(element)
    if(element=='phone'){
        input.value = ''
    }
    editButton.style.display = 'none'
    correctButton.style.display = 'block' 
    wrongButton.style.display = 'block'
    input.disabled =  false

}
// This fucntion is used to Cancel the Made changes 
const onClickCancel= (element) =>{
    const editButton = document.getElementById(`${element}-edit`)
    const correctButton = document.getElementById(`${element}-correct`)
    const wrongButton = document.getElementById(`${element}-xmark`)
    const input = document.getElementById(element)
    editButton.style.display = 'block'
    correctButton.style.display = 'none' 
    wrongButton.style.display = 'none'
    input.value =  userDetails[element]
    input.disabled = true
}
// This function used to submit the edited value 
const onClickCorrect = async (element) =>{
    const editButton = document.getElementById(`${element}-edit`)
    const correctButton = document.getElementById(`${element}-correct`)
    const wrongButton = document.getElementById(`${element}-xmark`)
    const input = document.getElementById(element)
const newValue = input.value;

try {
    const db = await openDB();

    const tx = db.transaction("users", "readwrite");
    const store = tx.objectStore("users");


    const currentUser = await new Promise((resolve, reject) => {
        const request = store.get(userDetails.username);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error("Error fetching user"));
    });

    if (!currentUser) {
        console.log("User not found");
        return;
    }
    if(element ==='email'){
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
          if(!emailRegex.test(newValue)){
            notification('Please Enter valid Email' , STATUS.FAIL)
            return 
          }
    }else if(element === 'phone'){
        const phone = /^\d{10}$/;
        if(!phone.test(newValue)){
            notification("Phone number must be number and 10 digits" , STATUS.FAIL)
            return
        }
    }
 

    currentUser[element] = newValue;


    store.put(currentUser);

    tx.oncomplete = () => {
        console.log("User updated successfully");
    };
    } catch(e) {
        console.log("Erro r " + e);
        return 
    }
    notification("Updated Successfully" , STATUS.SUCCESS)    
    editButton.style.display = 'block'
    correctButton.style.display = 'none' 
    wrongButton.style.display = 'none'
    input.disabled = true


}

const logout  = ()=>{
    
    localStorage.removeItem("currentUser")
    globalThis.location.href = '/html/index.html'
}


const allSvgElement = document.querySelectorAll('.edit-button')
// For all elements adding the listener 
allSvgElement.forEach(element => {
    let id = element.id 
   
    let currectElement =  id.split('-')
    if(currectElement[1] == 'edit'){
        element.addEventListener('click' , ()=>{
            onClickEditValues(currectElement[0])
        })
    }else if(currectElement[1] == 'xmark'){
        element.addEventListener('click' , ()=>{
            onClickCancel(currectElement[0])
        })
    }else {
        element.addEventListener('click' , ()=>{
            onClickCorrect(currectElement[0])
        })
    }
});

const updateImage = (event)=>{
    
}
const openUpdatePopUp = () => {

    const div = document.createElement('div');
    div.className = "popup-image";
    const overlay = document.createElement('div');
    overlay.className = "overlay";
    div.innerHTML = `
    <div class='popup-header'>
        <h3>Upload Image</h3>
        <svg class="close-popup" id='close-popup' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>             

        </div>
        <div class="popup-image-container"></div>
        <div class="popup-input">
            <input type="file" accept="image/png, image/jpeg">
        </div>
        <button class="confirm" >Accept</button>
    `;
    overlay.appendChild(div);
    document.body.appendChild(overlay);
   
   

    const fileInput = div.querySelector('input');
    const imageContainer = div.querySelector('.popup-image-container');
    const closeButton = div.querySelector('.close-popup');
    const confirmButton = div.querySelector('.confirm')
    let selectedFile = null;
    const allowedTypes = ['image/jpeg', 'image/png']
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (!file) return;
        if (!allowedTypes.includes(file.type)) {
           notification('Only PNG and JPEG file are allowed' , STATUS.FAIL)
           fileInput.value = ''
           return
        }
        const url = URL.createObjectURL(file);
        selectedFile = file
        imageContainer.innerHTML = `<img src="${url}" alt="preview">`;
    });
    closeButton.addEventListener('click', () => {
    div.remove();
    overlay.remove()
});
    confirmButton.addEventListener('click' , async ()=>{
        if (!selectedFile) {
            notification("No image selected" , STATUS.FAIL);
            return;
        }

        const db = await openDB();
        const tx = db.transaction("users", "readwrite");
        const store = tx.objectStore("users");

        const user = await new Promise((resolve, reject) => {
            const request = store.get(userDetails.username);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(new Error("DB error"));
        });

        user.profileImage = selectedFile;
        store.put(user);

      
        document.getElementById("profile-image").src = URL.createObjectURL(selectedFile);
        userImg.src = URL.createObjectURL(selectedFile);
        overlay.remove();
        notification("Profile Photo Updated Successfully" , STATUS.SUCCESS)
    });

};

const checkPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};



const openPasswordUpdate = () =>{
      const div = document.createElement('div');
    div.className = "popup-image";
    const overlay = document.createElement('div');
    overlay.className = "overlay";
    div.innerHTML = `
    <div class='popup-header'>
        <h3>Update the Password</h3>
        <svg class="close-popup" id='close-popup' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>             

        </div>
        
        <div class="popup-input">
            <input type='password' id='old-password' placeholder='Old password'>
            <input type="password" id='new-password' placeholder='New password'>
            <input type="text" id='confirm-password' placeholder='Confirm password'>
        </div>
        <p id="password-message" class="password-message">*Min 8 chars: upper, lower, number, special.</p>
        <button class="confirm" disabled >Accept</button>
    `;
    overlay.appendChild(div);
    document.body.appendChild(overlay);
   
   

    const closeButton = div.querySelector('.close-popup');
    const confirmButton = div.querySelector('.confirm')
    const oldPassword = div.querySelector('#old-password')
    const newPassword = div.querySelector("#new-password")
    const confirmPassword = div.querySelector('#confirm-password')
    const passwordMsg = div.querySelector("#password-message")
    closeButton.addEventListener("click" , ()=>{
        div.remove()
        overlay.remove()
    })

    newPassword.addEventListener('input' , ()=>{
        if(checkPassword(newPassword.value)){
            const validColor = 'green';
            passwordMsg.style.color = validColor;
            const validDecorator = 'line-through'
            passwordMsg.style.textDecoration = validDecorator
        }
        else {
            const invalidColor = 'red';
            passwordMsg.style.color = invalidColor;
            const invalidDecorator =  'none'
            passwordMsg.style.textDecoration = invalidDecorator
        }
    })

    confirmPassword.addEventListener('input' , ()=>{
        if(confirmPassword.value === newPassword.value){
            confirmButton.disabled = false
        }else {
            confirmButton.disabled =  true
        }
    })
    newPassword.addEventListener('input' , ()=>{
        if(confirmPassword.value === newPassword.value){
            confirmButton.disabled = false
        }else {
            confirmButton.disabled =  true
        }
    })
    confirmButton.addEventListener("click" , async ()=>{
        const oldPasswordStr =  oldPassword.value.trim()
  
        if(oldPasswordStr == ''){
            notification("Enter the old password" , STATUS.FAIL)
        }else if(checkPassword(newPassword.value)){
            
            if(userDetails.password === oldPasswordStr){
            try {
                const db = await openDB();

                const tx = db.transaction("users", "readwrite");
                const store = tx.objectStore("users");

                

                const currentUser = await new Promise((resolve, reject) => {
                    const request = store.get(userDetails.username);

                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(new Error("Error fetching user"));
                });

                if (!currentUser) {
                    console.log("User not found");
                    return;
                }
                
                currentUser['password'] = newPassword.value;

                console.log(currentUser)
                store.put(currentUser);

                tx.oncomplete = () => {
                    console.log("User updated successfully");
                };

            } catch(e) {
                console.log("Erro r " + e);
                return 
            }
            notification("Password Updated Successfully" , STATUS.SUCCESS)  
            div.remove()
            overlay.remove()

            }else {
                notification("Wrong Password" , STATUS.FAIL)
            }
        }
        
        else {
            notification("Password must contain Min 8 chars: upper, lower, number, special." , STATUS.FAIL)
        }

    })

}
const editButton = document.getElementById("edit-password")
editButton.addEventListener("click" , ()=>{
    openPasswordUpdate()
})
const imgEditButton = document.getElementById('edit-button-profile')
imgEditButton.addEventListener('click' , ()=>{
    openUpdatePopUp()
})