#!/bin/bash
set -e

DOMAIN="tfs.ma"
EMAIL="zakiossama28@gmail.com"

echo ">>> Setting up SSL for $DOMAIN and www.$DOMAIN..."

# 1. Ensure Nginx is running
# Note: default.conf is already mounted by docker-compose from /opt/tfs/nginx/default.conf
docker compose up -d nginx

# 2. Request Certificate for both domain and www subdomain
echo ">>> Requesting Certificate for $DOMAIN and www.$DOMAIN..."
docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot \
    -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --no-eff-email --force-renewal

# 3. Swap to SSL Config
echo ">>> Swapping to SSL Configuration..."
# We assume ssl.conf is uploaded to /opt/tfs/nginx/ssl.conf
cat /opt/tfs/nginx/ssl.conf > /opt/tfs/nginx/default.conf

# 4. Reload Nginx
echo ">>> Reloading Nginx..."
docker compose exec nginx nginx -s reload

echo "✅ SSL Enabled! https://$DOMAIN and https://www.$DOMAIN should be working."
