import { supaBase } from "../subabase.js";

let resetPassForm = document.getElementById('resetPassForm');

resetPassForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let newPassword = document.getElementById('newPassword').value;
    let confirmPassword = document.getElementById('confirmPassword').value;

    // 1. Password Match Validation
    if (newPassword !== confirmPassword) {
        iziToast.warning({
            title: 'Error',
            message: 'Passwords do not match!',
            position: 'topRight'
        });
        return;
    }

    try {
        // 2. Supabase ke zariye password update karna
        const { data, error } = await supaBase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            iziToast.error({
                title: 'Update Failed',
                message: error.message,
                position: 'topRight'
            });
            return;
        }

        // 3. Success Message aur Redirect
        iziToast.success({
            title: 'Success',
            message: 'Password updated successfully! Redirecting...',
            position: 'topRight',
            timeout: 2000,
            onClosing: function () {
                // Password change hone ke baad dashboard ya login page par bhej dein
                window.location.href = "https://rafay-1431.github.io/student-portal";
            }
        });

    } catch (err) {
        iziToast.error({
            title: 'Error',
            message: 'Something went wrong. Please try again.',
            position: 'topRight'
        });
    }
});