document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    console.log("Username:", username); // Debug: Log username
    console.log("Password:", password); // Debug: Log password

    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();
        console.log("Response from server:", result); // Debug: Log server response

        if (response.ok) {
            alert(result.message); // Show success message
            window.location.href = result.redirectUrl; // Redirect to /store
        } else {
            alert(result.message); // Show error message
        }
    } catch (error) {
        console.error("❌ Error:", error);
        alert("Failed to login. Please try again.");
    }
});