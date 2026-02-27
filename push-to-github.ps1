# Script to push Cristal Claro website to GitHub
# Replace YOUR_USERNAME with your actual GitHub username

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Push to GitHub & Setup GitHub Pages" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get GitHub username
$username = Read-Host "Enter your GitHub username"

if ([string]::IsNullOrWhiteSpace($username)) {
    Write-Host "Error: Username cannot be empty!" -ForegroundColor Red
    exit
}

$repoName = "cristal-claro-website"
$repoUrl = "https://github.com/$username/$repoName.git"

Write-Host ""
Write-Host "Repository URL: $repoUrl" -ForegroundColor Yellow
Write-Host ""
Write-Host "Step 1: Make sure you've created the repository on GitHub first!" -ForegroundColor Green
Write-Host "   Go to: https://github.com/new" -ForegroundColor Yellow
Write-Host "   Name: $repoName" -ForegroundColor Yellow
Write-Host "   Make it PUBLIC (required for free GitHub Pages)" -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Have you created the repository? (y/n)"

if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Please create the repository first, then run this script again." -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Step 2: Setting up remote and pushing..." -ForegroundColor Green

# Remove existing remote if any
git remote remove origin 2>$null

# Add remote
git remote add origin $repoUrl

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✓ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://github.com/$username/$repoName/settings/pages" -ForegroundColor Cyan
    Write-Host "2. Under 'Source', select 'Deploy from a branch'" -ForegroundColor Cyan
    Write-Host "3. Select 'main' branch and '/ (root)' folder" -ForegroundColor Cyan
    Write-Host "4. Click Save" -ForegroundColor Cyan
    Write-Host "5. Wait 1-2 minutes, then visit:" -ForegroundColor Cyan
    Write-Host "   https://$username.github.io/$repoName" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Error: Failed to push to GitHub" -ForegroundColor Red
    Write-Host "Make sure:" -ForegroundColor Yellow
    Write-Host "- Repository exists on GitHub" -ForegroundColor Yellow
    Write-Host "- You're logged into GitHub" -ForegroundColor Yellow
    Write-Host "- Repository URL is correct" -ForegroundColor Yellow
}
