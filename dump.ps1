$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$outputDir = Join-Path $projectDir "output"
$outputFile = Join-Path $outputDir "cruise_viewer_dump.txt"

# Ensure output directory exists
if (-Not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

# Remove old output file if it exists
if (Test-Path $outputFile) {
    Remove-Item $outputFile
}

# Define extensions to include
$includeExtensions = @(".js", ".jsx", ".ts", ".tsx", ".css", ".html", ".json", ".md")

# Define folders to exclude
$excludeFolders = @("node_modules", "dist", "build", ".git", ".next", "coverage", ".turbo")

# Recursively find matching files
$allFiles = Get-ChildItem -Path $projectDir -Recurse -File

foreach ($file in $allFiles) {
    $relPath = $file.FullName.Substring($projectDir.Length + 1)

    # Skip excluded folders
    $skip = $false
    foreach ($folder in $excludeFolders) {
        if ($relPath -like "*$folder*") {
            $skip = $true
            break
        }
    }

    # Skip files not matching the extension list
    if ($skip -or -not ($includeExtensions -contains $file.Extension)) {
        continue
    }

    # Write-Host "Including: $relPath"

    Add-Content -Path $outputFile -Value "# FILE: $relPath"
    Add-Content -Path $outputFile -Value ""
    Get-Content $file.FullName | Add-Content -Path $outputFile
    Add-Content -Path $outputFile -Value "`n`n"
}

Write-Output "Dumped cruise viewer source files to: $outputFile"
