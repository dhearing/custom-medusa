import { Migration } from '@mikro-orm/migrations';

export class Migration20250206184130 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "navbar_content" ("id" text not null, "title" text not null, "link" text not null, "placement" integer not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "navbar_content_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_navbar_content_deleted_at" ON "navbar_content" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "navbar_content" cascade;`);
  }

}
