import { AddAttachmentSchema } from "@/types";
import { ServiceError } from "@/utils/errors";
import { AttachmentFile, Post } from "@repo/api-types";

interface IPostRepository {
  CreateDraft(userId: number): Promise<Post>;
  CreateAttachment(
    draftId: number,
    userId: number,
    attachment: AddAttachmentSchema,
  ): Promise<AttachmentFile>;
  FindDraft(userId: number): Promise<Post | null>;
  Update(postId: number, update: Partial<{ content: string }>): Promise<Post>;
}

export class PostService {
  constructor(private postRepository: IPostRepository) {}
  async CreateDraft(userId: number) {
    const existing = await this.postRepository.FindDraft(userId);
    if (existing) {
      return existing;
    }
    const draft = await this.postRepository.CreateDraft(userId);
    return draft;
  }

  async AddAttachment(
    draftId: number,
    userId: number,
    attachment: AddAttachmentSchema,
  ) {
    const draft = await this.postRepository.FindDraft(userId);
    if (!draft || draft.id !== draftId) {
      throw ServiceError.NotFound("Draft post not found");
    }
    const newAttachment = await this.postRepository.CreateAttachment(
      draftId,
      userId,
      attachment,
    );
    return newAttachment;
  }

  async UpdateDraftContent(userId: number, content: string) {
    const draft = await this.CreateDraft(userId);
    await this.postRepository.Update(draft.id, { content });
  }
}
