tmux new-session -d -s social-media
tmux new-window -t social-media:0 -n 'Social Media'
tmux send-keys -t social-media:0 nvim C-m
tmux new-window -t social-media:1 -n 'Server'
tmux send-keys -t social-media:1 'pnpm dev' C-m
tmux new-window -t social-media:2 -n 'Docker'
tmux send-keys -t social-media:2 'docker compose -f db.docker-compose.yml up' C-m
tmux select-window -t social-media:0
tmux attach-session -t social-media
