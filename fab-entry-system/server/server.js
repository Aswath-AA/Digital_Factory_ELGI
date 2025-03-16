const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
const fs = require("fs");
const ExcelJS = require("exceljs");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Session middleware
app.use(
    session({
        secret: "your-secret-key",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

// Middleware to check if the user is logged in
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/"); // Redirect to login page if not logged in
    }
    next();
};

// Protected route
app.get("/store", requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "Store.html"));
});

// Hash the password before inserting into the database
const password = "admin123";
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error("❌ Error hashing password:", err);
    } else {
        console.log("Hashed password:", hash);

        // Insert or update the user in the database
        const sql = "INSERT INTO users (username, password) VALUES (?, ?) ON DUPLICATE KEY UPDATE password = ?";
        db.query(sql, ["admin", hash, hash], (err, result) => {
            if (err) {
                console.error("❌ Error inserting/updating user:", err);
            } else {
                console.log("✅ User inserted or updated successfully!");
            }
        });
    }
});

// 📁 Create an exports folder if it doesn't exist
const exportsDir = path.join(__dirname, "exports");
if (!fs.existsSync(exportsDir)) fs.mkdirSync(exportsDir, { recursive: true });

app.use("/exports", express.static(exportsDir));

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

// Serve login page as the default route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "1login.html"));
});

// Serve Store Page (protected route)
app.get("/store", requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "Store.html"));
});

// Serve Digital Factory Page
app.get("/digital-factory", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "DFactory.html"));
});

// Serve Digital Factory Valve Page
app.get("/digital-factory-valve", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "DFactory2_valve.html"));
});

// Serve Test Booth Page
app.get("/test-booth", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "testbooth.html"));
});

// Login endpoint
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const sql = "SELECT * FROM users WHERE username = ?";
        db.query(sql, [username], async (err, results) => {
            if (err) {
                console.error("❌ Database error:", err);
                return res.status(500).json({ message: "Database error" });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: "Invalid username or password" });
            }

            const user = results[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid username or password" });
            }

            // Set session variable
            req.session.user = user;

            // Login successful
            res.json({ message: "Login successful!", redirectUrl: "/store" });
        });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// 📌 Handle Form Submission (Save to Database)
app.post("/submit-store", (req, res) => {
    const { date, tpl_No, model, cfm, po_no, wpr, tank_part_no, tank_si_no, canopy_part_no, canopy_si_no } = req.body;

    const sql = `INSERT INTO store_details (date, tpl_No, model, cfm, po_no, wpr, tank_part_no, tank_si_no, canopy_part_no, canopy_si_no)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [date, tpl_No, model, cfm, po_no, wpr, tank_part_no, tank_si_no, canopy_part_no, canopy_si_no], (err, result) => {
        if (err) {
            console.error("❌ Error inserting data:", err);
            res.status(500).json({ message: "Database insertion failed" });
        } else {
            res.json({ message: "✅ Store data saved successfully!" });
        }
    });
});

// 📌 Handle Form Submission (Save to Database)
app.post("/submit-assembly", (req, res) => {
    const {
        make, fan_si_no, amps, kw, volt, cooler_si_no,
        cp_si_no, cp_model, drg_no, plc_model, plc_si_no,
        vfd_model_no, vfd_sl_no
    } = req.body;

    const sql = `INSERT INTO Digital_Factory_P1 (make, fan_si_no, amps, kw, volt, cooler_si_no, cp_si_no, cp_model, drg_no, plc_model, plc_si_no, vfd_model_no, vfd_sl_no)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [make, fan_si_no, amps, kw, volt, cooler_si_no, cp_si_no, cp_model, drg_no, plc_model, plc_si_no, vfd_model_no, vfd_sl_no], (err, result) => {
        if (err) {
            console.error("❌ Error inserting data:", err);
            res.status(500).json({ message: "Database insertion failed" });
        } else {
            res.json({ message: "✅ Assembly station data saved successfully!" });
        }
    });
});

