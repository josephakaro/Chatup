// .github/scripts/checkCommitLimit.js

const { Octokit } = require('@octokit/rest');
const moment = require('moment');
const fs = require('fs');

const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN,
});

async function run() {
	try {
		const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

		// Read the event payload
		const eventPayload = JSON.parse(
			fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8')
		);

		const pusher = eventPayload.pusher && eventPayload.pusher.name;
		if (!pusher) {
			console.log('No pusher information found.');
			return;
		}

		const since = moment().subtract(24, 'hours').toISOString();

		// Fetch commits by the pusher in the last 24 hours
		const { data: commits } = await octokit.repos.listCommits({
			owner,
			repo,
			author: pusher,
			since,
			per_page: 100,
		});

		if (commits.length > 5) {
			throw new Error(
				`Commit limit exceeded: ${commits.length} commits in the last 24 hours.`
			);
		}

		console.log(
			`Commit count for ${pusher}: ${commits.length} within 24 hours.`
		);
	} catch (error) {
		console.error(error.message);
		process.exit(1); // Fail the action
	}
}

run();
