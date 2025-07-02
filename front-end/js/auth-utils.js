document.addEventListener("DOMContentLoaded", function () {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const userInfoDiv = document.getElementById("user-info");
    const usernameSpan = document.getElementById("username");
    const signupBtn = document.getElementById("signup-btn");
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");

    if (loggedInUser && usernameSpan && userInfoDiv) {
        userInfoDiv.style.display = "flex";
        usernameSpan.textContent = loggedInUser;
        if (signupBtn) signupBtn.style.display = "none";
        if (loginBtn) loginBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline-block";
    } else {
        if (logoutBtn) logoutBtn.style.display = "none";
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.removeItem("loggedInUser");
            window.location.href = "./pages/login.html";
        });
    }
});