import { LikesRepository } from "@/repositories/likes.repository";

export class LikeService {
  constructor(private likesRepository: LikesRepository) {}

  async addPostLike(targetId: number, userId: number): Promise<void> {
    await this.likesRepository.addLike(targetId, userId, "post");
  }

  async removePostLike(targetId: number, userId: number): Promise<void> {
    await this.likesRepository.removeLike(targetId, userId, "post");
  }

  async removeCommentLike(targetId: number, userId: number): Promise<void> {
    await this.likesRepository.removeLike(targetId, userId, "comment");
  }

  async addCommentLike(targetId: number, userId: number): Promise<void> {
    await this.likesRepository.addLike(targetId, userId, "comment");
  }
}
