import { useMutation } from "@tanstack/react-query";
import { logView } from "../api";

export function useLogView(postId: number) {
  const { mutateAsync, isSuccess } = useMutation({
    mutationKey: ["logView", postId],
    mutationFn: () => logView(postId),
  });

  return { logView: mutateAsync, isLogged: isSuccess };
}
