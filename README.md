# 3e3dev Sites

Live: https://3e3dev.github.io/sites/

A static HTML/CSS portfolio with no client JavaScript or runtime dependencies.

## Daily discovery

`.github/workflows/refresh-sites.yml` scans public repositories on 3e3dev daily at 09:23 UTC (03:23 MDT / 02:23 MST). GitHub schedules may run late. It also supports **Run workflow** in Actions and runs when its source changes.

The scanner paginates all public repositories, selects those with GitHub Pages enabled, excludes this portfolio, and follows each published URL to support custom-domain redirects. Private repositories are excluded. An API error or unavailable site aborts the scan and preserves the previous deployment.

The original projects retain their curated cards and attribution. New projects automatically receive a matching typographic card using the repository name and description. Removing Pages removes its card on the next successful scan.

Each successful scan saves `data/projects.json` with its timestamp, updates the static output, and publishes through GitHub Actions. The daily scan record provides repository activity to prevent GitHub's 60-day inactivity disabling of scheduled workflows. No personal access token or additional secret is needed; the workflow uses GitHub's repository-scoped token for commits and Pages deployment.

## Editing and testing

Edit `src/template.html` for the page shell, `src/style.css` for styling, or `data/curated.json` for custom project cards. `src/index.html` and `docs/` are generated.

- `node scripts/discover.mjs` refreshes the project list.
- `node scripts/build.mjs` rebuilds the page from the saved list.
- `node --test scripts/portfolio.test.mjs` tests pagination, filtering, failure handling, and HTML escaping.
- `node scripts/serve.mjs` serves the local preview.

Images remain on the original project sites. Credits and license links are preserved in the portfolio.
