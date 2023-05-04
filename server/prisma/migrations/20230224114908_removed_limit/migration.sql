/*
  Warnings:

  - You are about to drop the column `limit` on the `Results` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Results" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subject" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "type" TEXT NOT NULL
);
INSERT INTO "new_Results" ("age", "id", "lang", "result", "subject", "type") SELECT "age", "id", "lang", "result", "subject", "type" FROM "Results";
DROP TABLE "Results";
ALTER TABLE "new_Results" RENAME TO "Results";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
