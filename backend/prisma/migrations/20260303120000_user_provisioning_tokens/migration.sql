-- Create required extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enums if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AccountStatus') THEN
    CREATE TYPE "AccountStatus" AS ENUM ('PENDING_VERIFICATION', 'ACTIVE', 'DISABLED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TokenType') THEN
    CREATE TYPE "TokenType" AS ENUM ('VERIFY_EMAIL', 'SET_PASSWORD');
  END IF;
END $$;

-- Convert legacy Prisma "User" table into new "users" table
ALTER TABLE IF EXISTS "User" RENAME TO "users";

-- Columns: email, username nullable, password_hash, status, email_verified, locked, timestamps
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email" TEXT;
UPDATE "users" SET "email" = COALESCE("email", LOWER("username") || '@brightmts.local') WHERE "email" IS NULL;
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;

-- Ensure username can be nullable going forward
ALTER TABLE "users" ALTER COLUMN "username" DROP NOT NULL;

-- Rename password column to password_hash (if coming from legacy schema)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'password'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE "users" RENAME COLUMN "password" TO "password_hash";
  END IF;
END $$;

-- Drop legacy reset fields if present
ALTER TABLE "users" DROP COLUMN IF EXISTS "resetToken";
ALTER TABLE "users" DROP COLUMN IF EXISTS "resetExpiry";

-- Rename createdAt -> created_at if present
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'createdAt'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
END $$;

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "status" "AccountStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION';
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email_verified" BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "locked" BOOLEAN NOT NULL DEFAULT TRUE;

-- Convert integer id -> uuid id
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "id_new" UUID NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_pkey";
ALTER TABLE "users" DROP COLUMN IF EXISTS "id";
ALTER TABLE "users" RENAME COLUMN "id_new" TO "id";
ALTER TABLE "users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- Uniqueness constraints
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "users_username_key" ON "users"("username");

-- Allow existing users to continue logging in (bootstrap)
UPDATE "users" SET "status" = 'ACTIVE', "email_verified" = TRUE, "locked" = FALSE
WHERE "status" = 'PENDING_VERIFICATION';

-- Create token table
CREATE TABLE IF NOT EXISTS "user_tokens" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "token_hash" TEXT NOT NULL,
  "token_type" "TokenType" NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "used_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "user_tokens_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "user_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "user_tokens_user_id_idx" ON "user_tokens"("user_id");
CREATE INDEX IF NOT EXISTS "user_tokens_token_hash_idx" ON "user_tokens"("token_hash");
