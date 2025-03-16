 // ✅ Submit Form Data
 document.getElementById("submitBtn").addEventListener("click", async function (event) {
    event.preventDefault();  // Prevent form reload

    const data = {
        make: document.getElementById("make").value,
        fan_si_no: document.getElementById("fan_si_no").value,
        amps: document.getElementById("amps").value,
        kw: document.getElementById("kw").value,
        volt: document.getElementById("volt").value,
        cooler_si_no: document.getElementById("cooler_si_no").value,
        cp_si_no: document.getElementById("cp_si_no").value,
        cp_model: document.getElementById("cp_model").value,
        drg_no: document.getElementById("drg_no").value,
        plc_model: document.getElementById("plc_model").value,
        plc_si_no: document.getElementById("plc_si_no").value,
        vfd_model_no: document.getElementById("vfd_model_no").value,
        vfd_sl_no: document.getElementById("vfd_sl_no").value
    };

    try {
        const response = await fetch("http://localhost:5000/submit-assembly", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        alert(result.message); // ✅ Show success message
    } catch (error) {
        console.error("❌ Error:", error);
        alert("Failed to submit data!");
    }
});


// ✅ Navigate to previous page
document.getElementById("backBtn").addEventListener("click", function () {
    window.history.back();
});

// ✅ Navigate to next page
document.getElementById("nextBtn").addEventListener("click", function () {
    window.location.href = "DFactory2_valve.html";  // Change to your next page
});