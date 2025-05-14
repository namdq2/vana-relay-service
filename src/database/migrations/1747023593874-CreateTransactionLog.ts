import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTransactionLog1747023593874 implements MigrationInterface {
  name = 'CreateTransactionLog1747023593874';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."transaction_log_status_enum" AS ENUM(
                'success',
                'pending',
                'failed'
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "transaction_log" (
                "transactionHash" character varying NOT NULL,
                "status" "public"."transaction_log_status_enum" NOT NULL,
                "from" character varying NOT NULL,
                "to" character varying NOT NULL,
                "data" character varying,
                "value" character varying,
                "blockNumber" integer,
                "error" character varying,
                "chainId" integer NOT NULL,
                "metadata" jsonb,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_transaction_log" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "transaction_log"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."transaction_log_status_enum"
        `);
  }
}
