check-git-status:
	@if [ -n "$$(git status --porcelain)" ]; then \
		echo "Error: There are uncommitted changes in the git repository."; \
		exit 1; \
	fi
	@if [ -n "$$(git log --branches --not --remotes)" ]; then \
		echo "Error: There are unpushed changes in the git repository."; \
		exit 1; \
	fi

docker: check-git-status
	@docker build -t localhost/immi/immiapp .
