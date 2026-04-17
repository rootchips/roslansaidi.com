---
title: "Automated Deployment using Github Actions"
description: Automate the workflow with GitHub Actions for quick, reliable releases.
date: 2025-03-23
image: https://images.unsplash.com/photo-1714901423336-1884cd3fb50f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170
minRead: 8
author:
  name: Roslan Saidi
  avatar:
    src: https://avatars.githubusercontent.com/u/13043860?v=4
    alt: Roslan Saidi
---

GitHub Actions runners support three operating systems: __MacOS__, __Linux__ and __Windows__. Ensure that your server environment is compatible with these platforms. __Assuming the application is already set up on a bare-metal server, you can proceed with the next steps__. A bare-metal setup means that all components such as the web server, dependencies and services are installed and configured manually on the operating system.

__Our goal is to automate deployment so that every push or rollback is applied automatically, without the need to enter the server and run the commands manually.__

#### Example environment and requirements:

- __Operating System:__ Linux
- __User:__ myuser (as sudoer, don't use root)
- __Host:__ Self hosted
- __Environment:__ Production or Staging

#### Example application setup
-   __Architecture:__ Decoupled (client–server style)
- 	__Repositories:__ Two separate repos in GitHub (API & Frontend)
- 	__Workflows:__ Two workflows (one for API, one for Frontend)
-   __Tech stack:__ Laravel PHP (API) and Nuxt.js (frontend)
-   __Production app location:__ `/srv/apps/<your-application>`
-   __Staging app location:__ `/home/myuser/<your-application>`

Here are the steps to build __an automated deployment process__.
<br><br>

### Login to the server
Login the server as myuser.
<br><br>
### Generate two separate SSH keys
In the home directory, create two separate SSH keys: one dedicated for the API and another for the frontend application.

```sh
# make sure you are in home directory ~ or /home/myuser
$ pwd
/home/myuser

#  create for API key
$ ssh-keygen -t ed25519 -C "api-deploy" -f id_api -N ""

# create for frontend key
$ ssh-keygen -t ed25519 -C "web-deploy" -f id_web -N ""
```

Now you will have two key pairs.
```
~/.ssh/id_api
~/.ssh/id_api.pub
~/.ssh/id_web
~/.ssh/id_web.pub
```
<br>

### Create a configuration file
In the SSH folder, create a configuration file for the GitHub environments:
```sh
$ cd ~/.ssh
$ nano config
```

Add the following entries in the editor:

```
Host github.com-api
  HostName github.com
  User git
  IdentityFile /home/myuser/.ssh/id_api
  IdentitiesOnly yes

Host github.com-web
  HostName github.com
  User git
  IdentityFile /home/myuser/.ssh/id_web
  IdentitiesOnly yes
```

This configuration defines two SSH hosts:
- `github.com-api` → used for API repositories.
- `github.com-web` → used for frontend repositories.

Later, we will set the remote URLs of the repositories to use these hosts, making it easier to separate API and frontend access.
<br><br>

### Set the remote URL
Assuming the application is organized into two main components API and Frontend, their directories would typically look like this:
- The API service is located at: `/srv/apps/<your-application>/api`
- The Frontend service is located at: `/srv/apps/<your-application>/web`

```sh
$ cd /srv/apps/<your-application>/api
$ git remote set-url origin git@github.com-api:<username>/<api-repository>.git

$ cd /srv/apps/<your-application>/web
$ git remote set-url origin git@github.com-web:<username>/<web-repository>.git
```

For configuring your remote URLs, you need to use the host aliases defined in `~/.ssh/config`. This ensures Git knows which SSH key to use for each repository.
<br><br>

### Set up a deploy key for each repository
Next, you need to copy both the API and Frontend SSH keys from the server and add them to their respective repositories. Make sure each repository has the correct key pasted into its deploy key settings.

Copy the public keys
```sh
# api key
$ cat ~/.ssh/id_api.pub
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICFS4/d7Atbkkasda9d39rewas0dasda90vdasdsad myuser@server

# frontend key
$ cat ~/.ssh/id_web.pub
ssh-ed25519 AAAAC3NzaC1lZDISEFSDFSF5AAAAICFS4/dGGGGAASDFVkasdaSDFSFSFs0dasdaSDFSF myuser@server
```
You need to paste the API key into the API repository and the Frontend key into the Frontend repository.

- Go to __your repository > Settings > Deploy Keys__ or `https://github.com/<username>/<repository>/settings/keys`
- Click __Add deploy keys__
- Enter a title, paste the public key from your server.
- Allow write access (optional)
- Click __Add key__
<br><br>

### Check the connection between server and Github
You need to test the SSH connections before proceeding to the next steps:

```sh
$ ssh -T github.com-api
$ ssh -T github.com-web
```

Expected output:
```
Hi myuser/api! You've successfully authenticated, but GitHub does not provide shell access.
Hi myuser/web! You've successfully authenticated, but GitHub does not provide shell access.
```

If the output is different, adjust the file permissions and try again.

```sh
$ chmod 600 ~/.ssh/id_api
$ chmod 600 ~/.ssh/id_web
$ chmod 600 ~/.ssh/known_hosts
$ chmod 700 ~/.ssh
```
<br><br>

### Create and register Github runners
Next, You can create a runner for either a __personal__ or an __organization__ account.

For a personal repository:
- Go to __your repository > Settings > Actions > Runners__
- Click __New self-hosted runner__
- Choose __Linux__ as the operating system
- Select the appropriate architecture (you can check your server architecture by running uname -a).
- Follow the download and setup steps shown on the GitHub page.

For an organization repository
- Go to __your organization page > Settings > Actions > Runner groups__
- Click __New runner group__
- Insert group name, __select repositories (API and Web)__
- Click __Create group__
- Once the group is created, click __New runner__
- Choose __Linux__ as the operating system
- Select the appropriate __architecture__ (you can check your server architecture by running uname -a).
- Follow the download and setup steps shown on the GitHub page. (Be sure to download the latest runner version)

For example:


Download
```sh
# Go to home directory
$ cd ~

# Create a folder
$ mkdir actions-runner && cd actions-runner

# Download the latest runner package
$ curl -o actions-runner-osx-x64-2.328.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.328.0/actions-runner-osx-x64-2.328.0.tar.gz

# Optional: Validate the hash
$ echo "90c32dc6f292855339563148f3859dc5d402f237ecdf57010c841df3c8d12cc8  actions-runner-osx-x64-2.328.0.tar.gz" | shasum -a 256 -c

# Extract the installer
$ tar xzf ./actions-runner-osx-x64-2.328.0.tar.gz
```

Configure
```sh
# Create the runner and start the configuration experience
$ ./config.sh --url https://github.com/<username> --token ADDQRFFQIRRUMMLL6EW6T2EEEEEA4Y
```

When you execute the configuration, GitHub will ask you these during runner setup:

```
1. Enter the name of the runner group
(Press Enter to use the default group):

# Enter the runner group name. Make sure it matches the group you created earlier.
```

```
2.	Enter the name of the runner
(Press Enter to accept the suggested default name, or type your own like staging-runner or prod-runner):

# Enter the runner name. For example
- Use "staging" for the staging server.
- Use "production" for the production server.
```

```
3. Enter additional labels (comma-separated)
(Optional — e.g. production,ubuntu or staging,ubuntu). These labels are what you’ll match later in your deploy.yml under runs-on.

# Enter the additional labels
- "self-hosted,staging" for the staging server.
- "self-hosted,production" for the production server.

# The labels must match the ones defined in your workflow file (we’ll explain this in a later step).
```

Install and start Runner 
```sh
$ sudo ./svc.sh install
$ sudo ./svc.sh start
```

Check Runner status

```sh
$ sudo ./svc.sh status
```
<br><br>

### Configure passwordless sudo for our user
Of course, every time we execute certain commands, we need to use `sudo`, which normally asks for a password. Commands like `chown`, `chmod`, `chgrp`, or restarting services all require `sudo` privileges and by default, it always prompts.

That’s fine when we’re on the server ourselves, but in an automated deployment (like GitHub Actions with __deploy.yml__, we'll explain later), there’s no way to type a password. The job would just fail.

To fix this, we set up passwordless sudo for the commands we actually need. This way, the workflow can run them automatically without stopping for input.
<br>

Here are the steps:

```sh
# Open the sudoers file
$ sudo visudo
```

Add the following entry at the bottom of the file, then save it:
```sh
# The user can execute chown, chmod, chgrp, find, or restart service without password
# Replace myuser with your actual server username
myuser ALL=(ALL) NOPASSWD: /bin/chown, /bin/chmod, /bin/chgrp, /usr/bin/find, /usr/bin/systemctl restart php8.3-fpm
```
<br><br>

### Create a workflow for each repository
Next, we need to create a workflow file inside `.github/workflows/deploy.yml`

Below is an example setup for both the API and Frontend, covering staging and production environments.

/api/.github/workflows/deploy.yml
```yaml
name: Deploy API

on:
  push:
    branches: [ main, staging ]
  workflow_dispatch:
    inputs:
      target_env:
        description: "Target environment"
        type: choice
        required: true
        options: [ staging, production ]

concurrency:
  group: api-${{ github.ref_name }}
  cancel-in-progress: true

jobs:
  choose-target:
    runs-on: ubuntu-latest
    outputs:
      target: ${{ steps.pick.outputs.target }}
      refname: ${{ steps.pick.outputs.refname }}
    steps:
      - id: pick
        run: |
          if [ -n "${{ github.event.inputs.target_env }}" ]; then
            echo "target=${{ github.event.inputs.target_env }}" >> $GITHUB_OUTPUT
          else
            if [ "${{ github.ref_name }}" = "main" ]; then
              echo "target=production" >> $GITHUB_OUTPUT
            else
              echo "target=staging" >> $GITHUB_OUTPUT
            fi
          fi
          echo "refname=${{ github.ref_name }}" >> $GITHUB_OUTPUT

  deploy:
    name: Deploy API (${{ needs.choose-target.outputs.target }})
    runs-on: ${{ needs.choose-target.outputs.target == 'production'
      && fromJSON('["self-hosted","production"]')
      || fromJSON('["self-hosted","staging"]') }}
    needs: choose-target
    steps:
      - name: Set paths & SSH key per environment
        run: |
          if [ "${{ needs.choose-target.outputs.target }}" = "production" ]; then
            echo "APP_PATH=/srv/apps/<your-application>/api" >> $GITHUB_ENV
            echo "HOME=/home/myuser" >> $GITHUB_ENV
            echo "GIT_SSH_COMMAND=ssh -i /home/myuser/.ssh/id_api -o IdentitiesOnly=yes" >> $GITHUB_ENV
          else
            echo "APP_PATH=/home/myuser/<your-application>/api" >> $GITHUB_ENV
            echo "HOME=/home/myuser" >> $GITHUB_ENV
            echo "GIT_SSH_COMMAND=ssh -i /home/myuser/.ssh/id_api -o IdentitiesOnly=yes" >> $GITHUB_ENV
          fi

      - name: Pre-fix ownership (allow git pull)
        run: |
          cd "$APP_PATH"
          sudo chown -R myuser:myuser .

      - name: Update code
        run: |
          set -euo pipefail
          git config --global --add safe.directory "$APP_PATH"
          cd "$APP_PATH"

          git fetch --prune origin ${{ needs.choose-target.outputs.refname }}
          git reset --hard origin/${{ needs.choose-target.outputs.refname }}

      - name: Install dependencies & cache
        run: |
          cd "$APP_PATH"
          if [ -f composer.json ]; then
            php composer.phar install --no-dev --prefer-dist --no-interaction --optimize-autoloader || true
            php artisan config:cache || true
            php artisan route:cache || true
          fi

      - name: Fix permissions back to www-data
        run: |
          cd "$APP_PATH"
          sudo chown -R www-data:www-data .
          sudo find . -type f -exec chmod 644 {} \;
          sudo find . -type d -exec chmod 755 {} \;
          sudo chgrp -R www-data storage bootstrap/cache
          sudo chmod -R ug+rwx storage bootstrap/cache

      - name: Restart PHP-FPM
        run: sudo systemctl restart php8.3-fpm
```


/web/.github/workflows/deploy.yml

```yaml

name: Deploy Web

on:
  push:
    branches: [ main, staging ]
  workflow_dispatch:
    inputs:
      target_env:
        description: "Target environment"
        type: choice
        required: true
        options: [ staging, production ]

concurrency:
  group: web-${{ github.ref_name }}
  cancel-in-progress: true

jobs:
  choose-target:
    runs-on: ubuntu-latest
    outputs:
      target: ${{ steps.pick.outputs.target }}
      refname: ${{ steps.pick.outputs.refname }}
    steps:
      - id: pick
        run: |
          if [ -n "${{ github.event.inputs.target_env }}" ]; then
            echo "target=${{ github.event.inputs.target_env }}" >> $GITHUB_OUTPUT
          else
            if [ "${{ github.ref_name }}" = "main" ]; then
              echo "target=production" >> $GITHUB_OUTPUT
            else
              echo "target=staging" >> $GITHUB_OUTPUT
            fi
          fi
          echo "refname=${{ github.ref_name }}" >> $GITHUB_OUTPUT

  deploy:
    name: Deploy Web (${{ needs.choose-target.outputs.target }})
    runs-on: ${{ needs.choose-target.outputs.target == 'production'
      && fromJSON('["self-hosted","production"]')
      || fromJSON('["self-hosted","staging"]') }}
    needs: choose-target
    steps:
      - name: Set paths, PM2 file & SSH key per environment
        run: |
          if [ "${{ needs.choose-target.outputs.target }}" = "production" ]; then
            echo "APP_PATH=/srv/apps/<your-application>/web" >> $GITHUB_ENV
            echo "PM2_FILE=/srv/apps/<your-application>/ecosystem.config.js" >> $GITHUB_ENV
            echo "HOME=/home/myuser" >> $GITHUB_ENV
            echo "GIT_SSH_COMMAND=ssh -i /home/myuser/.ssh/id_web -o IdentitiesOnly=yes" >> $GITHUB_ENV
          else
            echo "APP_PATH=/home/myuser/apps/web" >> $GITHUB_ENV
            echo "PM2_FILE=/home/myuser/apps/ecosystem.config.js" >> $GITHUB_ENV
            echo "HOME=/home/myuser" >> $GITHUB_ENV
            echo "GIT_SSH_COMMAND=ssh -i /home/myuser/.ssh/id_web -o IdentitiesOnly=yes" >> $GITHUB_ENV
          fi

      - name: Change ownership root project
        run: |
          cd "$APP_PATH"
          sudo chown -R myuser:myuser .

      - name: Update code and build in temp dir
        run: |
          set -euo pipefail
          git config --global --add safe.directory "$APP_PATH"
          cd "$APP_PATH"

          git fetch --prune origin ${{ needs.choose-target.outputs.refname }}
          git reset --hard origin/${{ needs.choose-target.outputs.refname }}

          if [ -f package.json ]; then
            if command -v yarn >/dev/null 2>&1; then
              yarn install --frozen-lockfile || yarn install

              TS=$(date +%Y%m%d%H%M%S)
              BUILD_DIR=".output-${TS}"

              # Build directly into .output, then rename
              npx nuxi build --dotenv .env.production
              mv .output "$BUILD_DIR"

              echo "BUILD_DIR=$BUILD_DIR" >> $GITHUB_ENV
            else
              echo "Yarn is not installed on this server"
              exit 1
            fi
          fi

      - name: Swap build atomically
        run: |
          cd "$APP_PATH"
          if [ -d ".output" ]; then
            mv .output ".output-old-$(date +%s)"
          fi
          mv "$BUILD_DIR" .output

      - name: Change ownership back to www-data
        run: |
          cd "$APP_PATH"
          sudo chown -R www-data:www-data .output

      - name: Reload PM2 processes
        run: |
          pm2 reload "$PM2_FILE"
          pm2 save

      - name: Cleanup old builds
        run: |
          cd "$APP_PATH"
          rm -rf .output-old-*
```

You can add each step in the workflow by declaring a __name__ (to describe the step) and a __run__ (to define the command to execute), assuming the command needs to be run on the server.

Note that the __runs-on__ section must include __self-hosted__ and match the labels you configured for your GitHub runner.

The __cancel-in-progress__ option should be set to __true__ if you want new jobs to replace any currently running job, ensuring the latest one runs immediately.

The use of `sudo` won’t prompt for a password here because we already configured passwordless `sudo` in [Step 8](#configure-passwordless-sudo-for-our-user).
<br><br>

### Test run
Finally, to test the setup, push some code to the `staging` branch. GitHub Actions will automatically trigger the deployment workflow and update the server. For more details, we can open the Actions tab in the repository to view the workflow logs and track the status of each run.
<br><br>