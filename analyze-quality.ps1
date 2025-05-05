# Check Node + React code quality without modifying any files

# Run ESLint
Write-Host "Running ESLint..."
npx eslint . --ext .js,.jsx,.ts,.tsx

# Run TypeScript type check
Write-Host "Checking TypeScript types..."
npx tsc --noEmit

# Run depcheck for unused dependencies
Write-Host "Checking for unused dependencies..."
npx depcheck --ignores=tailwindcss

# Run ts-prune for unused exports
Write-Host "Checking for unused exports..."
npx ts-prune
