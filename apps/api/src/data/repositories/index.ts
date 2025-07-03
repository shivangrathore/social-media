import { AttachmentRepository } from "./attachment.repository";
import { AuthRepository } from "./auth.repository";
import { CommentRepository } from "./comment.repository";
import { PollRepository } from "./poll.repository";
import { PostRepository } from "./post.repository";
import { UserRepository } from "./user.repository";

export const authRepository = new AuthRepository();
export const attachmentRepository = new AttachmentRepository();
export const postRepository = new PostRepository();
export const pollRepository = new PollRepository();
export const commentRepository = new CommentRepository();
export const userRepository = new UserRepository();
