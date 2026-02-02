import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1770028359259 implements MigrationInterface {
    name = 'InitMigration1770028359259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" ADD "isDeleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "isDeleted"`);
    }

}
