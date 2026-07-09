#!/usr/bin/env bash
# Deploy BinaryScouts on VPS — run ON THE SERVER after: ssh root@YOUR_IP
set -euo pipefail

APP_DIR="${APP_DIR:-/root/BinaryScouts}"
REPO_URL="${REPO_URL:-https://github.com/coriuday/gloryx.git}"
BRANCH="${BRANCH:-main}"

echo "==> Deploying BinaryScouts in $APP_DIR"

if [ ! -d "$APP_DIR/.git" ]; then
  echo "==> Cloning repo..."
  git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
  cd "$APP_DIR"
else
  cd "$APP_DIR"
  echo "==> Pulling latest..."
  git fetch origin
  git checkout "$BRANCH"
  git pull origin "$BRANCH"
fi

echo "==> Installing dependencies..."
npm ci || npm install

echo "==> Building Next.js..."
npm run build

echo "==> Restarting app..."
if command -v pm2 >/dev/null 2>&1; then
  if pm2 describe binaryscouts >/dev/null 2>&1; then
    pm2 restart binaryscouts
  else
    pm2 start npm --name binaryscouts -- start
    pm2 save
  fi
  pm2 status binaryscouts
elif systemctl is-active --quiet binaryscouts 2>/dev/null; then
  systemctl restart binaryscouts
  systemctl status binaryscouts --no-pager
else
  echo "No pm2/systemd service found. Start manually: cd $APP_DIR && npm start"
fi

echo "==> Done. Latest commit:"
git log -1 --oneline
