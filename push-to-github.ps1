# PowerShell script to push to GitHub
# Replace YOUR_USERNAME with your GitHub username
# Replace cristal-claro-website with your repository name

$repoName = "cristal-claro-website"
$username = "YOUR_USERNAME"  # CHANGE THIS to your GitHub username

Write-Host "Setting up GitHub remote..." -ForegroundColor Green

# Add remote (if not already added)
git remote remove origin 2>$null
git remote add origin "https://github.com/$username/$repoName.git"

Write-Host "Pushing to GitHub..." -ForegroundColor Green

# Push to GitHub
git branch -M main
git push -u origin main

Write-Host "Done! Check your repository at: https://github.com/$username/$repoName" -ForegroundColor Green
