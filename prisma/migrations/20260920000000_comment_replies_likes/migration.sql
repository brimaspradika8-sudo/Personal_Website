ALTER TABLE "Comment" ADD COLUMN "parent_id" UUID;

CREATE TABLE "CommentLike" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "comment_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CommentLike_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CommentLike_user_id_comment_id_key" ON "CommentLike"("user_id", "comment_id");
CREATE INDEX "CommentLike_comment_id_idx" ON "CommentLike"("comment_id");
CREATE INDEX "Comment_parent_id_idx" ON "Comment"("parent_id");

ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parent_id_fkey"
  FOREIGN KEY ("parent_id") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommentLike" ADD CONSTRAINT "CommentLike_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommentLike" ADD CONSTRAINT "CommentLike_comment_id_fkey"
  FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;