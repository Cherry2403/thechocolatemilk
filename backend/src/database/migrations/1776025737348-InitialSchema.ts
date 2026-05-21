import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1776025737348 implements MigrationInterface {
    name = 'InitialSchema1776025737348'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`CREATE TABLE "feed_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text, "image_url" character varying(500) NOT NULL, "category" character varying(50) NOT NULL, "brand" character varying(100), "product_link" character varying(500), "tags" json, "colors" json, "price" numeric(10,2), "currency" character varying(3) NOT NULL DEFAULT 'USD', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9a33f003d604fbe4060d75c7be2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_likes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "item_id" uuid NOT NULL, "liked_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f282a8337ef1216fe1f41d9f0a5" UNIQUE ("user_id", "item_id"), CONSTRAINT "PK_766a84015341ed59620e2542747" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_dislikes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "item_id" uuid NOT NULL, "disliked_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_69f8f72d23a4ca2c86e6de3a5ad" UNIQUE ("user_id", "item_id"), CONSTRAINT "PK_be56a6370c16a4db2510c104535" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "password_hash" character varying(255) NOT NULL, "username" character varying(100) NOT NULL, "private_assistant_name" character varying(100), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "connections" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "friend_id" uuid, "status" character varying(20) NOT NULL DEFAULT 'pending', "initiated_by" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0a1f844af3122354cbd487a8d03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "contact_id" uuid NOT NULL, "role" character varying(20) NOT NULL, "content" text NOT NULL, "image_url" character varying(500), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_40c55ee0e571e268b0d3cd37d10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d3a9a9338a4d216afc3407c159" ON "chat_messages" ("user_id", "contact_id", "created_at") `);
        await queryRunner.query(`ALTER TABLE "user_likes" ADD CONSTRAINT "FK_7392cc61e4d0e57d0c02fafdc72" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_likes" ADD CONSTRAINT "FK_615e27274d0418ed484c68d53c5" FOREIGN KEY ("item_id") REFERENCES "feed_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_dislikes" ADD CONSTRAINT "FK_c1ee8a53fbd9e5b36c823ec005e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_dislikes" ADD CONSTRAINT "FK_8c1db8210ce967d2b3cd5ec4c54" FOREIGN KEY ("item_id") REFERENCES "feed_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "connections" ADD CONSTRAINT "FK_86337b5c9ed96b6fb381a40ae61" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "connections" ADD CONSTRAINT "FK_c4f5075662846093e1584eaafae" FOREIGN KEY ("friend_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "connections" ADD CONSTRAINT "FK_689e1873d3c811cb703ad69112b" FOREIGN KEY ("initiated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_5588b6cea298cedec7063c0d33e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_5588b6cea298cedec7063c0d33e"`);
        await queryRunner.query(`ALTER TABLE "connections" DROP CONSTRAINT "FK_689e1873d3c811cb703ad69112b"`);
        await queryRunner.query(`ALTER TABLE "connections" DROP CONSTRAINT "FK_c4f5075662846093e1584eaafae"`);
        await queryRunner.query(`ALTER TABLE "connections" DROP CONSTRAINT "FK_86337b5c9ed96b6fb381a40ae61"`);
        await queryRunner.query(`ALTER TABLE "user_dislikes" DROP CONSTRAINT "FK_8c1db8210ce967d2b3cd5ec4c54"`);
        await queryRunner.query(`ALTER TABLE "user_dislikes" DROP CONSTRAINT "FK_c1ee8a53fbd9e5b36c823ec005e"`);
        await queryRunner.query(`ALTER TABLE "user_likes" DROP CONSTRAINT "FK_615e27274d0418ed484c68d53c5"`);
        await queryRunner.query(`ALTER TABLE "user_likes" DROP CONSTRAINT "FK_7392cc61e4d0e57d0c02fafdc72"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d3a9a9338a4d216afc3407c159"`);
        await queryRunner.query(`DROP TABLE "chat_messages"`);
        await queryRunner.query(`DROP TABLE "connections"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "user_dislikes"`);
        await queryRunner.query(`DROP TABLE "user_likes"`);
        await queryRunner.query(`DROP TABLE "feed_items"`);
    }

}
