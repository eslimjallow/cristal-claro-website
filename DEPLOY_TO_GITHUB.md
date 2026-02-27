# Deploy Website to GitHub Pages - Step by Step Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository name: `cristal-claro-website` (or any name you prefer)
4. Description: "Professional window cleaning website - Cristal Claro Las Palmas"
5. Choose **Public** (required for free GitHub Pages)
6. **DO NOT** check "Initialize with README" (we already have files)
7. Click **"Create repository"**

## Step 2: Connect and Push to GitHub

After creating the repository, GitHub will show you a URL. Copy it and run these commands:

```powershell
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/cristal-claro-website.git
git branch -M main
git push -u origin main
```

**Example:**
If your username is `eslim`, the command would be:
```powershell
git remote add origin https://github.com/eslim/cristal-claro-website.git
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Pages (Publish Your Website)

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select **"Deploy from a branch"**
5. Select **"main"** branch
6. Select **"/ (root)"** folder
7. Click **Save**
8. Wait 1-2 minutes for GitHub to build your site
9. Your website will be live at: `https://YOUR_USERNAME.github.io/cristal-claro-website`

## Step 4: Custom Domain (Optional)

If you have a custom domain (like cristalclaro.com):
1. In GitHub Pages settings, add your custom domain
2. Update your domain's DNS records as instructed by GitHub

## Quick Commands Reference

```powershell
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message here"

# Push to GitHub
git push

# Pull latest changes
git pull
```

## Troubleshooting

**If push fails:**
- Make sure you're logged into GitHub
- Use a Personal Access Token instead of password
- Check that the repository URL is correct

**If GitHub Pages doesn't work:**
- Make sure repository is Public
- Check that index.html is in the root folder
- Wait a few minutes for GitHub to process

---

**Your website will be live and accessible to everyone once you complete these steps!** 🚀
