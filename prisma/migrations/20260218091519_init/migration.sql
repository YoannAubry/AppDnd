-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Monster" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "image" TEXT,
    "ac" INTEGER NOT NULL,
    "hp" TEXT NOT NULL,
    "speed" TEXT NOT NULL,
    "challenge" TEXT,
    "senses" TEXT,
    "languages" TEXT,
    "alignment" TEXT,
    "attributes" TEXT,
    "traits" TEXT,
    "actions" TEXT
);
INSERT INTO "new_Monster" ("ac", "actions", "alignment", "attributes", "challenge", "hp", "id", "image", "languages", "name", "senses", "slug", "speed", "traits", "type") SELECT "ac", "actions", "alignment", "attributes", "challenge", "hp", "id", "image", "languages", "name", "senses", "slug", "speed", "traits", "type" FROM "Monster";
DROP TABLE "Monster";
ALTER TABLE "new_Monster" RENAME TO "Monster";
CREATE UNIQUE INDEX "Monster_slug_key" ON "Monster"("slug");
CREATE TABLE "new_NPC" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "image" TEXT,
    "personality" TEXT,
    "history" TEXT,
    "inventory" TEXT,
    "spells" TEXT,
    "combatType" TEXT NOT NULL DEFAULT 'none',
    "customStats" TEXT,
    "monsterId" TEXT,
    CONSTRAINT "NPC_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "Monster" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_NPC" ("combatType", "customStats", "history", "id", "image", "inventory", "monsterId", "name", "personality", "role", "spells") SELECT "combatType", "customStats", "history", "id", "image", "inventory", "monsterId", "name", "personality", "role", "spells" FROM "NPC";
DROP TABLE "NPC";
ALTER TABLE "new_NPC" RENAME TO "NPC";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
