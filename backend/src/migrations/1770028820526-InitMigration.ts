import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1770028820526 implements MigrationInterface {
    name = 'InitMigration1770028820526'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "isBanned" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isBanned"`);
    }

}
