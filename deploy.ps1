# deploy.ps1

# === CONFIG ===
$bucket = "mytripdata8675309"
$distributionId = "E22G95LIEIJY6O"
$pathsToInvalidate = @("/index.html", "/trip_list.json")

Write-Host "Step 1: Building the app..."
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Exiting."
    exit 1
}

Write-Host "Step 2: Uploading to S3 bucket $bucket..."
aws s3 sync dist/ "s3://$bucket/"

if ($LASTEXITCODE -ne 0) {
    Write-Host "S3 upload failed. Exiting."
    exit 1
}

Write-Host "Step 3: Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id $distributionId --paths $pathsToInvalidate

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment complete! Check:"
    Write-Host "   https://da389rkfiajdk.cloudfront.net/"
} else {
    Write-Host 'Warning: Invalidation failed. Files are uploaded but may be cached.'
}
