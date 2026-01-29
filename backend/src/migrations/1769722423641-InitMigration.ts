import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1769722423641 implements MigrationInterface {
    name = 'InitMigration1769722423641'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "timestamp" TO "createdAt"`);
        await queryRunner.query(`CREATE TABLE "tags" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE ("name"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "questions" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "type" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question_tags" ("questionsId" integer NOT NULL, "tagsId" integer NOT NULL, CONSTRAINT "PK_6404257efb2f95c6694fb7f065c" PRIMARY KEY ("questionsId", "tagsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6ad4958737dfed6546a70bd276" ON "question_tags" ("questionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6bb956b012373faa7b4390617a" ON "question_tags" ("tagsId") `);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "FK_bc2370231ea3e3d296963f33939" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question_tags" ADD CONSTRAINT "FK_6ad4958737dfed6546a70bd2762" FOREIGN KEY ("questionsId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "question_tags" ADD CONSTRAINT "FK_6bb956b012373faa7b4390617a2" FOREIGN KEY ("tagsId") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_tags" DROP CONSTRAINT "FK_6bb956b012373faa7b4390617a2"`);
        await queryRunner.query(`ALTER TABLE "question_tags" DROP CONSTRAINT "FK_6ad4958737dfed6546a70bd2762"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_bc2370231ea3e3d296963f33939"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" character varying NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6bb956b012373faa7b4390617a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6ad4958737dfed6546a70bd276"`);
        await queryRunner.query(`DROP TABLE "question_tags"`);
        await queryRunner.query(`DROP TABLE "questions"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "createdAt" TO "timestamp"`);
    }

}
