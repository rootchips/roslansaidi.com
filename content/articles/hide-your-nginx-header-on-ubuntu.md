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

Did you know that your web server may be revealing information about itself in every HTTP response?

By default, NGINX sends a Server header that can expose the web server software in use and sometimes even its version. While this does not secure your server on its own, reducing unnecessary disclosure is a good hardening practice.

Masking or removing this header helps make fingerprinting your server slightly more difficult for attackers. It is a small step, but it fits well within a defense-in-depth approach.

---

## Upgrade NGINX to the Latest Stable

First, install the required dependency and prepare your system:

```bash
sudo apt install software-properties-common nginx=stable
```

---

## Add NGINX Repository

Next, add the official NGINX PPA repository:

```bash
sudo add-apt-repository -y ppa:nginx/$nginx
```

---

## Update the Package Lists

Refresh your package index and upgrade installed packages:

```bash
sudo apt update
sudo apt dist-upgrade
```

---

## Check NGINX Version

Confirm that NGINX has been installed or upgraded successfully:

```bash
nginx -v
```

---

## Install `nginx-extras`

The `nginx-extras` package includes additional modules, including the one needed to customize response headers.

```bash
sudo apt install nginx-extras
```

---

## Edit the NGINX Configuration File

Open the main NGINX configuration file in your preferred editor:

```bash
sudo vim /etc/nginx/nginx.conf
```

---

## Add Modules and Custom Headers

At the top of the configuration file, outside of any block, add:

```yaml
load_module modules/ngx_http_headers_more_filter_module.so;
```

Then, inside the `http` block, add:

```yaml
http {
  more_set_headers "Server: Your Server";
}
```

Replace `Your Server` with any value you want. You can also use a generic label if you prefer not to expose any meaningful server information.

---

## Test and Restart NGINX

Before restarting NGINX, check the configuration for syntax errors:

```bash
sudo nginx -t
```

If the test passes, continue with the restart.

Apply the changes by restarting the NGINX service:

```bash
sudo service nginx restart
```

---

## Done!

That’s it!<br>
You’ve successfully hidden or customized your **NGINX server header**.

This is a small but useful hardening measure. It will not make your server immune to attacks, but it helps reduce unnecessary information leakage and supports a stronger overall security posture.

---

### Bonus Tip

To confirm the change, run:

```bash
curl -I https://yourdomain.com
```

You should now see:

```
Server: Your Server
```

instead of the default NGINX version header.

---

### Final Note

Hiding the Server header should be treated as a cosmetic security improvement, not a substitute for real protection. Keep your server secure by combining this with regular updates, proper firewall rules, secure configuration, TLS best practices and continuous monitoring.
