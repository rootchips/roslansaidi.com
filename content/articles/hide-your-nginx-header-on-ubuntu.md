---
title: "Hide your NGINX header on Ubuntu"
description: How to turn off or mask the NGINX server header on Ubuntu to keep the server details private.
date: 2019-10-13
image: https://images.unsplash.com/photo-1591871324483-14c6718379c1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXw3MDY4MzgyNnx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=500
minRead: 2
author:
  name: Roslan Saidi
  avatar:
    src: https://avatars.githubusercontent.com/u/13043860?v=4
    alt: Roslan Saidi
---

Did you know you can hide your web server header?  
So what’s the purpose of this approach?

I believe this is one of the best **security practices** — it helps obscure what web server you’re using, making it slightly harder for attackers to fingerprint your setup.

---

## Step 1 — Upgrade NGINX to the Latest Stable

To start, install the necessary dependencies and upgrade to the latest stable version of NGINX:

```bash
sudo apt install software-properties-common nginx=stable
```

---

## Add NGINX Repository

Now, add the official NGINX PPA repository:

```bash
sudo add-apt-repository -y ppa:nginx/$nginx
```

---

## Update the Package Lists

Next, update your system package lists and upgrade your packages:

```bash
sudo apt update
sudo apt dist-upgrade
```

---

## Check NGINX Version

Verify that NGINX was installed or upgraded successfully:

```bash
nginx -v
```

---

## Install `nginx-extras`

The `nginx-extras` package provides additional modules, including the one required for custom headers.

```bash
sudo apt install nginx-extras
```

---

## Edit the NGINX Configuration File

Open your main NGINX configuration file in your preferred editor:

```bash
sudo vim /etc/nginx/nginx.conf
```

---

## Add Modules and Custom Headers

Add the following **module** at the top of your configuration file (outside of any block):

```yaml
load_module modules/ngx_http_headers_more_filter_module.so;
```

Then, inside the **http block**, add the line below to customize your server header:

```yaml
http {
  more_set_headers "Server: Your Server";
}
```

You can replace `"Your Server"` with any label you prefer (or even an empty string if you want it completely blank).

---

## Test and Restart NGINX

Before restarting, always test your configuration to ensure there are no syntax errors:

```bash
sudo nginx -t
```

If everything is OK, restart NGINX:

```bash
sudo service nginx restart
```

---

## Done!

That’s it!<br>
You’ve successfully hidden or customized your **NGINX server header**.

This is a small but valuable hardening step for your web server’s security posture.  
While it won’t make your server bulletproof, it helps minimize unnecessary information exposure — a fundamental part of **defense in depth**.

---

### Bonus Tip

To verify your change, run:

```bash
curl -I https://yourdomain.com
```

You should now see:

```
Server: Your Server
```

instead of the default NGINX version header.

---
