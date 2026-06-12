import { supaBase } from "./subabase.js";


supaBase.auth.onAuthStateChange((event, session) => {
    if (session) {
        if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
            window.location.href = 'dashboard.html'
        }
    }
})

const signupForm = document.getElementById('signupForm');
let loginForm = document.getElementById('loginForm');

window.switchForm = function (formType) {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const tabs = document.querySelectorAll('.tab-btn');

    if (!loginForm || !signupForm) return;

    tabs.forEach(tab => tab.classList.remove('active'));
    loginForm.classList.remove('active');
    signupForm.classList.remove('active');

    if (formType === 'login') {
        setTimeout(() => loginForm.classList.add('active'), 50);
        tabs[0].classList.add('active');
    } else {
        setTimeout(() => signupForm.classList.add('active'), 50);
        tabs[1].classList.add('active');
    }
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let email = document.getElementById('loginEmail').value;
    let pass = document.getElementById('loginPassword').value;


    try {
        const { data, error } = await supaBase.auth.signInWithPassword({
            email: email,
            password: pass
        });
        if (error) {
            iziToast.error({
                title: 'Login Failed',
                message: error.message || 'Invalid email or password.',
                position: 'topRight',
                timeout: 3500,
                pauseOnHover: true
            });
            return;
        }

        if (data.user) {
            iziToast.success({
                title: 'Success',
                message: 'Login successful! Welcome back.',
                position: 'topRight',
                timeout: 2000,
                pauseOnHover: false, 
                onClosing: function () {
                    window.location.href = "dashboard.html";
                }
            });
            window.location.href = "dashboard.html"
        }

    } catch (err) {
        iziToast.error({
            title: 'Error',
            message: 'Something went wrong. Please try again.',
            position: 'topRight'
        });
    }

})


signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let fullName = document.getElementById('signupName').value;
    let SignupEmail = document.getElementById('SignupEmail').value;
    let contact = document.getElementById('contactNumber').value;
    let password = document.getElementById('createPassword').value;
    let confirmPassword = document.getElementById('confirmPassword').value;


    if (password !== confirmPassword) {
        iziToast.warning({
            title: 'Validation Error',
            message: 'Passwords do not match. Please check again.',
            position: 'topRight',
            timeout: 3500
        });
        return;
    }

    try {
        // 2. Supabase Sign Up Call
        const { data, error } = await supaBase.auth.signUp({
            email: SignupEmail,
            password: password,
            options: {
                data: {
                    full_name: fullName,
                    phone: contact
                }
            }

        });
        if (error) {
            iziToast.error({
                title: 'Signup Failed',
                message: error.message || 'Could not complete registration.',
                position: 'topRight',
                timeout: 4000
            });
        } else {
            iziToast.success({
                title: 'Account Created',
                message: 'Registration successful!',
                position: 'topRight',
                timeout: 3000,
                pauseOnHover: false
            });
            signupForm.reset(); // Form ko khali karne ke liye
        }
    }
    catch (err) {
        iziToast.error({
            title: 'Error',
            message: 'An unexpected error occurred during signup.',
            position: 'topRight'
        });
    }
});


let forgetPasswordBtn = document.getElementById('forgetpassword');
forgetPasswordBtn.addEventListener('click' , (e) =>{
   e.preventDefault();
   window.location.href = "./auth-pages/forget-password.html";
})



let googleBtn = document.getElementById('google-btn');
let gitBtn = document.getElementById('github-btn');


googleBtn.addEventListener('click', async function googleSignin() {
    iziToast.info({
        title: 'Redirecting',
        message: 'Connecting to Google...',
        position: 'center',
        overlay: true,
        close: false,
        pauseOnHover: false,
        timeout: 2000
    });
    const { data, error } = await supaBase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: 'https://rafay-1431.github.io/student-portal/dashboard.html'
        }
    })
    if (error) {
        iziToast.error({
            title: 'Authentication Failed',
            message: error.message || 'Could not connect to Google.',
            position: 'center',
            overlay: true,
            close: false,
            pauseOnHover: false,
            timeout: 2000
        });
    }

})
gitBtn.addEventListener('click', async function githubSignin() {
    iziToast.info({
        title: 'Redirecting',
        message: 'Connecting to GitHub...',
         position: 'center',
        overlay: true,
        close: false,
        pauseOnHover: false,
        timeout: 2000
    });
    const { data, error } = await supaBase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: 'https://rafay-1431.github.io/student-portal/dashboard.html'
        }

    })
    if (error) {
        iziToast.error({
            title: 'Authentication Failed',
            message: error.message || 'Could not connect to Google.',
            position: 'center',
            overlay: true,
            close: false,
            pauseOnHover: false,
            timeout: 2000
        });
    } 
})
