import { Migration } from '@mikro-orm/migrations';

export class Migration20250206184122 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "blog_resource_content" ("id" text not null, "title" text not null, "description" text not null, "content" text not null, "main_image" text not null, "link" text not null, "status" boolean not null, "author" text not null, "views" integer not null, "category" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "blog_resource_content_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_blog_resource_content_deleted_at" ON "blog_resource_content" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "blog_resource_content" cascade;`);
  }

}
