import { Migration } from '@mikro-orm/migrations';

export class Migration20250206184108 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "homepage_slider_content" ("id" text not null, "src" text not null, "link" text not null, "alt_text" text not null, "placement" integer not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "homepage_slider_content_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_homepage_slider_content_deleted_at" ON "homepage_slider_content" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "homepage_slider_content" cascade;`);
  }

}
