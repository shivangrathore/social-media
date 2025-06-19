export function PostComposeView() {
  return (
    <div className="post-compose-view">
      <h1>Compose Post</h1>
      <textarea placeholder="Write your post here..." />
      <button type="button">Save Draft</button>
      <button type="button">Publish Post</button>
    </div>
  );
}
