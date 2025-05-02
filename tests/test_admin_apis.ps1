<#
.SYNOPSIS
    Tests the Cruise Admin API endpoints for user management
.DESCRIPTION
    Performs a complete test workflow:
    1. Lists all users
    2. Creates test user (tebzxq34f@mozmail.com)
    3. Lists users after creation
    4. Deletes test user
    5. Lists users after deletion
.NOTES
    Requires Auth0 JWT token with proper permissions
#>

param (
    [string]$ApiBaseUrl = "https://zf5sdrd108.execute-api.us-west-2.amazonaws.com/prod",
    [string]$TestEmail = "tebzxq34f@mozmail.com",
    [string]$TestName = "Testy Tester"
)

$Auth0Token = $env:AUTH0_TOKEN
if (-not $Auth0Token) {
    Write-Host "`nPaste a valid Auth0 access token (from Postman):" -ForegroundColor Yellow
    $Auth0Token = Read-Host "Auth0 Token"
}

#region Helper Functions
function Invoke-AdminApi {
    param (
        [string]$Method,
        [string]$Path,
        [object]$Body,
        [switch]$Verbose
    )

    $headers = @{
        "Authorization" = "Bearer $Auth0Token"
        "Content-Type" = "application/json"
    }

    $uri = "$ApiBaseUrl$Path"

    try {
        if ($Verbose) {
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $Method $Path" -ForegroundColor Cyan
            if ($Body) {
                Write-Host "Request Body:" -ForegroundColor DarkCyan
                $Body | ConvertTo-Json -Depth 3 | Write-Host -ForegroundColor DarkCyan
            }
        }

        $params = @{
            Uri = $uri
            Method = $Method
            Headers = $headers
        }

        if ($Body) {
            $params.Add("Body", ($Body | ConvertTo-Json -Depth 3))
        }

        $response = Invoke-RestMethod @params

        if ($Verbose) {
            Write-Host "Response:" -ForegroundColor Green
            $response | ConvertTo-Json -Depth 5 | Write-Host -ForegroundColor Green
        }

        return $response
    }
    catch {
        $errMsg = $_.Exception.Message
        $errorDetails = $_.Exception.Response
        if ($errorDetails) {
            $reader = New-Object System.IO.StreamReader($errorDetails.GetResponseStream())
            $reader.BaseStream.Position = 0
            $reader.DiscardBufferedData()
            $errorContent = $reader.ReadToEnd() | ConvertFrom-Json
    
            Write-Host "[ERROR] $errMsg" -ForegroundColor Red
            if ($errorContent) {
                $errorContent | Format-List | Out-Host
            }
        } else {
            Write-Host "[ERROR] $errMsg" -ForegroundColor Red
        }
        return $null
    }    
}

function Format-UsersTable {
    param (
        [object]$Users
    )

    if (-not $Users -or $Users.Count -eq 0) {
        Write-Host "No users found" -ForegroundColor Yellow
        return
    }

    $Users | ForEach-Object {
        [PSCustomObject]@{
            Email = $_.email
            Name = "$($_.given_name) $($_.family_name)"
            UserID = $_.user_id
            LastLogin = if ($_.last_login) { [datetime]$_.last_login } else { "Never" }
        }
    } | Format-Table -AutoSize -Wrap
}
#endregion

#region Main Test Workflow
Write-Host "`n=== CRUISE ADMIN API TEST ===`n" -ForegroundColor Magenta

# 1) Display all users
Write-Host "`n1. LISTING ALL USERS`n" -ForegroundColor Yellow
$allUsers = Invoke-AdminApi -Method GET -Path "/admin-api/users" -Verbose
Format-UsersTable -Users $allUsers.data.users

# 2) Invite new test user
Write-Host "`n2. INVITING TEST USER ($TestEmail)`n" -ForegroundColor Yellow
$inviteBody = @{
    email = $TestEmail
    given_name = "Testy"
    family_name = "Tester"
}
$inviteResponse = Invoke-AdminApi -Method POST -Path "/admin-api/users" -Body $inviteBody -Verbose

if ($inviteResponse) {
    Write-Host "Successfully invited user:" -ForegroundColor Green
    $inviteResponse.data | Format-List
}

# 3) Display updated user list
Start-Sleep -Seconds 2
Write-Host "`n3. LISTING USERS AFTER CREATION`n" -ForegroundColor Yellow
$updatedUsers = Invoke-AdminApi -Method GET -Path "/admin-api/users" -Verbose
Format-UsersTable -Users $updatedUsers.data.users

# 4) Delete test user
Write-Host "`n4. DELETING TEST USER ($TestEmail)`n" -ForegroundColor Yellow
$deleteBody = @{
    email = $TestEmail
}
$deleteResponse = Invoke-AdminApi -Method DELETE -Path "/admin-api/users" -Body $deleteBody -Verbose

if ($deleteResponse) {
    Write-Host "Successfully deleted test user" -ForegroundColor Green
    $deleteResponse | Format-List
}

# 5) Display final user list
Start-Sleep -Seconds 2
Write-Host "`n5. LISTING USERS AFTER DELETION`n" -ForegroundColor Yellow
$finalUsers = Invoke-AdminApi -Method GET -Path "/admin-api/users" -Verbose
Format-UsersTable -Users $finalUsers.data.users

Write-Host "`n=== TEST COMPLETED ===`n" -ForegroundColor Magenta
#endregion