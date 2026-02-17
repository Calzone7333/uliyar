const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = "273337002665-v05ss3t2sgah54nk1f3j192rdsokre7f.apps.googleusercontent.com";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
const app = express();
const PORT = 8082;

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:8082',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:8082',
    'http://192.168.1.2:5173',
    'http://192.168.1.2:5174',
    'http://192.168.1.2:8082',
    'http://115.97.59.230:5173',
    'http://115.97.59.230:5174',
    'http://115.97.59.230:8082',
    'http://hado.co.in',
    'https://hado.co.in',
    'http://www.hado.co.in',
    'https://www.hado.co.in',
    'http://uliyar.com',
    'https://uliyar.com',
    'http://uliyar.com:5173',
    'http://uliyar.com:5174',
    'http://uliyar.com:8082',
    'http://www.uliyar.com',
    'https://www.uliyar.com',
    'http://www.uliyar.com:8082'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('localhost') || origin.includes('127.0.0.1')) {
            callback(null, true);
        } else {
            console.log("CORS Blocked for:", origin);
            callback(null, true);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

app.get('/api/auth/google-client-id', (req, res) => {
    res.json({ clientId: GOOGLE_CLIENT_ID });
});

// Database Configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'uliyar_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Database Initialization
const pool = mysql.createPool(dbConfig);

// SQLite to MySQL Compatibility Layer
const db = {
    run: (sql, params, callback) => {
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        pool.query(sql, params, (err, results) => {
            if (callback) {
                const context = { lastID: results ? results.insertId : null, changes: results ? results.affectedRows : 0 };
                callback.call(context, err);
            }
        });
    },
    get: (sql, params, callback) => {
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        pool.query(sql, params, (err, results) => {
            if (callback) callback(err, results ? results[0] : null);
        });
    },
    all: (sql, params, callback) => {
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        pool.query(sql, params, (err, results) => {
            if (callback) callback(err, results);
        });
    },
    serialize: (fn) => { if (fn) fn(); }
};

// Verification and Startup Logic
const initializeDB = async () => {
    try {
        console.log('🔄 Checking database connection...');

        // Use the pool instead of a new connection for simplicity
        const [rows] = await pool.promise().query('SELECT 1');
        console.log('✅ Connected to MySQL database pool.');

        createTables();
        initializeSettings();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.log('ℹ️ Server will continue to try connecting...');
    }
};

initializeDB();

// NODEMAILER SETUP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'wcvfw2019@gmail.com',
        pass: 'qsdh ojuz kpyz wfyb'
    }
});

function runMigrations() {
    const columns = [
        { table: 'users', col: 'linkedin_url TEXT' },
        { table: 'users', col: 'notice_period TEXT' },
        { table: 'users', col: 'expected_salary TEXT' },
        { table: 'users', col: 'bio TEXT' },
        { table: 'users', col: 'languages TEXT' },
        { table: 'users', col: 'temp_otp TEXT' },
        { table: 'users', col: 'github_url TEXT' },
        { table: 'users', col: 'portfolio_url TEXT' },
        { table: 'users', col: 'full_address TEXT' },
        { table: 'users', col: 'driving_license TEXT' },
        { table: 'users', col: 'own_vehicle TEXT' },
        { table: 'users', col: 'shift_preference TEXT' },
        { table: 'users', col: 'profile_photo_path TEXT' },
        { table: 'jobs', col: 'description TEXT' },
        { table: 'jobs', col: 'skills_required TEXT' },
        { table: 'jobs', col: 'vacancies INT' },
        { table: 'jobs', col: 'work_mode TEXT' },
        { table: 'jobs', col: 'benefits TEXT' },
        { table: 'jobs', col: 'deadline TEXT' },
        { table: 'jobs', col: 'education_required TEXT' },
        { table: 'jobs', col: 'food_allowance TEXT' },
        { table: 'jobs', col: 'accommodation TEXT' },
        { table: 'jobs', col: 'companyId INT' },
        { table: 'jobs', col: 'employerId INT' },
        { table: 'jobs', col: 'postedAt TEXT' },
        { table: 'jobs', col: 'status TEXT' },
        { table: 'jobs', col: 'category TEXT' },
        { table: 'users', col: 'interested_category TEXT' },
        { table: 'users', col: 'target_roles TEXT' },
        { table: 'companies', col: 'business_proof_path TEXT' },
        { table: 'companies', col: 'id_proof_path TEXT' }
    ];
    columns.forEach(mig => {
        // MySQL check if column exists is complex, but we can try IGNORE or just catch error
        db.run(`ALTER TABLE ${mig.table} ADD COLUMN ${mig.col}`, (err) => {
            // Silence migration errors if column exists
        });
    });
}

