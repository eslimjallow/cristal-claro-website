# GitHub Setup Instructions

## Step 1: Create a GitHub Repository

1. Go to https://github.com and sign in (or create an account)
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Repository name: `cristal-claro-website` (or any name you prefer)
5. Description: "Professional window cleaning website for Cristal Claro - Las Palmas"
6. Choose **Public** or **Private** (your choice)
7. **DO NOT** initialize with README, .gitignore, or license (we already have these)
8. Click "Create repository"

## Step 2: Connect Your Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these commands:

### Option A: If you haven't created the repository yet
```bash
git remote add origin https://github.com/YOUR_USERNAME/cristal-claro-website.git
git branch -M main
git push -u origin main
```

### Option B: If you already created the repository
Replace `YOUR_USERNAME` with your actual GitHub username in the commands above.

## Step 3: Push Your Code

Once you've added the remote, run:
```bash
git push -u origin main
```

You'll be prompted for your GitHub username and password (or personal access token).

## Quick Commands Reference

```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull from GitHub
git pull
```

## Need Help?

If you encounter any issues:
- Make sure you have a GitHub account
- Use a Personal Access Token instead of password if prompted
- Check that the repository name matches in the remote URL
