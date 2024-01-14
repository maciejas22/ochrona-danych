#!/bin/bash
set -e

npm run prisma:generate

npm run prisma:migrate:deploy

exec "$@"