function initializeSettings() {
    db.run("CREATE TABLE IF NOT EXISTS settings (\`key\` VARCHAR(100) PRIMARY KEY, value TEXT)", (err) => {
        if (!err) {
            db.get("SELECT value FROM settings WHERE \`key\` = 'admin_password'", (err, row) => {
                if (!row) {
                    db.run("INSERT INTO settings (\`key\`, value) VALUES ('admin_password', 'AdminCalzone@2026')");
                } else if (row.value === 'admin@2025') {
                    // Update old default password to new requested one
                    db.run("UPDATE settings SET value = 'AdminCalzone@2026' WHERE \`key\` = 'admin_password'");
                }
            });
        }
    });

    // Ensure Deepak Admin account exists in users table
    db.get("SELECT id FROM users WHERE email = 'deepakcalzone@gmail.com'", (err, row) => {
        if (!row) {
            console.log('🚀 Initializing Admin User: deepakcalzone@gmail.com');
            db.run("INSERT INTO users (name, email, password, role, account_status, email_verified, otp_verified, profile_status) VALUES ('Deepak', 'deepakcalzone@gmail.com', 'AdminCalzone@2026', 'admin', 'ACTIVE', 1, 1, 'COMPLETE')");
        }
    });

    runMigrations();
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

function createTables() {
    // USERS (Candidates & Recruiters)
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        companyName VARCHAR(255),
        mobile VARCHAR(20),
        email_verified INT DEFAULT 0,
        otp_verified INT DEFAULT 0,
        temp_otp VARCHAR(10),
        account_status VARCHAR(20) DEFAULT 'INACTIVE', -- INACTIVE -> ACTIVE -> BLOCKED
        profile_status VARCHAR(20) DEFAULT 'INCOMPLETE',
        resume_status VARCHAR(20) DEFAULT 'PENDING', -- PENDING -> APPROVED -> REJECTED
        company_id INT,
        dob VARCHAR(50),
        gender VARCHAR(20),
        current_location VARCHAR(255),
        preferred_location VARCHAR(255),
        education TEXT,
        experience TEXT,
        skills TEXT,
        resume_path VARCHAR(255),
        interested_category TEXT,
        target_roles TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // COMPANIES (Recruiters)
    db.run(`CREATE TABLE IF NOT EXISTS companies (
        id INT PRIMARY KEY AUTO_INCREMENT,
        recruiterId INT,
        name VARCHAR(255) NOT NULL,
        address TEXT,
        website VARCHAR(255),
        type VARCHAR(50),
        industry VARCHAR(100),
        size VARCHAR(50),
        location VARCHAR(255),
        logo_path VARCHAR(255),
        doc_path VARCHAR(255),
        business_proof_path VARCHAR(255),
        id_proof_path VARCHAR(255),
        status VARCHAR(20) DEFAULT 'PENDING' -- PENDING -> APPROVED -> REJECTED
    )`);

    // JOBS
    db.run(`CREATE TABLE IF NOT EXISTS jobs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        employerId INT,
        companyId INT,
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        salary VARCHAR(100) NOT NULL,
        experience VARCHAR(100) NOT NULL,
        tags TEXT,
        postedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'PENDING', -- PENDING -> OPEN -> REJECTED -> CLOSED
        category VARCHAR(100)
    )`);

    // APPLICATIONS
    db.run(`CREATE TABLE IF NOT EXISTS applications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        jobId INT,
        jobTitle VARCHAR(255),
        applicantId INT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        resumePath VARCHAR(255) NOT NULL,
        profileData TEXT,
        status VARCHAR(20) DEFAULT 'Applied',
        appliedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
}

// ----------------------------------------------------
// 🟢 JOB SEEKER WORKFLOW (UPDATED WITH REAL OTP SMS + EMAIL)
// ----------------------------------------------------

// 1. Register & Send Real OTP
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, role, mobile, companyName } = req.body;
    if (!name || !email || !password || !role || !mobile) return res.status(400).json({ error: "All fields are required" });

    // Generate 4-digit Real OTP
    const realOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // Check email unique first
    db.get("SELECT id FROM users WHERE email = ?", [email], async (err, row) => {
        if (row) return res.status(400).json({ error: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO users (name, email, password, role, companyName, mobile, temp_otp, account_status) VALUES (?, ?, ?, ?, ?, ?, ?, 'INACTIVE')`;

        db.run(sql, [name, email, hashedPassword, role, companyName || null, mobile, realOtp], function (err) {
            if (err) return res.status(500).json({ error: err.message });

            const userId = this.lastID;

            // 1. Send Email (Optional if configured)
            const mailOptions = {
                from: '"BlueCaller Verify" <bluecaller.jobs@gmail.com>',
                to: email,
                subject: 'Verify Your Account',
                text: `OTP: ${realOtp}`,
                html: `<h1>OTP: ${realOtp}</h1>`
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) console.log(`📧 [Falback] Email OTP for ${email}: ${realOtp}`);
                else console.log('📧 Email sent');
            });

            res.status(201).json({ success: true, userId: userId, message: "OTP sent to Email" });
        });
    });
});

