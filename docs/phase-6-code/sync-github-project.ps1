$ErrorActionPreference = "Stop"
$owner = "Trujillo7915"
$repo = "Sistema_Clinica_Medica"
$projectTitle = "SGCM - Fase 6: Implementacion de Codigo (phase-6-code)"

Write-Host "1. Verificando alcance 'project' en GitHub CLI..." -ForegroundColor Cyan
$projectList = gh project list --owner $owner --format json | ConvertFrom-Json
$existing = $projectList.projects | Where-Object { $_.title -eq $projectTitle } | Select-Object -First 1

if ($null -eq $existing) {
    Write-Host "2. Creando GitHub Project '$projectTitle'..." -ForegroundColor Cyan
    $created = gh project create --owner $owner --title $projectTitle --format json | ConvertFrom-Json
    $projectNumber = $created.number
    $projectUrl = $created.url
} else {
    $projectNumber = $existing.number
    $projectUrl = $existing.url
    Write-Host "2. Usando GitHub Project existente #$projectNumber ($projectUrl)" -ForegroundColor Green
}

Write-Host "3. Vinculando el repositorio $owner/$repo al Project #$projectNumber..." -ForegroundColor Cyan
gh project link $projectNumber --owner $owner --repo $repo 2>$null

Write-Host "4. Agregando los 12 Issues de la Fase 6 (#6 al #17) al tablero..." -ForegroundColor Cyan
for ($i = 6; $i -le 17; $i++) {
    $issueUrl = "https://github.com/$owner/$repo/issues/$i"
    Write-Host "   + Vinculando Issue #$i ($issueUrl)..."
    gh project item-add $projectNumber --owner $owner --url $issueUrl
}

Write-Host "`n¡Tablero de GitHub Projects configurado exitosamente!" -ForegroundColor Green
Write-Host "URL del Tablero: $projectUrl" -ForegroundColor Yellow
