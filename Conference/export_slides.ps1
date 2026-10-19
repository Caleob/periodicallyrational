# One-click export script for Conference Slides
Write-Host "Exporting presentation slides to Google Slides 16:9 images..." -ForegroundColor Cyan
node export_slides.js
Write-Host "Done! Check the slides_export folder." -ForegroundColor Green
pause
