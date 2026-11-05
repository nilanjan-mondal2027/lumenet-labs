#!/usr/bin/env bash
set -euo pipefail

echo "Running lightweight secret scan..."

PATTERN='(sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{20,}|OPENAI_API_KEY|DATABASE_URL|AWS_SECRET_ACCESS_KEY|CLIENT_SECRET|PRIVATE_KEY|SUPABASE_SERVICE_ROLE|STRIPE_SECRET)'

echo
echo "[1/2] Scanning tracked files"
git grep -nE "${PATTERN}" -- . ':!*.mp4' ':!*.webm' ':!*.pdf' ':!.env.example' || true

echo
echo "[2/2] Scanning git history revisions"
while IFS= read -r rev; do
  git grep -nE "${PATTERN}" "${rev}" -- . ':!*.mp4' ':!*.webm' ':!*.pdf' ':!.env.example' || true
done < <(git rev-list --all)

echo
echo "Secret scan completed."
