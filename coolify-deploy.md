# Coolify Deployment Guide

## Prerequisites

1. **Coolify Server**: Make sure you have Coolify installed on your server
2. **MongoDB Database**: Your MongoDB Atlas or self-hosted MongoDB connection string
3. **Domain**: A domain pointing to your Coolify server (optional but recommended)

## Step 1: Prepare Your Repository

1. **Push your code** to GitHub, GitLab, or any Git provider that Coolify supports
2. **Make sure** all the deployment files are included:
   - `Dockerfile`
   - `docker-compose.yml`
   - `.env.example`

## Step 2: Create Application in Coolify

1. **Login** to your Coolify dashboard
2. **Click** "New Resource" → "Application"
3. **Select** your Git repository
4. **Choose** the branch to deploy (usually `main` or `master`)

## Step 3: Configure Build Settings

1. **Build Command**: Leave default or set to `npm run build`
2. **Start Command**: Set to `npm start`
3. **Port**: Set to `5000`
4. **Dockerfile**: Coolify will automatically detect the Dockerfile

## Step 4: Environment Variables

Add these environment variables in Coolify:

### Required Variables:
```
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database?retryWrites=true&w=majority
NODE_ENV=production
SESSION_SECRET=your-very-secure-random-session-secret
```

### Optional Variables (if using Stripe):
```
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key
```

### Optional Variables (if using email):
```
RESEND_API_KEY=re_your_resend_api_key
```

## Step 5: MongoDB Setup

### Option A: MongoDB Atlas (Recommended)
1. **Create** a MongoDB Atlas account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. **Create** a new cluster (free tier available)
3. **Create** a database user with read/write permissions
4. **Get** your connection string from "Connect" → "Connect your application"
5. **Replace** `<password>` with your actual password in the connection string
6. **Whitelist** your server's IP or use `0.0.0.0/0` for all IPs (less secure)

### Option B: Self-hosted MongoDB
1. **Install** MongoDB on your server or use Docker
2. **Create** a database and user
3. **Use** connection string format: `mongodb://username:password@localhost:27017/database_name`

## Step 6: Deploy

1. **Click** "Deploy" in Coolify
2. **Wait** for the build process to complete
3. **Check** logs for any errors
4. **Visit** your application URL

## Step 7: Domain Setup (Optional)

1. **Add** your domain in Coolify application settings
2. **Configure** DNS to point to your Coolify server
3. **Enable** SSL certificate (Let's Encrypt)

## Verification Checklist

- [ ] Application builds successfully
- [ ] MongoDB connection works
- [ ] Environment variables are set
- [ ] Application starts on port 5000
- [ ] Health check endpoint responds
- [ ] Can access the admin dashboard
- [ ] Review platforms management works

## Common Issues & Solutions

### Build Fails
- **Check** that all dependencies are in `package.json`
- **Verify** Node.js version compatibility
- **Review** build logs for specific errors

### Database Connection Issues
- **Verify** MongoDB connection string format
- **Check** database user permissions
- **Confirm** network access (IP whitelist)
- **Test** connection string locally first

### Environment Variables Not Loading
- **Ensure** variables are set in Coolify dashboard
- **Restart** the application after adding variables
- **Check** for typos in variable names

### Port Issues
- **Confirm** application listens on `0.0.0.0:5000`
- **Check** Coolify port configuration
- **Verify** no port conflicts

## Monitoring & Maintenance

1. **Monitor** application logs in Coolify
2. **Set up** health checks and alerts
3. **Regular** database backups
4. **Update** dependencies periodically
5. **Monitor** MongoDB performance and usage

## Support

If you encounter issues:
1. **Check** Coolify documentation
2. **Review** application logs
3. **Test** components individually
4. **Verify** all environment variables
5. **Check** MongoDB Atlas/server status