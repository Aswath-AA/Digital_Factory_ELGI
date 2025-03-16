document.addEventListener("DOMContentLoaded", function () {
    // ✅ Set today's date automatically
    const today = new Date().toISOString().split("T")[0];  // Format: YYYY-MM-DD
    const dateInput = document.getElementById("date");
    if (dateInput) {
        dateInput.value = today;
    }

    // ✅ Submit Form Data
    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
        submitBtn.addEventListener("click", async function (event) {
            event.preventDefault();  // Prevent form reload

            // Collect form data
            const data = {
                date: document.getElementById("date").value,
                tpl_No: document.getElementById("tpl_No").value,
                model: document.getElementById("model").value,
                cfm: document.getElementById("cfm").value,
                po_no: document.getElementById("po_no").value,
                wpr: document.getElementById("wpr").value,
                tank_part_no: document.getElementById("tank_part_no").value,
                tank_si_no: document.getElementById("tank_si_no").value,
                canopy_part_no: document.getElementById("canopy_part_no").value,
                canopy_si_no: document.getElementById("canopy_si_no").value
            };

            // Validate form data
            if (!data.date || !data.tpl_No || !data.model || !data.cfm || !data.po_no || !data.wpr || !data.tank_part_no || !data.tank_si_no || !data.canopy_part_no || !data.canopy_si_no) {
                alert("Please fill all required fields!");
                return;
            }

            try {
                const response = await fetch("/submit-store", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error(`Server returned ${response.status}: ${response.statusText}`);
                }

                const result = await response.json();
                alert(result.message); // ✅ Show success message
            } catch (error) {
                console.error("❌ Error:", error);
                alert("Failed to submit data. Please try again.");
            }
        });
    }

    // ✅ Navigate to next page when clicking "NEXT"
    const nextBtn = document.getElementById("nextBtn");
    if (nextBtn) {
        nextBtn.addEventListener("click", function () {
            window.location.href = "DFactory.html";  // Change to your next page
        });
    }
});