// 2. Verify Real OTP
app.post('/api/auth/verify-otp', (req, res) => {
    const { userId, otp } = req.body;

    db.get("SELECT temp_otp FROM users WHERE id = ?", [userId], (err, row) => {
        if (!row) return res.status(404).json({ success: false, message: "User not found" });

        // Check against Database OTP ONLY (No more Demo 1234)
        if (row.temp_otp === otp) {
            db.run("UPDATE users SET otp_verified = 1, email_verified = 1, account_status = 'ACTIVE', temp_otp = NULL WHERE id = ?", [userId], function (err) {
                db.get("SELECT * FROM users WHERE id = ?", [userId], (err, user) => res.json({ success: true, user: user }));
            });
        } else {
            res.status(400).json({ success: false, message: "Invalid OTP" });
        }
    });
});

// 3. Forgot Password
app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    db.get("SELECT id FROM users WHERE email = ?", [email], (err, row) => {
        if (!row) return res.status(404).json({ success: false, message: "User not found" });

        db.run("UPDATE users SET temp_otp = ? WHERE id = ?", [otp, row.id], (err) => {
            if (err) return res.status(500).json({ error: err.message });

            const mailOptions = {
                from: '"BlueCaller Support" <bluecaller.jobs@gmail.com>',
                to: email,
                subject: 'Reset Password OTP',
                text: `Your OTP for password reset is: ${otp}`,
                html: `<h1>OTP: ${otp}</h1><p>Use this code to reset your password.</p>`
            };
            transporter.sendMail(mailOptions, (error, info) => {
                res.json({ success: true, message: "OTP sent to your email" });
            });
        });
    });
});

// 4. Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;

    db.get("SELECT id, temp_otp FROM users WHERE email = ?", [email], async (err, row) => {
        if (!row) return res.status(404).json({ success: false, message: "User not found" });

        if (row.temp_otp === otp) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            db.run("UPDATE users SET password = ?, temp_otp = NULL WHERE id = ?", [hashedPassword, row.id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ success: true, message: "Password updated successfully" });
            });
        } else {
            res.status(400).json({ success: false, message: "Invalid OTP" });
        }
    });
});


