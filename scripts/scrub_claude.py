#!/usr/bin/env python3
import os
import re
import subprocess
import sys
from pathlib import Path

REPO_DIR = Path(__file__).resolve().parents[1]

def run(cmd, cwd=None, check=True):
    result = subprocess.run(cmd, cwd=cwd, shell=False, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    if check and result.returncode != 0:
        print(result.stdout)
        raise SystemExit(result.returncode)
    return result.stdout.strip()

def main():
    os.chdir(REPO_DIR)
    # Ensure git_filter_repo is available
    try:
        run([sys.executable, "-m", "git_filter_repo", "--help"], check=False)
    except Exception:
        pass

    # Capture existing origin URL (filter-repo removes origin by default)
    origin_url = ""
    try:
        origin_url = run(["git", "remote", "get-url", "origin"], check=False)
    except Exception:
        origin_url = ""

    # Commit-callback: scrub any author/committer containing "claude" and drop Co-authored-by trailer lines
    cb = (
        "import re\n"
        "# scrub author\n"
        "if re.search(br'(?i)claude', commit.author_name) or re.search(br'(?i)claude', commit.author_email):\n"
        "    commit.author_name=b'Framers'\n"
        "    commit.author_email=b'team@frame.dev'\n"
        "# scrub committer\n"
        "if re.search(br'(?i)claude', commit.committer_name) or re.search(br'(?i)claude', commit.committer_email):\n"
        "    commit.committer_name=b'Framers'\n"
        "    commit.committer_email=b'team@frame.dev'\n"
        "# remove Co-authored-by trailers\n"
        "commit.message=re.sub(br'(?im)^Co-authored-by:.*\\r?\\n', b'', commit.message)\n"
    )

    print("Rewriting history to remove 'claude' from authors/committers and Co-authored-by trailers...")
    run([sys.executable, "-m", "git_filter_repo", "--force", "--commit-callback", cb])

    # Restore origin remote
    if origin_url:
        # filter-repo removes origin; re-add or set-url
        remote_list = run(["git", "remote"], check=False)
        if "origin" not in remote_list.split():
            run(["git", "remote", "add", "origin", origin_url])
        else:
            run(["git", "remote", "set-url", "origin", origin_url])

    # Force-push all refs and tags
    print("Pushing rewritten history to origin (force)...")
    run(["git", "push", "origin", "--force", "--all"])
    run(["git", "push", "origin", "--force", "--tags"])
    print("Done.")

if __name__ == "__main__":
    main()


