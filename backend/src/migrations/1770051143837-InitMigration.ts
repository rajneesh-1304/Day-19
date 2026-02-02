import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1770051143837 implements MigrationInterface {
    name = 'InitMigration1770051143837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "question_votes" ("id" SERIAL NOT NULL, "vote" "public"."question_votes_vote_enum" NOT NULL, "userId" integer, "questionId" integer, CONSTRAINT "UQ_c320ad1cbdd87f967e76177a510" UNIQUE ("userId", "questionId"), CONSTRAINT "PK_4fcf37b1bcad3cc75921424dc07" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tags" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE ("name"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "questions" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "type" "public"."questions_type_enum" NOT NULL DEFAULT 'DRAFT', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "upVotes" integer NOT NULL DEFAULT '0', "downVotes" integer NOT NULL DEFAULT '0', "score" integer NOT NULL DEFAULT '0', "isDeleted" boolean NOT NULL DEFAULT false, "userId" integer, CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "answer_votes" ("id" SERIAL NOT NULL, "vote" "public"."answer_votes_vote_enum" NOT NULL, "userId" integer, "answerId" integer, CONSTRAINT "UQ_7c0d88718e56e91ce473a76773e" UNIQUE ("userId", "answerId"), CONSTRAINT "PK_767f6bc508e4f2d6d08d65beb31" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "answers" ("id" SERIAL NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "upVotes" integer NOT NULL DEFAULT '0', "downVotes" integer NOT NULL DEFAULT '0', "score" integer NOT NULL DEFAULT '0', "isValid" boolean NOT NULL DEFAULT false, "userId" integer, "questionId" integer, "parentAnswerId" integer, CONSTRAINT "PK_9c32cec6c71e06da0254f2226c6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "displayName" character varying NOT NULL, "email" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "isBanned" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question_tags" ("questionsId" integer NOT NULL, "tagsId" integer NOT NULL, CONSTRAINT "PK_6404257efb2f95c6694fb7f065c" PRIMARY KEY ("questionsId", "tagsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6ad4958737dfed6546a70bd276" ON "question_tags" ("questionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6bb956b012373faa7b4390617a" ON "question_tags" ("tagsId") `);
        await queryRunner.query(`ALTER TABLE "question_votes" ADD CONSTRAINT "FK_a5456f539a954a91c7b808347d5" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question_votes" ADD CONSTRAINT "FK_fb7b67f20b9ef18a2bc082fc74e" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "FK_bc2370231ea3e3d296963f33939" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer_votes" ADD CONSTRAINT "FK_3a9e5a77d85cc2daed4656a6ded" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer_votes" ADD CONSTRAINT "FK_d000391d3f93664a25350b85d42" FOREIGN KEY ("answerId") REFERENCES "answers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answers" ADD CONSTRAINT "FK_1bd66b7e0599333e61d2e3e1678" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answers" ADD CONSTRAINT "FK_c38697a57844f52584abdb878d7" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answers" ADD CONSTRAINT "FK_7bbb0cdd12fca3247fa1e0fb160" FOREIGN KEY ("parentAnswerId") REFERENCES "answers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question_tags" ADD CONSTRAINT "FK_6ad4958737dfed6546a70bd2762" FOREIGN KEY ("questionsId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "question_tags" ADD CONSTRAINT "FK_6bb956b012373faa7b4390617a2" FOREIGN KEY ("tagsId") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_tags" DROP CONSTRAINT "FK_6bb956b012373faa7b4390617a2"`);
        await queryRunner.query(`ALTER TABLE "question_tags" DROP CONSTRAINT "FK_6ad4958737dfed6546a70bd2762"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP CONSTRAINT "FK_7bbb0cdd12fca3247fa1e0fb160"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP CONSTRAINT "FK_c38697a57844f52584abdb878d7"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP CONSTRAINT "FK_1bd66b7e0599333e61d2e3e1678"`);
        await queryRunner.query(`ALTER TABLE "answer_votes" DROP CONSTRAINT "FK_d000391d3f93664a25350b85d42"`);
        await queryRunner.query(`ALTER TABLE "answer_votes" DROP CONSTRAINT "FK_3a9e5a77d85cc2daed4656a6ded"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_bc2370231ea3e3d296963f33939"`);
        await queryRunner.query(`ALTER TABLE "question_votes" DROP CONSTRAINT "FK_fb7b67f20b9ef18a2bc082fc74e"`);
        await queryRunner.query(`ALTER TABLE "question_votes" DROP CONSTRAINT "FK_a5456f539a954a91c7b808347d5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6bb956b012373faa7b4390617a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6ad4958737dfed6546a70bd276"`);
        await queryRunner.query(`DROP TABLE "question_tags"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "answers"`);
        await queryRunner.query(`DROP TABLE "answer_votes"`);
        await queryRunner.query(`DROP TABLE "questions"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP TABLE "question_votes"`);
    }

}
