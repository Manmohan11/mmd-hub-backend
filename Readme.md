# create a new repository on the command line
echo "# mmd-hub-backend" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Manmohan11/mmd-hub-backend.git
git push -u origin main

# push an existing repository from the command line
git remote add origin https://github.com/Manmohan11/mmd-hub-backend.git
git branch -M main
git push -u origin main
