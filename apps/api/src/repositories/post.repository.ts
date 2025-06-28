import { db } from "@/db";
import { attachmentTable, postTable } from "@/db/schema";
import { AddAttachmentSchema } from "@/types";
import { AttachmentFile, Post } from "@repo/api-types";
import { eq } from "drizzle-orm";

export class PostRepository {
  async FindDraft(userId: number): Promise<Post | null> {
    const draft = await db.query.postTable.findFirst({
      where: (fields, { eq, and }) =>
        and(
          eq(fields.userId, userId),
          eq(fields.published, false),
          eq(fields.postType, "regular"),
        ),
    });
    if (!draft) {
      return null;
    }
    const attachments = await db.query.attachmentTable.findMany({
      where: (fields, { eq }) => eq(fields.postId, draft.id),
    });
    return { ...draft, attachments } as Post;
  }

  async CreateDraft(userId: number): Promise<Post> {
    const [post] = await db
      .insert(postTable)
      .values({
        userId,
        postType: "regular",
      })
      .returning();
    return { ...post, attachments: [] };
  }

  async CreateAttachment(
    draftId: number,
    userId: number,
    attachment: AddAttachmentSchema,
  ) {
    const [newAttachment] = await db
      .insert(attachmentTable)
      .values({
        postId: draftId,
        userId,
        url: attachment.url,
        assetId: attachment.assetId,
        publicId: attachment.publicId,
        type: attachment.type,
      })
      .returning();
    return newAttachment as AttachmentFile;
  }

  async Update(postId: number, update: Partial<{ content: string }>) {
    const updatedPost = await db
      .update(postTable)
      .set(update)
      .where(eq(postTable.id, postId))
      .returning();
    const post = updatedPost[0];
    return { ...post, attachments: [] };
  }
}
