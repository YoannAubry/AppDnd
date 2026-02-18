-- CreateTable
CREATE TABLE "Monster" (
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
    "attributes" JSONB,
    "traits" JSONB,
    "actions" JSONB
);

-- CreateTable
CREATE TABLE "NPC" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "image" TEXT,
    "personality" TEXT,
    "history" TEXT,
    "inventory" JSONB,
    "spells" JSONB,
    "combatType" TEXT NOT NULL DEFAULT 'none',
    "customStats" JSONB,
    "monsterId" TEXT,
    CONSTRAINT "NPC_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "Monster" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "level" TEXT,
    "image" TEXT,
    "synopsis" TEXT
);

-- CreateTable
CREATE TABLE "Act" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "campaignId" TEXT NOT NULL,
    CONSTRAINT "Act_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "playerName" TEXT,
    "avatar" TEXT,
    "race" TEXT,
    "class" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "hpMax" INTEGER NOT NULL DEFAULT 10,
    "ac" INTEGER NOT NULL DEFAULT 10,
    "initBonus" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "_LocationNPCs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_LocationNPCs_A_fkey" FOREIGN KEY ("A") REFERENCES "Location" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_LocationNPCs_B_fkey" FOREIGN KEY ("B") REFERENCES "NPC" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_LocationMonsters" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_LocationMonsters_A_fkey" FOREIGN KEY ("A") REFERENCES "Location" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_LocationMonsters_B_fkey" FOREIGN KEY ("B") REFERENCES "Monster" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ActLocations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ActLocations_A_fkey" FOREIGN KEY ("A") REFERENCES "Act" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ActLocations_B_fkey" FOREIGN KEY ("B") REFERENCES "Location" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Monster_slug_key" ON "Monster"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_slug_key" ON "Campaign"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_LocationNPCs_AB_unique" ON "_LocationNPCs"("A", "B");

-- CreateIndex
CREATE INDEX "_LocationNPCs_B_index" ON "_LocationNPCs"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LocationMonsters_AB_unique" ON "_LocationMonsters"("A", "B");

-- CreateIndex
CREATE INDEX "_LocationMonsters_B_index" ON "_LocationMonsters"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ActLocations_AB_unique" ON "_ActLocations"("A", "B");

-- CreateIndex
CREATE INDEX "_ActLocations_B_index" ON "_ActLocations"("B");