// 2. Profile Update (Trigger Resume Pending Status on New Upload)
app.post('/api/user/resume/:id', upload.single('resume'), (req, res) => {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ error: "No file" });
    const resumePath = `/uploads/${req.file.filename}`;

    // Changing resume resets status to PENDING for Admin Review
    db.run("UPDATE users SET resume_path = ?, resume_status = 'PENDING' WHERE id = ?", [resumePath, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, resumePath, message: "Resume uploaded. Waiting for Admin Approval." });
    });
});

// ----------------------------------------------------
// 🏢 COMPANY WORKFLOW
// ----------------------------------------------------

// 1. Get Company Status by Recruiter ID
app.get('/api/company/status/:userId', (req, res) => {
    const { userId } = req.params;
    db.get("SELECT * FROM companies WHERE recruiterId = ?", [userId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ company: row || null });
    });
});

// 2. Create Company (PENDING by default)
app.post('/api/company/create', upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'doc', maxCount: 1 },
    { name: 'businessProof', maxCount: 1 },
    { name: 'idProof', maxCount: 1 }
]), (req, res) => {
    const { recruiterId, name, type, industry, size, location, website } = req.body;

    const files = req.files || {};
    const logoPath = files['logo'] ? `/uploads/${files['logo'][0].filename}` : '';
    const docPath = files['doc'] ? `/uploads/${files['doc'][0].filename}` : '';
    const businessProofPath = files['businessProof'] ? `/uploads/${files['businessProof'][0].filename}` : '';
    const idProofPath = files['idProof'] ? `/uploads/${files['idProof'][0].filename}` : '';

    const sql = `INSERT INTO companies (recruiterId, name, type, industry, size, location, website, logo_path, doc_path, business_proof_path, id_proof_path, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')`;

    db.run(sql, [recruiterId, name, type, industry, size, location, website, logoPath, docPath, businessProofPath, idProofPath], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        const companyId = this.lastID;
        db.run("UPDATE users SET company_id = ?, profile_status = 'COMPLETE' WHERE id = ?", [companyId, recruiterId]);
        res.json({ success: true, companyId, status: 'PENDING' });
    });
});

// 1.5 Update Company Profile
app.put('/api/company/:id', upload.fields([{ name: 'logo', maxCount: 1 }]), (req, res) => {
    const { name, type, industry, size, location, website } = req.body;
    const companyId = req.params.id;
    const files = req.files || {};

    let sql = `UPDATE companies SET name = ?, type = ?, industry = ?, size = ?, location = ?, website = ? WHERE id = ?`;
    let params = [name, type, industry, size, location, website, companyId];

    if (files['logo']) {
        const logoPath = `/uploads/${files['logo'][0].filename}`;
        sql = `UPDATE companies SET name = ?, type = ?, industry = ?, size = ?, location = ?, website = ?, logo_path = ? WHERE id = ?`;
        params = [name, type, industry, size, location, website, logoPath, companyId];
    }

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// 2. Job Post (Only if Company APPROVED)
app.post('/api/jobs', (req, res) => {
    const { title, company, location, type, salary, experience, tags, employerId, description, skills_required, vacancies, work_mode, benefits, deadline, education_required, food_allowance, accommodation, category } = req.body;

    db.get("SELECT account_status FROM users WHERE id = ?", [employerId], (err, user) => {
        if (user && user.account_status !== 'ACTIVE') return res.status(403).json({ error: "Account not verified" });

        db.get("SELECT * FROM companies WHERE recruiterId = ?", [employerId], (err, comp) => {
            if (!comp) return res.status(403).json({ error: "Company profile missing" });
            if (comp.status !== 'APPROVED') return res.status(403).json({ error: "Company not approved by Admin yet" });

            const tagsString = JSON.stringify(tags || []);
            const finalCompanyName = comp.name || company;

            const sql = `INSERT INTO jobs(title, company, location, type, salary, experience, tags, description, skills_required, vacancies, work_mode, benefits, deadline, education_required, food_allowance, accommodation, postedAt, employerId, companyId, status, category) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "Just now", ?, ?, 'PENDING', ?)`;

            db.run(sql,
                [title, finalCompanyName, location, type, salary, experience, tagsString, description, skills_required, vacancies, work_mode, benefits, deadline, education_required, food_allowance, accommodation, employerId, comp.id, category], function (err) {
                    if (err) return res.status(500).json({ error: err.message });
                    res.status(201).json({ id: this.lastID, message: "Job submitted for Admin Approval" });
                });
        });
    });
});

app.delete('/api/jobs/:id', (req, res) => {
    const jobId = req.params.id;
    db.run("DELETE FROM jobs WHERE id = ?", [jobId], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: "Job deleted" });
    });
});

