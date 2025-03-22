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
Get-ChildItem -Path $projectDir -Recurse -File |
    Where-Object {
        $relPath = $_.FullName.Substring($projectDir.Length + 1)
        ($includeExtensions -contains $_.Extension) -and
        (-not ($excludeFolders | ForEach-Object { $relPath -like "*$_*" }))
    } |
    ForEach-Object {
        Add-Content -Path $outputFile -Value "# FILE: $($_.FullName.Substring($projectDir.Length + 1))"
        Add-Content -Path $outputFile -Value ""
        Get-Content $_.FullName | Add-Content -Path $outputFile
        Add-Content -Path $outputFile -Value "`n`n"
    }

Write-Output "Dumped cruise viewer source files to: $outputFile"
