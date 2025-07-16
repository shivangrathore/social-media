import { AddAttachmentSchemaType } from "@repo/types";
import { IAttachmentRepository } from "./respository";
import { Attachment } from "@repo/types";
import { db } from "@/db";
import { and, eq, InferSelectModel } from "drizzle-orm";
import { attachmentTable } from "@/db/schema";
import { ServiceError } from "@/utils/errors";

type DBAttachment = InferSelectModel<typeof attachmentTable>;

export class AttachmentRepository implements IAttachmentRepository {
  private mapAttachment(attachment: DBAttachment): Attachment {
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
  ): Promise<Attachment> {
    const attachment = await db.transaction(async (tx) => {
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

  async deleteAttachment(attachmentId: number, postId: number): Promise<void> {
    await db.transaction(async (tx) => {
      const attachment = await tx
        .delete(attachmentTable)
        .where(
          and(
            eq(attachmentTable.id, attachmentId),
            eq(attachmentTable.postId, postId),
          ),
        )
        .returning();
      if (attachment.length === 0) {
        throw ServiceError.NotFound("Attachment not found");
      }
    });
    return;
  }
  async getAttachmentsByPostId(postId: number): Promise<Attachment[]> {
    const attachments = await db.query.attachmentTable.findMany({
      where: eq(attachmentTable.postId, postId),
    });
    return attachments.map(this.mapAttachment);
  }
}
