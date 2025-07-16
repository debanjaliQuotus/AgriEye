# Deployment Guide for AgriEye on Render

This guide explains how to deploy the AgriEye full-stack application (Node.js backend + React frontend) on Render.com.

---

## Prerequisites

- Render account: https://render.com
- GitHub/GitLab repository with your project code
- Render CLI (optional): https://render.com/docs/cli

---

## Step 1: Prepare Your Project

1. **Build Frontend**

   - Navigate to your frontend directory (e.g., `client/`).
   - Run:
     ```
     npm install
     npm run build
     ```
   - This creates a production-ready static bundle in the `build/` folder.

2. **Backend Setup**

   - Ensure your backend (`server/`) has the following in `server.ts`:
     ```js
     app.use(express.static(path.join(__dirname, '..', 'build')));
     app.get('*', (_req, res) => {
       res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
     });
     ```
   - This serves the frontend static files from the backend.

3. **Environment Variables**

   - Prepare environment variables for:
     - MongoDB connection string
     - API keys (Google Vision, Twilio, Weather API, Soil API, etc.)
     - Any other secrets

---

## Step 2: Create Render Services

### 2.1 Backend Service

1. Go to Render dashboard and create a new **Web Service**.
2. Connect your GitHub/GitLab repo.
3. Set the root directory to your backend folder (e.g., `server/`).
4. Set the build command:
   ```
   npm install && npm run build
   ```
5. Set the start command:
   ```
   npm start
   ```
6. Add environment variables in the Render dashboard matching your `.env` keys.
7. Set the port to `10000` or leave default (Render assigns a port via `PORT` env var).
8. Deploy the service.

### 2.2 Static Site (Optional)

If you want to serve frontend separately:

1. Create a new **Static Site** on Render.
2. Connect your repo and set the root directory to frontend folder (e.g., `client/`).
3. Set the build command:
   ```
   npm install && npm run build
   ```
4. Set the publish directory to `build`.
5. Deploy.

---

## Step 3: Configure MongoDB

- Use a cloud MongoDB provider (e.g., MongoDB Atlas).
- Whitelist Render IPs or allow access from anywhere (less secure).
- Set the connection string in Render environment variables.

---

## Step 4: Test Your Deployment

- Access your backend URL to verify API endpoints.
- Access your frontend URL to verify UI.
- Test file uploads and static file serving.
- Check logs on Render dashboard for errors.

---

## Additional Tips

- Use Render’s **Health Checks** to monitor your backend.
- Use **Persistent Disks** if you need to store uploaded files persistently.
- Set up **Custom Domains** and HTTPS in Render.
- Use Render’s **Secrets** to manage sensitive environment variables securely.

---

## Summary

- Build frontend and backend.
- Deploy backend as Web Service on Render.
- Optionally deploy frontend as Static Site.
- Configure environment variables and MongoDB.
- Test and monitor your deployment.

---

If you want, I can help you create Render-specific configuration files like `render.yaml` or Dockerfiles for containerized deployment.
