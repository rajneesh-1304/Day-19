import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1769919460535 implements MigrationInterface {
    name = 'InitMigration1769919460535'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."question_votes_vote_enum" AS ENUM('UP', 'DOWN')`);
        await queryRunner.query(`CREATE TABLE "question_votes" ("id" SERIAL NOT NULL, "vote" "public"."question_votes_vote_enum" NOT NULL, "userId" integer, "questionId" integer, CONSTRAINT "UQ_c320ad1cbdd87f967e76177a510" UNIQUE ("userId", "questionId"), CONSTRAINT "PK_4fcf37b1bcad3cc75921424dc07" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."answer_votes_vote_enum" AS ENUM('UP', 'DOWN')`);
        await queryRunner.query(`CREATE TABLE "answer_votes" ("id" SERIAL NOT NULL, "vote" "public"."answer_votes_vote_enum" NOT NULL, "userId" integer, "answerId" integer, CONSTRAINT "UQ_7c0d88718e56e91ce473a76773e" UNIQUE ("userId", "answerId"), CONSTRAINT "PK_767f6bc508e4f2d6d08d65beb31" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "answers" DROP COLUMN "answer"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP COLUMN "upVote"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP COLUMN "downVote"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP COLUMN "isValid"`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "upVotes" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "downVotes" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "score" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "answers" ADD "content" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "answers" ADD "upVotes" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "answers" ADD "downVotes" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "answers" ADD "score" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "answers" ADD "parentAnswerId" integer`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('USER', 'ADMIN')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER'`);
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."questions_type_enum" AS ENUM('DRAFT', 'PUBLIC')`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "type" "public"."questions_type_enum" NOT NULL DEFAULT 'DRAFT'`);
        await queryRunner.query(`ALTER TABLE "question_votes" ADD CONSTRAINT "FK_a5456f539a954a91c7b808347d5" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question_votes" ADD CONSTRAINT "FK_fb7b67f20b9ef18a2bc082fc74e" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer_votes" ADD CONSTRAINT "FK_3a9e5a77d85cc2daed4656a6ded" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer_votes" ADD CONSTRAINT "FK_d000391d3f93664a25350b85d42" FOREIGN KEY ("answerId") REFERENCES "answers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answers" ADD CONSTRAINT "FK_1bd66b7e0599333e61d2e3e1678" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answers" ADD CONSTRAINT "FK_7bbb0cdd12fca3247fa1e0fb160" FOREIGN KEY ("parentAnswerId") REFERENCES "answers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answers" DROP CONSTRAINT "FK_7bbb0cdd12fca3247fa1e0fb160"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP CONSTRAINT "FK_1bd66b7e0599333e61d2e3e1678"`);
        await queryRunner.query(`ALTER TABLE "answer_votes" DROP CONSTRAINT "FK_d000391d3f93664a25350b85d42"`);
        await queryRunner.query(`ALTER TABLE "answer_votes" DROP CONSTRAINT "FK_3a9e5a77d85cc2daed4656a6ded"`);
        await queryRunner.query(`ALTER TABLE "question_votes" DROP CONSTRAINT "FK_fb7b67f20b9ef18a2bc082fc74e"`);
        await queryRunner.query(`ALTER TABLE "question_votes" DROP CONSTRAINT "FK_a5456f539a954a91c7b808347d5"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."questions_type_enum"`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP COLUMN "parentAnswerId"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP COLUMN "score"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP COLUMN "downVotes"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP COLUMN "upVotes"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "score"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "downVotes"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "upVotes"`);
        await queryRunner.query(`ALTER TABLE "answers" ADD "isValid" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "answers" ADD "downVote" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "answers" ADD "upVote" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "answers" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "answers" ADD "answer" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "answer_votes"`);
        await queryRunner.query(`DROP TYPE "public"."answer_votes_vote_enum"`);
        await queryRunner.query(`DROP TABLE "question_votes"`);
        await queryRunner.query(`DROP TYPE "public"."question_votes_vote_enum"`);
    }

}
