import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1770023284335 implements MigrationInterface {
    name = 'InitMigration1770023284335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" ADD "isValid" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "isValid"`);
    }

}
