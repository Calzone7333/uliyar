
# ----------------------------------------------------------------------
# 🚀 BLUECALLER APACHE DEPLOYMENT GUIDE
# ----------------------------------------------------------------------

This guide will help you deploy the Bluecaller app using Apache.
We will set it up so:
1. Since you are using Apache, we will serve the Frontend on Port 80 (Standard Web Port).
2. The Backend will continue running on Port 8082 (or we can hide it behind Apache).

### ✅ STEP 1: Build the Frontend
1. Open your terminal in the `Bluecaller` folder.
2. Run the build command:
   ```sh
   npm run build
   ```
3. This creates a `dist` folder. These are the files you will copy to Apache.

---

### ✅ STEP 2: Configure Apache (httpd.conf)
1. Open your Apache configuration file (`httpd.conf` or `apache2.conf`).
   - If using XAMPP, it is in `C:\xampp\apache\conf\httpd.conf`.
2. Ensure the following modules are **uncommented** (remove the `#`):
   ```apache
   LoadModule rewrite_module modules/mod_rewrite.so
   LoadModule proxy_module modules/mod_proxy.so
   LoadModule proxy_http_module modules/mod_proxy_http.so
   ```

3. Add this **VirtualHost Configuration** at the bottom of the file:

```apache
<VirtualHost *:80>
    ServerName uliyar.com
    ServerAlias www.uliyar.com
    DocumentRoot "C:/path/to/Bluecaller/dist"
    
    <Directory "C:/path/to/Bluecaller/dist">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # ----------------------------------------------------
    # 🔌 PROXY API REQUESTS TO NODE.JS (Running on 8082)
    # This makes http://uliyar.com/api/... go to the backend automatically
    # ----------------------------------------------------
    ProxyPreserveHost On
    ProxyPass /api http://localhost:8082/api
    ProxyPassReverse /api http://localhost:8082/api
    
    ErrorLog "logs/uliyar-error.log"
    CustomLog "logs/uliyar-access.log" common
</VirtualHost>
```
*(Replace `C:/path/to/Bluecaller/dist` with the actual full path to your `dist` folder)*

---

### ✅ STEP 3: Update `src/config.js` (Optional but Recommended)
If you use the Proxy setting above, your API is now available at the SAME domain (no :8082 needed).
However, your current setup on port :8082 will ALSO still work fine.

### ✅ STEP 4: Start the Backend
The backend must be running for the API to work.
1. Install `pm2` to run it in the background properly on Windows:
   ```sh
   npm install -g pm2
   ```
2. Start the server:
   ```sh
   cd server
   pm2 start index.js --name "bluecaller-api"
   ```
   (Or just use your `run_background.bat`)

---

### ✅ STEP 5: Restart Apache
Restart the Apache service to apply changes.
- Open XAMPP Control Panel and Click "Stop" then "Start" on Apache.

Now access: **http://uliyar.com**
