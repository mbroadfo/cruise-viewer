# Check Node + React code quality without modifying any files

# Run ESLint
Write-Host "Running ESLint..."
npx eslint . --ext .js,.jsx,.ts,.tsx

# Run Prettier check
Write-Host "Checking Prettier formatting..."
npx prettier . --check

# Run TypeScript type check
Write-Host "Checking TypeScript types..."
npx tsc --noEmit

# Run Jest tests
Write-Host "Running unit tests with Jest..."
npx jest --ci

# Run depcheck for unused dependencies
Write-Host "Checking for unused dependencies..."
npx depcheck

# Run ts-prune for unused exports
Write-Host "Checking for unused exports..."
npx ts-prune
