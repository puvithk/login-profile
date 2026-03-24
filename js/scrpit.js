const loginContainer = document.getElementById("login-container")
const signupContainer = document.getElementById("signup-container")
const loginForm = document.getElementById("login-form")
const signupForm = document.getElementById("signup-forms")
const textSignUp = document.getElementById('text-signup')
const textLogin = document.getElementById("text-login")
const forgotPassword = document.getElementById('forgot-password')
const container = document.getElementById("container");

const text = document.getElementById('title')
const main = document.querySelector('main')
const showPasswordLogin = document.getElementsByClassName('show-password')[0]
const lockPasswordLogin = document.getElementsByClassName('lock-password')[0]
const showPasswordSignUp = document.getElementsByClassName('show-password')[1]
const lockPasswordSignUp= document.getElementsByClassName('lock-password')[1]
const passwordInput = document.getElementById('password-login')
const passwordInputSignup = document.getElementById('password-signup')

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

showPasswordLogin.addEventListener('click', () => {

    passwordInput.type = "password"
    showPasswordLogin.style.opacity = 0
    showPasswordLogin.style.display = 'none'
    lockPasswordLogin.style.opacity = 1
})

lockPasswordLogin.addEventListener('click', () => {
   
    passwordInput.type = "text"
    showPasswordLogin.style.opacity = 1
    showPasswordLogin.style.display = 'block'
    lockPasswordLogin.style.opacity = 0
})
showPasswordSignUp.addEventListener('click', () => {
 
    passwordInputSignup.type = "password"
    showPasswordSignUp.style.opacity = 0
    showPasswordSignUp.style.display = 'none'
    lockPasswordSignUp.style.opacity = 1
})

lockPasswordSignUp.addEventListener('click', () => {
   
    passwordInputSignup.type = "text"
    showPasswordSignUp.style.opacity = 1
    showPasswordSignUp.style.display = 'block'
    lockPasswordSignUp.style.opacity = 0
})


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
        request.onerror = (e) => reject(e);
    });
};



const openSignUp = ()=>{
  

    loginContainer.classList.add("change-login-container")
    signupContainer.classList.add('change-signup-container')
    loginForm.classList.add('hide')
    signupForm.classList.remove('hide')
    textSignUp.classList.remove('hide')
    textLogin.classList.add("hide")
    forgotPassword.classList.add('hide')
    text.innerText = 'GET STARTED'
}
const openLogin = ()=>{

    loginContainer.classList.remove("change-login-container")
    signupContainer.classList.remove('change-signup-container')
     loginForm.classList.remove('hide')
    signupForm.classList.add('hide')
    textSignUp.classList.add('hide')
    textLogin.classList.remove("hide")
    forgotPassword.classList.remove('hide')
    text.innerText = 'WELCOME BACK !'
}

const signUp = async (event) => {
    event.preventDefault(); 

    const username = event.target.username.value.trim();
    const password = event.target.password.value.trim();
    const email = event.target.email.value.trim();
    const name = event.target.name.value.trim();
    const file = event.target['profile-image'].files[0]
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
        username === '' ||
        password === '' ||
        email === '' ||
        name === '' ||
        !emailRegex.test(email)
    ) {
        console.log("Invalid input");
        
        return false;
    }

     try {
        const db = await openDB();

        const tx = db.transaction("users", "readwrite");
        const store = tx.objectStore("users");

      
        const userData = {
            username,
            password,
            email,
            name,
            profileImage: file  
        };
        const user = await new Promise((resolve, reject) => {
            const request = store.get(username);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject("Error fetching user");
        });
        if(user){
            console.log("User already present")
            notification("Username Already used" , STATUS.FAIL)
            return false
        }
        store.put(userData);

        tx.oncomplete = () => {
            console.log("User saved in IndexedDB");
        };

        tx.onerror = () => {
            console.log("Error saving user");
        };

    } catch (err) {
        console.log("DB error:", err);
        notification("Please try Again Later" , STATUS.FAIL)
    }
    
    notification("SignUp Successfull" , STATUS.SUCCESS)
    setTimeout(()=>{
        globalThis.location.reload()
    }, 5000)
    return true;
};

const login = async (event) =>
    {
    event.preventDefault()

    const username = event.target.username.value.trim();
    const password = event.target.password.value.trim();
     if (
        username === '' ||
        password === ''){
            console.log("Need password and username ")
            return false
        }
    try {
         const db = await openDB();

        const tx = db.transaction("users", "readonly");
        const store = tx.objectStore("users");

         const user = await new Promise((resolve, reject) => {
            const request = store.get(username);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject("Error fetching user");
        });

        if(!user){
           
            notification("Username or Password is wrong" , STATUS.FAIL)
            return false
        }
   
        if(user.password !== password){
            
            notification("Username or Password is wrong" , STATUS.FAIL)
            return false
        }
        notification("Login success : Redirecting" , STATUS.SUCCESS)
        localStorage.setItem("currectUser" , JSON.stringify(user.username))
        setTimeout(() => {
             globalThis.location.href = '/html/home.html';
    }, 5000);
    }catch{
        notification("Error" , STATUS.FAIL)
    }
}


const checkPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

const passwordElement = document.getElementById('password-signup');

passwordElement.addEventListener("input", (e) => {
    const password = e.target.value;
    const passwordMessage = document.getElementById("password-message");

    if (checkPassword(password)) {
        passwordMessage.style.color = 'green';
        passwordMessage.style.textDecoration = 'line-through'
    } else {
        passwordMessage.style.color = 'red';
        passwordMessage.style.textDecoration = 'none'
    }
});