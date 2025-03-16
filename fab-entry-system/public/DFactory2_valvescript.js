document.getElementById("submitBtn").addEventListener("click", async function (event) {
    event.preventDefault(); // Prevent form reload

    // Collect form data
    const formData = {
        safety_valve_make: document.getElementById("safty_valve_make").value,
        batch_no: document.getElementById("batch_no").value,
        safety_valve_range: document.getElementById("range").value,
        solenoid_valve_make: document.getElementById("solenoid_valve_make").value,
        intake_valve_sl_no: document.getElementById("intake_valve_sl_no").value,
        tv_element: document.getElementById("tv_element").value,
        aos_batch_no: document.getElementById("aos_batch_no").value,
        mpv_sl_no: document.getElementById("mpv_sl_no").value,
        oil_filter_batch_no: document.getElementById("oil_filter_batch_no").value,
        assembly_remarks: document.getElementById("assembly_remarks").value,
        quality_remarks: document.getElementById("quality_remarks").value,
    };

    try {
        // Send data to the backend
        const response = await fetch("http://localhost:5000/submit-valve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        alert(result.message); // Show success message
    } catch (error) {
        console.error("❌ Error:", error);
        alert("Failed to submit data!");
    }
});

// Navigate to previous page
document.getElementById("backBtn").addEventListener("click", function () {
    window.history.back();
});

// Navigate to next page when clicking "NEXT"
document.getElementById("nextBtn").addEventListener("click", function () {
    window.location.href = "testbooth.html"; // Change to your next page
});