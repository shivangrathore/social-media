import { ViewRepository } from "@/repositories/view.repository";

export class ViewService {
  constructor(private viewRepository: ViewRepository) {
    this.viewRepository = viewRepository;
  }

  async logPostView(postId: number, userId: number) {
    await this.viewRepository.logPostView(postId, userId);
  }
}
