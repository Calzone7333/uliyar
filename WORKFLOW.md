# 📘 BlueCaller - Strict Single Admin Workflow Documentation

This document outlines the complete operational workflow of the BlueCaller Job Portal. The system relies on a **Strict Single Admin Model**, meaning critical actions (Job Posting, Applying) are blocked until the Super Admin explicitly verifies them.

---

## 🛠 System Configuration

### **Network & Access**
The system is configured to work dynamically across all environments:
*   **Localhost:** `http://localhost:5174` (API: `localhost:8082`)
*   **Internal Network:** `http://192.168.1.2:5174` (API: `192.168.1.2:8082`)
*   **Public Internet:** `http://115.97.59.230:5174` (API: `115.97.59.230:8082`)

### **Credentials**
*   **Admin Login:** `http://<IP>:5174/admin`
*   **Admin Password:** `admin@2025`
*   **Demo OTP:** `1234` (For all mobile verifications)

---

## 🧑‍💼 1. Job Seeker Workflow (Candidate)

Candidates cannot apply for jobs until their identity and resume are verified.

### **Step 1: Registration**
*   User signs up with **Name, Email, Mobile, Password**.
*   Selects role: **"I'm a Worker"**.
*   **Status:** `INACTIVE` (Cannot login yet).

### **Step 2: Verification**
*   User enters OTP (`1234`).
*   **Status:** `ACTIVE` (Can now login).

### **Step 3: Profile & Resume**
*   User logs in -> Goes to **Profile**.
*   Fills: Personal Details, Education, Experience, Skills.
*   **Uploads Resume (PDF/DOC)**.
*   **Status:** `Resume PENDING` (Blocks application capability).

### **Step 4: Application (BLOCKED)**
*   User tries to click **"Apply Now"** on a job.
*   **System Error:** "Your resume is not approved by Admin yet."

### **Step 5: Admin Approval**
*   (After Admin Approves Resume)
*   User can now successfully **Apply** for jobs.
*   Status flows: `Applied` -> `Viewed` -> `Shortlisted` -> `Interview`.

---

## 🏢 2. Employer Workflow (Recruiter)

Employers cannot post visible jobs until their company is verified.

### **Step 1: Registration**
*   Sign up with **Company Name, Email, Mobile**.
*   Selects role: **"I'm an Employer"**.
*   Verifies OTP (`1234`).

### **Step 2: Company Profile Creation**
*   Employer is *forced* to create a Company Profile immediately after login.
*   Fills: Type (MNC/Startup), Industry, Size, Location, Website.
*   **Company Status:** `PENDING`.
*   **Action:** Employer sees "Verification Pending" dashboard. **"Post Job" button is disabled.**

### **Step 3: Admin Approval**
*   (After Admin Verifies Company)
*   **Company Status:** `APPROVED` (Active).
*   Employer can now access the full dashboard.

### **Step 4: Posting a Job**
*   Employer posts a job (Title, Salary, Location).
*   **Job Status:** `PENDING`.
*   **Visibility:** The job is **NOT visible** on the public "Find Jobs" page yet.

### **Step 5: Admin Job Verification**
*   (After Admin Approves Job)
*   **Job Status:** `OPEN`.
*   **Visibility:** LIVE for all candidates.

---

## 🟣 3. Admin Workflow (Master Control)

The Admin is the central gatekeeper.

**Login:** `/admin` (Password: `admin@2025`)
**Dashboard Tabs:**

### **1. Resumes Queue (Candidate Verification)**
*   List of all candidates who uploaded a new resume.
*   **Action:**
    *   **Approve:** Enables the candidate to Apply.
    *   **Reject:** Sends them back to upload again.

### **2. Companies Queue (Employer Verification)**
*   List of new company registrations.
*   Shows: Name, Website, Industry, Location.
*   **Action:**
    *   **Verify:** Unlocks the Employer's ability to post jobs.
    *   **Reject:** Blocks the employer.

### **3. Jobs Queue (Content Verification)**
*   List of all new job posts from active companies.
*   Shows: Job Title, Salary, Description.
*   **Action:**
    *   **Approve:** Makes the job LIVE on the website.
    *   **Reject:** Hides the job permanently.

---

## 🔄 Summary of "Strict Gates"

| Action | Prerequisite Check |
| :--- | :--- |
| **Login** | OTP Verified (`1234`) |
| **Apply for Job** | Profile Complete AND Resume Approved by Admin |
| **Post a Job** | Company Verified by Admin |
| **Job Going Live** | Job Post Approved by Admin |

---

## 🐛 Troubleshooting

*   **"Connection Refused":** Ensure the server is running (`npm run dev`) and Port 8082 is allowed in Firewall.
*   **"Profile Incomplete":** Candidates must fill all fields in the Profile page to proceed.
*   **"Resume Pending":** Login as Admin -> Resumes -> Approve the user.
