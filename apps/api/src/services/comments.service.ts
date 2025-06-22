import { CommentsRepository } from "@/repositories/comments.repository";

export class CommentsService {
  constructor(private commentsRepository: CommentsRepository) {}

  async addComment(userId: number, postId: number, content: string) {
    if (!content.trim()) {
      throw new Error("Content cannot be empty");
    }
    return await this.commentsRepository.add(userId, postId, content);
  }

  async removeComment(id: number) {
    return await this.commentsRepository.remove(id);
  }
}
