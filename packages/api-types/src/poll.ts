export type PollOption = {
  id: number;
  option: string;
  votes: number;
};

export type CreatePollDraftResponse = {
  id: number;
  postType: "poll";
  createdAt: Date;
  userId: number;
  question: string | null;
  options: string[];
};
