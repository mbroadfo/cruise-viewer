# Prompt for Auth0 token if not set
$Auth0Token = $env:AUTH0_TOKEN
if (-not $Auth0Token) {
    Write-Host ""
    Write-Host "Enter a valid Auth0 access token:"
    $Auth0Token = Read-Host "Auth0 Token"
}

# Static test user and API Gateway URL
$email = "tebzxq34f@mozmail.com"
$apiUrl = "https://zf5sdrd108.execute-api.us-west-2.amazonaws.com/prod/admin-api/user/favorites"

# Validate inputs
if (-not $Auth0Token -or -not $email) {
    Write-Error "Missing required variables. Ensure AUTH0_TOKEN and email are set."
    exit 1
}

# Construct JSON payload
$favoritesPayload = @{
    email     = $email
    favorites = @("TEST123", "DEMO456")
} | ConvertTo-Json -Depth 2

# Clean token and build headers
$cleanToken = "$Auth0Token".Trim() -replace '\r|\n', ''
$headers = @{
    "Authorization" = "Bearer $cleanToken"
    "Content-Type"  = "application/json"
}

# Debug info
Write-Host ""
Write-Host "Request URL: $apiUrl"
Write-Host "Authorization Header: Bearer [REDACTED]"
Write-Host "Payload:"
Write-Host $favoritesPayload

# Make the request
try {
    $response = Invoke-RestMethod -Method Patch -Uri $apiUrl -Headers $headers -Body $favoritesPayload
    Write-Host ""
    Write-Host "Response:"
    $response | ConvertTo-Json -Depth 4
} catch {
    Write-Host ""
    Write-Host "Request failed:"
    Write-Host $_.Exception.Message

    if ($_.Exception.Response -and $_.Exception.Response.Content) {
        [string]$errorBody = $_.Exception.Response.Content
        Write-Host ""
        Write-Host "API Error Response:"
        Write-Host $errorBody
    }
}
