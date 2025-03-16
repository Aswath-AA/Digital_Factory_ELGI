// Define the range for random values
const minKW = 10; // Minimum value for KW
const maxKW = 100; // Maximum value for KW
const minVolt = 200; // Minimum value for Volt
const maxVolt = 480; // Maximum value for Volt
const minAmp = 5; // Minimum value for AMP
const maxAmp = 50; // Maximum value for AMP
const minRPM = 1000; // Minimum value for RPM
const maxRPM = 3600; // Maximum value for RPM

// Function to generate random values and update input fields
function updateRandomValues() {
    const kw = Math.floor(Math.random() * (maxKW - minKW + 1)) + minKW;
    const voltHz = Math.floor(Math.random() * (maxVolt - minVolt + 1)) + minVolt;
    const amp = Math.floor(Math.random() * (maxAmp - minAmp + 1)) + minAmp;
    const rpm = Math.floor(Math.random() * (maxRPM - minRPM + 1)) + minRPM;

    // Update the input fields with new random values
    document.getElementById("kw").value = kw;
    document.getElementById("voltHz").value = voltHz;
    document.getElementById("amp").value = amp;
    document.getElementById("rpm").value = rpm;
}

// Continuously update random values every 1 second (1000 milliseconds)
setInterval(updateRandomValues, 1000);

document.getElementById("submitBtn").addEventListener("click", () => {
    const data = {
        fabNo: document.getElementById("fabNo").value,
        airendNo: document.getElementById("airendNo").value,
        make: document.getElementById("make").value,
        kw: document.getElementById("kw").value,
        serialNumber: document.getElementById("serialNumber").value,
        sf: document.getElementById("sf").value,
        voltHz: document.getElementById("voltHz").value,
        amp: document.getElementById("amp").value,
        hz: document.getElementById("hz").value,
        rpm: document.getElementById("rpm").value,
        frame: document.getElementById("frame").value,
        eff: document.getElementById("eff").value,
        medYear: document.getElementById("medYear").value,
        insClass: document.getElementById("insClass").value
    };
    console.log("Export Excel button clicked!");
    document.getElementById("exportExcel").addEventListener("click", () => {
        window.open("http://localhost:5000/export/excel");
    });    
    fetch("http://localhost:5000/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error("Error:", error));
});
document.getElementById("backBtn").addEventListener("click", () => {
    window.history.back(); // Goes back to the previous page
});