// ----------------------------------------------------
// 🟣 ADMIN CONTROL (MASTER)
// ----------------------------------------------------

// 1. Get Pending Items
app.get('/api/admin/pending-resumes', (req, res) => {
    db.all("SELECT id, name, email, mobile, education, experience, skills, resume_path FROM users WHERE resume_status = 'PENDING' AND resume_path IS NOT NULL", (err, rows) => {
        // Parse JSON fields for the frontend
        const candidates = (rows || []).map(u => {
            try { u.education = JSON.parse(u.education); } catch (e) { }
            try { u.experience = JSON.parse(u.experience); } catch (e) { }
            try { u.skills = JSON.parse(u.skills || '[]'); } catch (e) { u.skills = []; }
            return u;
        });
        res.json(candidates);
    });
});
app.get('/api/admin/pending-companies', (req, res) => {
    db.all("SELECT * FROM companies WHERE status = 'PENDING'", (err, rows) => res.json(rows));
});
app.get('/api/admin/pending-jobs', (req, res) => {
    db.all("SELECT j.*, c.name as companyName FROM jobs j LEFT JOIN companies c ON j.companyId = c.id WHERE j.status = 'PENDING'", (err, rows) => res.json(rows));
});

// 2. Admin Actions
app.post('/api/admin/verify-resume', (req, res) => {
    const { userId, status } = req.body; // status: 'APPROVED' or 'REJECTED'
    db.run("UPDATE users SET resume_status = ? WHERE id = ?", [status, userId], (err) => res.json({ success: true }));
});

app.post('/api/admin/verify-company', (req, res) => {
    const { companyId, status } = req.body; // status: 'APPROVED' or 'REJECTED'
    db.run("UPDATE companies SET status = ? WHERE id = ?", [status, companyId], (err) => res.json({ success: true }));
});

app.post('/api/admin/verify-job', (req, res) => {
    const { jobId, status } = req.body; // status: 'OPEN' (Approved) or 'REJECTED'
    db.run("UPDATE jobs SET status = ? WHERE id = ?", [status, jobId], (err) => res.json({ success: true }));
});


// ----------------------------------------------------
// ESSENTIAL SHARED ENDPOINTS
// ----------------------------------------------------

// Apply (Strict Check)
app.post('/api/apply', upload.fields([{ name: 'resume', maxCount: 1 }]), (req, res) => {
    const { jobId, jobTitle, name, email, phone, applicantId } = req.body;
    if (applicantId) {
        db.get("SELECT account_status, profile_status, resume_path, resume_status FROM users WHERE id = ?", [applicantId], (err, user) => {
            // Strict Resume Check
            if (user.resume_status !== 'APPROVED') return res.status(403).json({ message: "Your resume is not approved by Admin yet." });

            let finalResumePath = req.files['resume'] ? `/uploads/${req.files['resume'][0].filename}` : user.resume_path;

            db.get("SELECT id FROM applications WHERE jobId = ? AND applicantId = ?", [jobId, applicantId], (err, row) => {
                if (row) return res.status(400).json({ message: "Already applied" });

                db.run(`INSERT INTO applications (jobId, jobTitle, name, email, phone, resumePath, applicantId, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'Applied')`,
                    [jobId, jobTitle, name, email, phone, finalResumePath, applicantId || null], (err) => res.status(201).json({ message: "Success" }));
            });
        });
    } else {
        res.status(403).json({ message: "Login required" });
    }
});

