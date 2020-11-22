# Migration `20201122080547-init`

This migration has been generated by 권수현 at 11/22/2020, 5:05:47 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE `Profile` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `socialId` VARCHAR(191),
    `authType` ENUM('email', 'google', 'apple'),
    `userId` INT NOT NULL,
UNIQUE INDEX `Profile.userId_unique`(`userId`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `User` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `phoneNumber` VARCHAR(191),
    `password` VARCHAR(191),
    `name` VARCHAR(191),
    `photoURL` VARCHAR(191),
    `birthday` DATETIME(3),
    `gender` ENUM('male', 'female'),
    `createdAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3),
    `lastSignedIn` DATETIME(3),
UNIQUE INDEX `User.phoneNumber_unique`(`phoneNumber`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `Mission` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191),
    `discription` VARCHAR(191),
    `reward` VARCHAR(191),
    `startAt` DATETIME(3),
    `endAt` DATETIME(3),
    `winnerId` INT,
UNIQUE INDEX `Mission.winnerId_unique`(`winnerId`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `WorkOut` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191),
    `missionType` ENUM('tabata', 'static', 'setreps', 'maxreps', 'workOutTime', 'totalCount', 'totalAccTime'),
    `reps` INT,
    `time` INT,
    `set` INT,
    `rest` INT,
    `createdAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3),
    `userId` INT,
UNIQUE INDEX `WorkOut.userId_unique`(`userId`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `Goal` (
    `percent` INT,
    `createdAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INT NOT NULL,
    `missionId` INT NOT NULL,

    PRIMARY KEY (`userId`,`missionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `Condition` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `missionType` ENUM('tabata', 'static', 'setreps', 'maxreps', 'workOutTime', 'totalCount', 'totalAccTime'),
    `value` INT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `TotalCount` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `count` INT,
    `createdAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3),
    `userId` INT NOT NULL,
UNIQUE INDEX `TotalCount.userId_unique`(`userId`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `TotalAccTime` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `accTime` INT,
    `createdAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3),
    `userId` INT NOT NULL,
UNIQUE INDEX `TotalAccTime.userId_unique`(`userId`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `_ConditionToMission` (
    `A` INT NOT NULL,
    `B` INT NOT NULL,
UNIQUE INDEX `_ConditionToMission_AB_unique`(`A`,
`B`),
INDEX `_ConditionToMission_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

ALTER TABLE `Profile` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `Mission` ADD FOREIGN KEY (`winnerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE `WorkOut` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE `Goal` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `Goal` ADD FOREIGN KEY (`missionId`) REFERENCES `Mission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `TotalCount` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `TotalAccTime` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_ConditionToMission` ADD FOREIGN KEY (`A`) REFERENCES `Condition`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `_ConditionToMission` ADD FOREIGN KEY (`B`) REFERENCES `Mission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20201122080547-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,130 @@
+generator client {
+  provider = "prisma-client-js"
+}
+
+datasource db {
+  provider = "mysql"
+  url = "***"
+}
+
+model Profile {
+  id                Int                 @default(autoincrement()) @id
+  socialId          String? 
+  authType          AuthType? 
+  
+  userId            Int                 @unique
+  user              User                @relation(fields: [userId], references: [id])
+}   
+    
+model User {    
+  id                Int                 @default(autoincrement()) @id
+  phoneNumber       String?             @unique
+  password          String?       
+  name              String?       
+  photoURL          String?    
+  birthday          DateTime?       
+  gender            Gender?       
+  createdAt         DateTime?           @default(now())
+  updatedAt         DateTime?           @default(now()) @updatedAt
+  deletedAt         DateTime?
+  lastSignedIn      DateTime?
+
+  profile           Profile?
+  totalCount        TotalCount?
+  totalAccTime      TotalAccTime?
+
+  workOuts          WorkOut[]
+  missions          Mission[]
+  goals      Goal[]
+}
+
+model Mission {
+  id                Int                 @default(autoincrement()) @id
+  title             String?  
+  discription       String? 
+  reward            String?
+  startAt           DateTime?
+  endAt             DateTime?
+
+  winnerId          Int?                @unique
+  winner            User?               @relation(fields: [winnerId], references: [id])
+
+  achieves          Goal[]
+  conditions        Condition[]
+}
+
+model WorkOut {
+  id                Int                 @default(autoincrement()) @id
+  name              String? 
+  missionType       MissionType?
+  reps              Int?
+  time              Int?
+  set               Int?
+  rest              Int?
+  createdAt         DateTime?           @default(now())
+  updatedAt         DateTime?           @default(now()) @updatedAt
+  deletedAt         DateTime?
+
+  userId            Int?                @unique
+  user              User?               @relation(fields: [userId], references: [id])
+}
+
+model Goal {
+  percent           Int?
+  createdAt         DateTime?           @default(now())
+  
+  userId            Int                 
+  user              User                @relation(fields: [userId], references: [id])
+  missionId         Int                
+  mission           Mission             @relation(fields: [missionId], references: [id])
+  @@id([userId, missionId])
+}
+
+model Condition {
+  id                Int                 @default(autoincrement()) @id
+  missionType       MissionType?
+  value             Int?
+
+  missions          Mission[]
+}
+
+model TotalCount {
+  id                Int                 @default(autoincrement()) @id
+  count             Int?  
+  createdAt         DateTime?           @default(now())
+  deletedAt         DateTime?
+
+  userId            Int                 @unique 
+  user              User                @relation(fields: [userId], references: [id])
+}
+
+model TotalAccTime {
+  id                Int                 @default(autoincrement()) @id
+  accTime           Int?
+  createdAt         DateTime?           @default(now())
+  deletedAt         DateTime?
+
+  userId            Int                 @unique
+  user              User                @relation(fields: [userId], references: [id])
+}
+
+enum Gender {
+  male
+  female
+}
+
+enum AuthType {
+  email
+  google
+  apple
+}
+
+enum MissionType {
+  tabata
+  static
+  setreps
+  maxreps
+  workOutTime
+  totalCount
+  totalAccTime
+}
```

