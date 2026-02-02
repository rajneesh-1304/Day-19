import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1770025948259 implements MigrationInterface {
    name = 'InitMigration1770025948259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "isValid"`);
        await queryRunner.query(`ALTER TABLE "answers" ADD "isValid" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answers" DROP COLUMN "isValid"`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "isValid" boolean NOT NULL DEFAULT false`);
    }

}