// Handle form submission
app.post("/submit", (req, res) => {
    const {
        fabNo, airendNo, make, kw, serialNumber, sf, voltHz,
        amp, hz, rpm, frame, eff, medYear, insClass
    } = req.body;

    const sql = `INSERT INTO fab_details 
        (fabNo, airendNo, make, kw, serialNumber, sf, voltHz, amp, hz, rpm, frame, eff, medYear, insClass) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [fabNo, airendNo, make, kw, serialNumber, sf, voltHz, amp, hz, rpm, frame, eff, medYear, insClass], 
        (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                res.status(500).json({ message: "Database insertion failed" });
            } else {
                res.json({ message: "Data successfully submitted!" });
            }
        }
    );
});

// Handle form submission
app.post("/submit-valve", (req, res) => {
    const {
        safety_valve_make,
        batch_no,
        safety_valve_range,
        solenoid_valve_make,
        intake_valve_sl_no,
        tv_element,
        aos_batch_no,
        mpv_sl_no,
        oil_filter_batch_no,
        assembly_remarks,
        quality_remarks,
    } = req.body;

    const sql = `
        INSERT INTO Digital_Factory_P2 (
            safety_valve_make, batch_no, safety_valve_range,
            solenoid_valve_make, intake_valve_sl_no, tv_element,
            aos_batch_no, mpv_sl_no, oil_filter_batch_no,
            assembly_remarks, quality_remarks
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        safety_valve_make,
        batch_no,
        safety_valve_range,
        solenoid_valve_make,
        intake_valve_sl_no,
        tv_element,
        aos_batch_no,
        mpv_sl_no,
        oil_filter_batch_no,
        assembly_remarks,
        quality_remarks,
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("❌ Error inserting data:", err);
            res.status(500).json({ message: "Database insertion failed", error: err.message });
        } else {
            res.json({ message: "✅ Assembly data saved successfully!" });
        }
    });
});

