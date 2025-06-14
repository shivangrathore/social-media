tmux new-session -d -s sm
tmux new-window -t sm:0 -n 'Social Media'
tmux send-keys -t sm:0 nvim C-m
tmux new-window -t sm:1 -n 'Server'
tmux send-keys -t sm:1 'pnpm dev' C-m
tmux new-window -t sm:2 -n 'Docker'
tmux send-keys -t sm:2 'docker compose -f db.docker-compose.yml up' C-m
tmux new-window -t sm:3 -n 'Tunnel'
tmux send-keys -t sm:3 'zrok share reserved yepfr3vor0nq' C-m
tmux select-window -t sm:0
tmux attach-session -t sm