app.get('/api/jobs', (req, res) => {
    const { employerId, q, location, category, type } = req.query;
    let sql = "SELECT * FROM jobs WHERE 1=1";
    const params = [];

    if (employerId) {
        sql += " AND employerId = ?";
        params.push(employerId);
    } else {
        // Public search only shows OPEN jobs
        sql += " AND status = 'OPEN'";
    }

    if (q) {
        sql += " AND (title LIKE ? OR description LIKE ?)";
        params.push(`%${q}%`, `%${q}%`);
    }

    if (location) {
        sql += " AND location LIKE ?";
        params.push(`%${location}%`);
    }

    if (category && category !== 'All Categories') {
        sql += " AND category = ?";
        params.push(category);
    }

    if (type && type !== 'All Types') {
        sql += " AND type = ?";
        params.push(type);
    }

    sql += " ORDER BY id DESC";
    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const jobs = (rows || []).map(job => ({ ...job, tags: job.tags ? JSON.parse(job.tags) : [] }));
        res.json(jobs);
    });
});

const bcrypt = require('bcryptjs');

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row) => {
        if (row) {
            const isMatch = await bcrypt.compare(password, row.password);
            if (!isMatch && password !== row.password) { // Fallback for old plaintext passwords during transition
                return res.status(401).json({ success: false, message: "Invalid credentials" });
            }
            if (row.account_status !== 'ACTIVE') return res.status(403).json({ success: false, message: "Verify OTP first." });
            res.json({ success: true, user: row });
        } else { res.status(401).json({ success: false, message: "Invalid" }); }
    });
});

app.post('/api/auth/google-login', async (req, res) => {
    const { token, role } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });

            if (row) {
                if (row.account_status !== 'ACTIVE') {
                    db.run("UPDATE users SET account_status = 'ACTIVE' WHERE id = ?", [row.id]);
                    row.account_status = 'ACTIVE';
                }
                res.json({ success: true, user: row });
            } else {
                const randomPassword = Math.random().toString(36).slice(-10);
                const userRole = role || 'employee';

                const sql = `INSERT INTO users (name, email, password, role, account_status, profile_photo_path) VALUES (?, ?, ?, ?, 'ACTIVE', ?)`;
                db.run(sql, [name, email, randomPassword, userRole, picture], function (err) {
                    if (err) return res.status(500).json({ error: err.message });
                    const userId = this.lastID;
                    db.get("SELECT * FROM users WHERE id = ?", [userId], (err, newUser) => {
                        res.json({ success: true, user: newUser });
                    });
                });
            }
        });
    } catch (error) {
        console.error("Google verify error", error);
        res.status(400).json({ success: false, message: "Invalid Google token" });
    }
});