// 📌 Route to export Excel (With Data from `store_details`, `Digital_Factory_P1`, `Digital_Factory_P2`, & `fab_details`)
app.get("/export/excel", async (req, res) => {
    const storeSql = "SELECT * FROM store_details ORDER BY id DESC LIMIT 1";
    const assemblySql = "SELECT * FROM Digital_Factory_P1 ORDER BY id DESC LIMIT 1";
    const valveSql = "SELECT * FROM Digital_Factory_P2 ORDER BY id DESC LIMIT 1";
    const fabSql = "SELECT * FROM fab_details ORDER BY id DESC LIMIT 1";

    try {
        const [storeResults, assemblyResults, valveResults, fabResults] = await Promise.all([
            new Promise((resolve, reject) => {
                db.query(storeSql, (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            }),
            new Promise((resolve, reject) => {
                db.query(assemblySql, (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            }),
            new Promise((resolve, reject) => {
                db.query(valveSql, (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            }),
            new Promise((resolve, reject) => {
                db.query(fabSql, (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            }),
        ]);

        // Debugging: Log the fetched data
        console.log("Store Data:", storeResults);
        console.log("Assembly Data:", assemblyResults);
        console.log("Valve Data:", valveResults);
        console.log("Fab Data:", fabResults);

        // Check if all data is available
        if (storeResults.length === 0) {
            return res.status(404).json({ message: "Store data not found" });
        }
        if (assemblyResults.length === 0) {
            return res.status(404).json({ message: "Assembly data not found" });
        }
        if (valveResults.length === 0) {
            return res.status(404).json({ message: "Valve data not found" });
        }
        if (fabResults.length === 0) {
            return res.status(404).json({ message: "Fab data not found" });
        }

        const storeEntry = storeResults[0];
        const assemblyEntry = assemblyResults[0];
        const valveEntry = valveResults[0];
        const fabEntry = fabResults[0];

        const templatePath = path.join(__dirname, "Built_Up_Record_Template.xlsx");
        const outputExcelPath = path.join(exportsDir, "FAB_Store_Data.xlsx");

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);
        const worksheet = workbook.getWorksheet(1);

        // ✅ Insert `store_details` Data
        worksheet.getCell("B2").value = storeEntry.date || "N/A";
        worksheet.getCell("F2").value = storeEntry.tpl_no || "N/A";
        worksheet.getCell("H2").value = storeEntry.model || "N/A";
        worksheet.getCell("D2").value = storeEntry.cfm || "N/A";
        worksheet.getCell("B3").value = storeEntry.po_no || "N/A";
        worksheet.getCell("D3").value = storeEntry.wpr || "N/A";
        worksheet.getCell("B13").value = storeEntry.tank_part_no || "N/A";
        worksheet.getCell("F13").value = storeEntry.tank_si_no || "N/A";
        worksheet.getCell("B11").value = storeEntry.canopy_part_no || "N/A";
        worksheet.getCell("B12").value = storeEntry.canopy_si_no || "N/A"; // Fix typo: canopy_si_no

        // ✅ Insert 'Digital_Factory_P1' Data
        worksheet.getCell("F8").value = assemblyEntry.make || "N/A";
        worksheet.getCell("F9").value = assemblyEntry.fan_si_no || "N/A";
        worksheet.getCell("F10").value = assemblyEntry.amps || "N/A";
        worksheet.getCell("F11").value = assemblyEntry.kw || "N/A";
        worksheet.getCell("F12").value = assemblyEntry.volt || "N/A";
        worksheet.getCell("B15").value = assemblyEntry.cooler_si_no || "N/A";
        worksheet.getCell("H8").value = assemblyEntry.cp_si_no || "N/A";
        worksheet.getCell("H9").value = assemblyEntry.cp_model || "N/A";
        worksheet.getCell("H10").value = assemblyEntry.drg_no || "N/A";
        worksheet.getCell("H11").value = assemblyEntry.plc_model || "N/A";
        worksheet.getCell("H12").value = assemblyEntry.plc_si_no || "N/A";
        worksheet.getCell("B14").value = assemblyEntry.vfd_model_no || "N/A";
        worksheet.getCell("F14").value = assemblyEntry.vfd_sl_no || "N/A";

        // ✅ Insert 'Digital_Factory_P2' Data
        worksheet.getCell("H16").value = valveEntry.safety_valve_make || "N/A";
        worksheet.getCell("H17").value = valveEntry.batch_no || "N/A";
        worksheet.getCell("H18").value = valveEntry.safety_valve_range || "N/A";
        worksheet.getCell("B17").value = valveEntry.solenoid_valve_make || "N/A";
        worksheet.getCell("B18").value = valveEntry.intake_valve_sl_no || "N/A";
        worksheet.getCell("E18").value = valveEntry.tv_element || "N/A";
        worksheet.getCell("B19").value = valveEntry.aos_batch_no || "N/A";
        worksheet.getCell("E19").value = valveEntry.mpv_sl_no || "N/A";
        worksheet.getCell("G19").value = valveEntry.oil_filter_batch_no || "N/A";
        worksheet.getCell("B20").value = valveEntry.assembly_remarks || "N/A";
        worksheet.getCell("B21").value = valveEntry.quality_remarks || "N/A";

        // ✅ Insert `fab_details` Data
        worksheet.getCell("F3").value = fabEntry.fabNo || "N/A";
        worksheet.getCell("B5").value = fabEntry.make || "N/A";
        worksheet.getCell("F6").value = fabEntry.airendNo || "N/A";
        worksheet.getCell("B6").value = fabEntry.serialNumber || "N/A";
        worksheet.getCell("B8").value = fabEntry.kw || "N/A";
        worksheet.getCell("B9").value = fabEntry.voltHz || "N/A";
        worksheet.getCell("B10").value = fabEntry.hz || "N/A";
        worksheet.getCell("D10").value = fabEntry.sf || "N/A";
        worksheet.getCell("D7").value = fabEntry.amp || "N/A";
        worksheet.getCell("D6").value = fabEntry.rpm || "N/A";
        worksheet.getCell("D8").value = fabEntry.frame || "N/A";
        worksheet.getCell("D9").value = fabEntry.eff || "N/A";
        worksheet.getCell("B7").value = fabEntry.medYear || "N/A";
        worksheet.getCell("D5").value = fabEntry.insClass || "N/A";

        // ✅ Save Excel File
        await workbook.xlsx.writeFile(outputExcelPath);
        res.download(outputExcelPath, "FAB_Store_Data.xlsx");
    } catch (error) {
        console.error("❌ Error exporting Excel:", error);
        res.status(500).json({ message: "Error exporting Excel file", error: error.message });
    }
});

// Login endpoint
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const sql = "SELECT * FROM users WHERE username = ?";
        db.query(sql, [username], async (err, results) => {
            if (err) {
                console.error("❌ Database error:", err);
                return res.status(500).json({ message: "Database error" });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: "Invalid username or password" });
            }

            const user = results[0];

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid username or password" });
            }

            // Set session variable
            req.session.user = user;

            // Login successful
            res.json({ message: "Login successful!", redirectUrl: "/store" });
        });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// 📌 Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));