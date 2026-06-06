# Deployment Guide: CareerMind AI

This guide provides step-by-step instructions for deploying the **CareerMind AI - Resume Intelligence Platform** in the safest and most reliable manner.

---

## 🚀 Option 1: Deploying to Render (Recommended & Safest)

Render is the most suitable platform for this application because it runs a traditional, always-on Node.js Express server. Unlike Vercel, Render does not impose a 10-second timeout limit on API requests, preventing timeouts during heavy AI parsing.

### Steps:
1. **Create an Account on Render**:
   - Go to [render.com](https://render.com) and sign up (login with your GitHub account is recommended).
2. **Create a New Web Service**:
   - In the Render Dashboard, click **New +** and select **Web Service**.
3. **Connect Your Repository**:
   - Select your GitHub account and choose the `ai-resume-analyzer` repository.
4. **Configure the Web Service**:
   - **Name**: `ai-resume-analyzer`
   - **Region**: Choose the region closest to you.
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Select the **Free** tier.
5. **Set Environment Variables**:
   - Scroll down to the **Environment Variables** section.
   - Click **Add Environment Variable** and add:
     - Key: `GEMINI_API_KEY`
     - Value: `YOUR_ACTUAL_GEMINI_API_KEY` (Optional: If left blank, users must configure their key manually via the web UI settings).
6. **Deploy**:
   - Click **Create Web Service**. Render will pull your code, install dependencies, and start the app.
   - Once the deploy status turns green (**Live**), your application is online!

---

## ⚡ Option 2: Deploying to Vercel (Alternative)

If you prefer Vercel, you must add a configuration file (`vercel.json`) to handle the routing. 

> ⚠️ **Warning**: The Vercel Hobby tier has a strict **10-second request timeout limit**. If the Gemini model takes longer than 10 seconds to respond, the application will return a `504 Gateway Timeout` error.

### Steps:
1. **Add `vercel.json`**:
   Ensure there is a `vercel.json` file in your project root with the following contents:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "server.js"
       }
     ]
   }
   ```
2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in with GitHub.
   - Click **Add New** > **Project**.
   - Import the `ai-resume-analyzer` repository.
   - Expand the **Environment Variables** section and add `GEMINI_API_KEY` if desired.
   - Click **Deploy**.
