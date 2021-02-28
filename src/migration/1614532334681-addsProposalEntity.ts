import {MigrationInterface, QueryRunner} from "typeorm";

export class addsProposalEntity1614532334681 implements MigrationInterface {
    name = 'addsProposalEntity1614532334681'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "pubAddr"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "nonce"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "pubAddr" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "nonce" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "offerAddress" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "wantedAddress" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_8bf09ba754322ab9c22a215c919" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_8bf09ba754322ab9c22a215c919"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "wantedAddress"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "offerAddress"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "nonce"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "pubAddr"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "nonce" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "pubAddr" character varying NOT NULL`);
    }

}
