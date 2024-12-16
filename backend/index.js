const express = require("express");
const cors = require("cors");
const db = require('./db'); // Menggunakan require untuk mengimpor db
const response = require('./responses');

const app = express();
const port = 3000;

// Middleware
app.use(express.json()); // Middleware untuk parsing JSON
app.use(cors({ origin: "http://localhost:5173" })); // Sesuaikan dengan port React

// Routes

// 1. Mengambil Semua Data (Read)
app.get("/", (req, res) => {
    const query = "SELECT * FROM mahasiswa";
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).send("Database query error");
        } else {
            response(200, results, "Get all data mahasiswa", res);
        }
    });
});

// 2. Menambahkan Data Mahasiswa (Create)
app.post("/mahasiswa", (req, res) => {
    const { nim, nama_lengkap, kelas, alamat } = req.body;
    const query = "INSERT INTO mahasiswa (nim, nama_lengkap, kelas, alamat) VALUES (?, ?, ?, ?)";
    
    db.query(query, [nim, nama_lengkap, kelas, alamat], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).send("Failed to add data");
        } else {
            response(201, results, "Data mahasiswa added successfully", res);
        }
    });
});

// 3. Memperbarui Data Mahasiswa (Update)
app.put("/mahasiswa/:id", (req, res) => {
    const { id } = req.params;
    const { nim, nama_lengkap, kelas, alamat } = req.body;
    const query = "UPDATE mahasiswa SET nim = ?, nama_lengkap = ?, kelas = ?, alamat = ? WHERE id = ?";

    db.query(query, [nim, nama_lengkap, kelas, alamat, id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).send("Failed to update data");
        } else {
            if (results.affectedRows === 0) {
                res.status(404).send("Data not found");
            } else {
                response(200, results, "Data mahasiswa updated successfully", res);
            }
        }
    });
});

// 4. Menghapus Data Mahasiswa (Delete)
app.delete("/mahasiswa/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM mahasiswa WHERE id = ?";

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).send("Failed to delete data");
        } else {
            if (results.affectedRows === 0) {
                res.status(404).send("Data not found");
            } else {
                response(200, results, "Data mahasiswa deleted successfully", res);
            }
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
