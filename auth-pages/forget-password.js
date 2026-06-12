import { supaBase } from "../subabase.js";


let forgetForm = document.getElementById('forgetForm');

forgetForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let email = document.getElementById('email').value;

    try {
        const { data, error } = await supaBase.auth.resetPasswordForEmail(email, {
             redirectTo: `https://rafay-1431.github.io/student-portal/auth-pages/resetpassword.html`,
            
        })
        
        if (error) {
            iziToast.error({
                title: 'Error',
                message: error.message,
                position: 'topRight'
            });
            return;
        }
        iziToast.success({
            title: 'Email Sent',
            message: 'Reset link sent! Please check your email inbox.',
            position: 'topRight',
        });
    }
    catch (err) {
        iziToast.error({ title: 'Error', message: 'Something went wrong.', position: 'topRight' });
    }

})