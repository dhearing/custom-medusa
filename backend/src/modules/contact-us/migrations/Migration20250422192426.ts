import { Migration } from '@mikro-orm/migrations';

export class Migration20250422192426 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "contact_us_content" ("id" text not null, "name" text not null, "email" text not null, "phone" text not null, "subject" text not null, "message" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "contact_us_content_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_contact_us_content_deleted_at" ON "contact_us_content" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "contact_us_content" cascade;`);
  }

}
