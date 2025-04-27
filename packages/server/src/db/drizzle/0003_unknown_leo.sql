ALTER TABLE "todos" RENAME TO "tasks";--> statement-breakpoint
ALTER TABLE "todo_users" RENAME COLUMN "todo_id" TO "task_id";--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "todos_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "todos_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "todos_updated_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "todos_deleted_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "todo_users" DROP CONSTRAINT "todo_users_todo_id_todos_id_fk";
--> statement-breakpoint
ALTER TABLE "todo_users" DROP CONSTRAINT "todo_users_todo_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "todo_users" ADD CONSTRAINT "todo_users_task_id_user_id_pk" PRIMARY KEY("task_id","user_id");--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_deleted_by_users_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "todo_users" ADD CONSTRAINT "todo_users_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE cascade;