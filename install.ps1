$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)
    Write-Host "[YellowWave] $Message"
}

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$themeName = "YellowWave"
$themeTarget = Join-Path $env:APPDATA "spicetify\Themes\$themeName"

if (-not (Get-Command spicetify -ErrorAction SilentlyContinue)) {
    Write-Error "Spicetify is not installed or is not available in PATH. Install Spicetify first, then run this script again."
}

$requiredFiles = @("color.ini", "user.css", "theme.js", "manifest.json")
foreach ($file in $requiredFiles) {
    $path = Join-Path $repoRoot $file
    if (-not (Test-Path -LiteralPath $path)) {
        Write-Error "Missing required theme file: $file"
    }
}

Write-Step "Installing from $repoRoot"
Write-Step "Copying theme files to $themeTarget"

New-Item -ItemType Directory -Path $themeTarget -Force | Out-Null

$itemsToCopy = @(
    "assets",
    "docs",
    "color.ini",
    "user.css",
    "theme.js",
    "manifest.json",
    "README.md",
    "LICENSE"
)

foreach ($item in $itemsToCopy) {
    $source = Join-Path $repoRoot $item
    if (Test-Path -LiteralPath $source) {
        Copy-Item -LiteralPath $source -Destination $themeTarget -Recurse -Force
    }
}

Write-Step "Configuring Spicetify"
spicetify config current_theme YellowWave
spicetify config color_scheme Base

Write-Step "Applying theme"
spicetify apply

Write-Step "Done. Restart Spotify if the theme does not appear immediately."
