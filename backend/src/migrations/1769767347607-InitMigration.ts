import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1769767347607 implements MigrationInterface {
    name = 'InitMigration1769767347607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answers" DROP COLUMN "is_Valid"`);
        await queryRunner.query(`ALTER TABLE "answers" ADD "isValid" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "answers" ALTER COLUMN "userId" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answers" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "answers" DROP COLUMN "isValid"`);
        await queryRunner.query(`ALTER TABLE "answers" ADD "is_Valid" boolean NOT NULL`);
    }

}
