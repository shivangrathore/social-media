import { AttachmentRepository } from "./attachment.repository";
import { AuthRepository } from "./auth.repository";

export const authRepository = new AuthRepository();
export const attachmentRepository = new AttachmentRepository();
