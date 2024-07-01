/*
 Navicat Premium Data Transfer

 Source Server         : MediaLink
 Source Server Type    : PostgreSQL
 Source Server Version : 140012 (140012)
 Source Host           : localhost:5432
 Source Catalog        : media
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 140012 (140012)
 File Encoding         : 65001

 Date: 01/07/2024 06:50:43
*/


-- ----------------------------
-- Table structure for links
-- ----------------------------
DROP TABLE IF EXISTS "public"."links";
CREATE TABLE "public"."links" (
  "web_url" varchar(500) COLLATE "pg_catalog"."default",
  "media_url" text COLLATE "pg_catalog"."default",
  "type" varchar(50) COLLATE "pg_catalog"."default",
  "title" varchar(500) COLLATE "pg_catalog"."default",
  "id" uuid NOT NULL DEFAULT gen_random_uuid()
)
;
ALTER TABLE "public"."links" OWNER TO "admin";

-- ----------------------------
-- Primary Key structure for table links
-- ----------------------------
ALTER TABLE "public"."links" ADD CONSTRAINT "links_pkey" PRIMARY KEY ("id");
