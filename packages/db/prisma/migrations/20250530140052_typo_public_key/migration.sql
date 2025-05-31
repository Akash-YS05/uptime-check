-- Drop the typo'd column
ALTER TABLE "Validator" DROP COLUMN "publickKey";

-- Add the new column as nullable
ALTER TABLE "Validator" ADD COLUMN "publicKey" TEXT;

-- Ensure ALL existing rows get some value
UPDATE "Validator" SET "publicKey" = 'temporary-key' WHERE "publicKey" IS NULL;

-- Now safely enforce NOT NULL
ALTER TABLE "Validator" ALTER COLUMN "publicKey" SET NOT NULL;
