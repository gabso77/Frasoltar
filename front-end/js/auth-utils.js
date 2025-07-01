// UTENTE LOGGATO
document.addEventListener("DOMContentLoaded", function () {
    const loggedInUser = localStorage.getItem("loggedInUser");

    const userInfoDiv = document.getElementById("user-info");
    const usernameSpan = document.getElementById("username");
    const signupBtn = document.getElementById("signup-btn");
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");

    if (loggedInUser) {
        usernameSpan.textContent = loggedInUser;
        userInfoDiv.style.display = "block";
        signupBtn.style.display = "none";
        loginBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";
    } else {
        logoutBtn.style.display = "none";
    }


    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.removeItem("loggedInUser"); // pulizia storage
            window.location.href = "./pages/login.html"; // redirect diretto
        });
    }
});