ALTER TABLE "categories" RENAME TO "task_categories";--> statement-breakpoint
ALTER TABLE "task_categories" DROP CONSTRAINT "categories_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "task_categories" DROP CONSTRAINT "categories_updated_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "task_categories" DROP CONSTRAINT "categories_deleted_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "task_categories" ADD CONSTRAINT "task_categories_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "task_categories" ADD CONSTRAINT "task_categories_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "task_categories" ADD CONSTRAINT "task_categories_deleted_by_users_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_category_id_task_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."task_categories"("id") ON DELETE restrict ON UPDATE cascade;