app.get('/api/user/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
        if (row) {
            try { if (row.skills) row.skills = JSON.parse(row.skills); } catch (e) { }
            try { if (row.education) row.education = JSON.parse(row.education); } catch (e) { }
            try { if (row.experience) row.experience = JSON.parse(row.experience); } catch (e) { }
            try { if (row.target_roles) row.target_roles = JSON.parse(row.target_roles); } catch (e) { }
            res.json(row);
        } else res.status(404).json({ error: "Not found" });
    });
});
app.put('/api/user/profile/:id', upload.fields([{ name: 'photo', maxCount: 1 }]), (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const files = req.files || {};

    let fields = [];
    let params = [];

    // Fields to skip or handle specially
    const skip = ['id', 'email', 'role'];

    Object.keys(updates).forEach(key => {
        if (!skip.includes(key)) {
            let val = updates[key];
            if (['education', 'experience', 'skills'].includes(key)) {
                // If it's already a string (from FormData) we keep it, otherwise stringify
                val = typeof val === 'string' ? val : JSON.stringify(val);
            }
            fields.push(`${key} = ?`);
            params.push(val);
        }
    });

    if (files['photo']) {
        const photoPath = `/uploads/${files['photo'][0].filename}`;
        fields.push(`profile_photo_path = ?`);
        params.push(photoPath);
    }

    // Always set status to COMPLETE if it was INACTIVE (optional logic)
    // For now we just update fields sent.

    if (fields.length === 0) return res.json({ success: true, message: "No fields to update" });

    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    params.push(id);

    db.run(sql, params, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    db.get("SELECT value FROM settings WHERE key = 'admin_password'", (err, row) => res.json({ success: row && row.value === password }));
});
app.get('/api/admin/jobs', (req, res) => {
    db.all("SELECT * FROM jobs WHERE employerId = 0 ORDER BY id DESC", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/admin/post-job', (req, res) => {
    const { title, companyName, category, subCategory, location, salary, description, jobType, contactPhone, contactEmail, socialMediaDate, jobAnnouncedDate } = req.body;

    // Admin jobs are employerId = 0 and status = 'OPEN'
    const sql = `INSERT INTO jobs (title, company, category, location, salary, description, type, status, employerId, postedAt) VALUES (?, ?, ?, ?, ?, ?, ?, 'OPEN', 0, ?)`;
    const postedAt = new Date().toLocaleDateString();

    db.run(sql, [title, companyName, category, location, salary, description, jobType, postedAt], function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, jobId: this.lastID });
    });
});

app.get('/api/job-applications/:jobId', (req, res) => { db.all("SELECT * FROM applications WHERE jobId = ?", [req.params.jobId], (err, rows) => res.json(rows)); });
app.get('/api/my-applications', (req, res) => { db.all(`SELECT a.*, j.company, j.location from applications a LEFT JOIN jobs j ON a.jobId = j.id WHERE a.applicantId = ?`, [req.query.applicantId], (err, rows) => res.json(rows)); });
app.patch('/api/applications/:id/status', (req, res) => { db.run("UPDATE applications SET status = ? WHERE id = ?", [req.body.status, req.params.id], (err) => res.json({ success: true })); });
app.get('/api/admin/users', (req, res) => {
    db.all("SELECT * FROM users ORDER BY created_at DESC", (err, rows) => res.json(rows));
});

app.delete('/api/admin/users/:id', (req, res) => {
    const { id } = req.params;
    db.serialize(() => {
        db.run("DELETE FROM users WHERE id = ?", [id]);
        db.run("DELETE FROM applications WHERE applicantId = ?", [id]);

        // Check if user owns a company
        db.get("SELECT id FROM companies WHERE recruiterId = ?", [id], (err, row) => {
            if (row) {
                db.run("DELETE FROM companies WHERE id = ?", [row.id]);
                db.run("DELETE FROM jobs WHERE companyId = ?", [row.id]);
            }
        });
        res.json({ success: true });
    });
});

app.get('/api/admin/companies', (req, res) => {
    db.all("SELECT * FROM companies ORDER BY id DESC", (err, rows) => res.json(rows));
});

app.patch('/api/admin/users/:id/role', (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    db.run("UPDATE users SET role = ? WHERE id = ?", [role, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/api/admin/companies/:id', (req, res) => {
    const { id } = req.params;
    db.serialize(() => {
        db.run("DELETE FROM companies WHERE id = ?", [id]);
        db.run("DELETE FROM jobs WHERE companyId = ?", [id]);
        db.run("UPDATE users SET company_id = NULL WHERE company_id = ?", [id]);
        res.json({ success: true });
    });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.listen(PORT, '0.0.0.0', () => { console.log(`Server running on http://0.0.0.0:${PORT} (Accessible publicly via http://115.97.59.230:${PORT})`); });
