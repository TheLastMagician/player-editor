# abort on errors
set -e
# clear dist
rm -rf dist
# build
npm run build
# navigate into the build output directory
cd dist
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:ignis05/player-editor.git master:gh-pages
cd -