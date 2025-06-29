import { AddAttachmentSchemaType } from "@repo/request-schemas";
import { IAttachmentRepository } from "./respository";
import { IAttachment } from "@repo/types";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { attachmentTable, postTable } from "@/db/schema";
import { ServiceError } from "@/utils/errors";

type DBAttachment = typeof attachmentTable.$inferInsert;

export class AttachmentRepository implements IAttachmentRepository {
  private mapAttachment(attachment: DBAttachment): IAttachment {
    return {
      id: attachment.id,
      postId: attachment.postId,
      userId: attachment.userId,
      url: attachment.url,
      assetId: attachment.assetId,
      publicId: attachment.publicId,
      type: attachment.type,
      createdAt: attachment.createdAt,
    };
  }
  async addAttachment(
    payload: AddAttachmentSchemaType,
    userId: number,
    postId: number,
  ): Promise<IAttachment> {
    const attachment = await db.transaction(async (tx) => {
      const post = await tx.query.postTable.findFirst({
        where: () =>
          and(eq(postTable.id, postId), eq(postTable.userId, userId)),
      });
      if (!post) {
        throw ServiceError.BadRequest("Post not found");
      }
      if (post.published) {
        throw ServiceError.BadRequest(
          "Cannot add attachment to a published post",
        );
      }
      const attachment = await tx
        .insert(attachmentTable)
        .values({
          postId,
          userId,
          url: payload.url,
          assetId: payload.assetId,
          publicId: payload.publicId,
          type: payload.type,
        })
        .returning();
      return attachment;
    });
    return this.mapAttachment(attachment[0]);
  }

  async deleteAttachment(attachmentId: number, userId: number): Promise<void> {
    // Implementation for deleting an attachment
    throw new Error("");
  }
}
