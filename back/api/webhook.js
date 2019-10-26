const Router = require('koa-router');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const router = new Router();
const sandbox = 'sandbox';
const deployKeyDir = '/home/zompin/projects/ci/sandbox/deploy';
const mock = {
  ref: 'refs/heads/master',
  before: '445ef7468811c48f2e6091aee492d1b460315291',
  after: '4767a45f1d45cf9b4cd519505d7a29a117525255',
  repository: {
    id: 173479304,
    node_id: 'MDEwOlJlcG9zaXRvcnkxNzM0NzkzMDQ=',
    name: 'test',
    full_name: 'zompin/test',
    private: false,
    owner: {
      name: 'zompin',
      email: 'zompin@ya.ru',
      login: 'zompin',
      id: 2889906,
      node_id: 'MDQ6VXNlcjI4ODk5MDY=',
      avatar_url: 'https://avatars2.githubusercontent.com/u/2889906?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/zompin',
      html_url: 'https://github.com/zompin',
      followers_url: 'https://api.github.com/users/zompin/followers',
      following_url: 'https://api.github.com/users/zompin/following{/other_user}',
      gists_url: 'https://api.github.com/users/zompin/gists{/gist_id}',
      starred_url: 'https://api.github.com/users/zompin/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/zompin/subscriptions',
      organizations_url: 'https://api.github.com/users/zompin/orgs',
      repos_url: 'https://api.github.com/users/zompin/repos',
      events_url: 'https://api.github.com/users/zompin/events{/privacy}',
      received_events_url: 'https://api.github.com/users/zompin/received_events',
      type: 'User',
      site_admin: false,
    },
    html_url: 'https://github.com/zompin/test',
    description: null,
    fork: false,
    url: 'https://github.com/zompin/test',
    forks_url: 'https://api.github.com/repos/zompin/test/forks',
    keys_url: 'https://api.github.com/repos/zompin/test/keys{/key_id}',
    collaborators_url: 'https://api.github.com/repos/zompin/test/collaborators{/collaborator}',
    teams_url: 'https://api.github.com/repos/zompin/test/teams',
    hooks_url: 'https://api.github.com/repos/zompin/test/hooks',
    issue_events_url: 'https://api.github.com/repos/zompin/test/issues/events{/number}',
    events_url: 'https://api.github.com/repos/zompin/test/events',
    assignees_url: 'https://api.github.com/repos/zompin/test/assignees{/user}',
    branches_url: 'https://api.github.com/repos/zompin/test/branches{/branch}',
    tags_url: 'https://api.github.com/repos/zompin/test/tags',
    blobs_url: 'https://api.github.com/repos/zompin/test/git/blobs{/sha}',
    git_tags_url: 'https://api.github.com/repos/zompin/test/git/tags{/sha}',
    git_refs_url: 'https://api.github.com/repos/zompin/test/git/refs{/sha}',
    trees_url: 'https://api.github.com/repos/zompin/test/git/trees{/sha}',
    statuses_url: 'https://api.github.com/repos/zompin/test/statuses/{sha}',
    languages_url: 'https://api.github.com/repos/zompin/test/languages',
    stargazers_url: 'https://api.github.com/repos/zompin/test/stargazers',
    contributors_url: 'https://api.github.com/repos/zompin/test/contributors',
    subscribers_url: 'https://api.github.com/repos/zompin/test/subscribers',
    subscription_url: 'https://api.github.com/repos/zompin/test/subscription',
    commits_url: 'https://api.github.com/repos/zompin/test/commits{/sha}',
    git_commits_url: 'https://api.github.com/repos/zompin/test/git/commits{/sha}',
    comments_url: 'https://api.github.com/repos/zompin/test/comments{/number}',
    issue_comment_url: 'https://api.github.com/repos/zompin/test/issues/comments{/number}',
    contents_url: 'https://api.github.com/repos/zompin/test/contents/{+path}',
    compare_url: 'https://api.github.com/repos/zompin/test/compare/{base}...{head}',
    merges_url: 'https://api.github.com/repos/zompin/test/merges',
    archive_url: 'https://api.github.com/repos/zompin/test/{archive_format}{/ref}',
    downloads_url: 'https://api.github.com/repos/zompin/test/downloads',
    issues_url: 'https://api.github.com/repos/zompin/test/issues{/number}',
    pulls_url: 'https://api.github.com/repos/zompin/test/pulls{/number}',
    milestones_url: 'https://api.github.com/repos/zompin/test/milestones{/number}',
    notifications_url: 'https://api.github.com/repos/zompin/test/notifications{?since,all,participating}',
    labels_url: 'https://api.github.com/repos/zompin/test/labels{/name}',
    releases_url: 'https://api.github.com/repos/zompin/test/releases{/id}',
    deployments_url: 'https://api.github.com/repos/zompin/test/deployments',
    created_at: 1551548546,
    updated_at: '2019-03-10T09:01:08Z',
    pushed_at: 1571947713,
    git_url: 'git://github.com/zompin/test.git',
    ssh_url: 'git@github.com:zompin/test.git',
    clone_url: 'https://github.com/zompin/test.git',
    svn_url: 'https://github.com/zompin/test',
    homepage: null,
    size: 70,
    stargazers_count: 0,
    watchers_count: 0,
    language: null,
    has_issues: true,
    has_projects: true,
    has_downloads: true,
    has_wiki: true,
    has_pages: false,
    forks_count: 0,
    mirror_url: null,
    archived: false,
    disabled: false,
    open_issues_count: 0,
    license: null,
    forks: 0,
    open_issues: 0,
    watchers: 0,
    default_branch: 'master',
    stargazers: 0,
    master_branch: 'master',
  },
  pusher: {
    name: 'zompin',
    email: 'zompin@ya.ru',
  },
  sender: {
    login: 'zompin',
    id: 2889906,
    node_id: 'MDQ6VXNlcjI4ODk5MDY=',
    avatar_url: 'https://avatars2.githubusercontent.com/u/2889906?v=4',
    gravatar_id: '',
    url: 'https://api.github.com/users/zompin',
    html_url: 'https://github.com/zompin',
    followers_url: 'https://api.github.com/users/zompin/followers',
    following_url: 'https://api.github.com/users/zompin/following{/other_user}',
    gists_url: 'https://api.github.com/users/zompin/gists{/gist_id}',
    starred_url: 'https://api.github.com/users/zompin/starred{/owner}{/repo}',
    subscriptions_url: 'https://api.github.com/users/zompin/subscriptions',
    organizations_url: 'https://api.github.com/users/zompin/orgs',
    repos_url: 'https://api.github.com/users/zompin/repos',
    events_url: 'https://api.github.com/users/zompin/events{/privacy}',
    received_events_url: 'https://api.github.com/users/zompin/received_events',
    type: 'User',
    site_admin: false,
  },
  created: false,
  deleted: false,
  forced: false,
  base_ref: null,
  compare: 'https://github.com/zompin/test/compare/445ef7468811...4767a45f1d45',
  commits: [
    {
      id: '4767a45f1d45cf9b4cd519505d7a29a117525255',
      tree_id: '4c54f85bdf582e9e7f36e8544db89eb1f3908f73',
      distinct: true,
      message: 'hh',
      timestamp: '2019-10-24T23:08:26+03:00',
      url: 'https://github.com/zompin/test/commit/4767a45f1d45cf9b4cd519505d7a29a117525255',
      author: {
        name: 'Ilya Altukhov',
        email: 'zompin@ya.ru',
        username: 'zompin',
      },
      committer: {
        name: 'Ilya Altukhov',
        email: 'zompin@ya.ru',
        username: 'zompin',
      },
      added: [
        'hh',
      ],
      removed: [

      ],
      modified: [

      ],
    },
  ],
  head_commit: {
    id: '4767a45f1d45cf9b4cd519505d7a29a117525255',
    tree_id: '4c54f85bdf582e9e7f36e8544db89eb1f3908f73',
    distinct: true,
    message: 'hh',
    timestamp: '2019-10-24T23:08:26+03:00',
    url: 'https://github.com/zompin/test/commit/4767a45f1d45cf9b4cd519505d7a29a117525255',
    author: {
      name: 'Ilya Altukhov',
      email: 'zompin@ya.ru',
      username: 'zompin',
    },
    committer: {
      name: 'Ilya Altukhov',
      email: 'zompin@ya.ru',
      username: 'zompin',
    },
    added: [
      'hh',
    ],
    removed: [

    ],
    modified: [

    ],
  },
};

function getRep(payload) {
  const ref = payload.ref.split('/');
  const { name } = payload.repository;
  const branch = ref.pop();

  return {
    name,
    branch,
  };
}

async function hook(payload) {
  const workDir = path.join(process.cwd(), sandbox);
  const { name, branch } = getRep(payload);
  const thread = path.join(workDir, branch, name);

  if (!fs.existsSync(workDir)) {
    fs.mkdirSync(workDir, { recursive: true });
  }

  // TODO проверять deployKey
  if (!fs.existsSync(thread)) {
    await execAsync(`ssh-agent sh -c '${deployKeyDir}; git clone ${payload.repository.ssh_url} ${thread}'`);
    await execAsync(`git --work-tree=${thread} --git-dir=${path.join(thread, '.git')} checkout ${branch}`);
  } else {
    await execAsync(`git --work-tree=${thread} --git-dir=${path.join(thread, '.git')} reset --hard`);
    await execAsync(`git --work-tree=${thread} --git-dir=${path.join(thread, '.git')} checkout ${branch}`);
    await execAsync(`ssh-agent sh -c '${deployKeyDir}; git --work-tree=${thread} --git-dir=${path.join(thread, '.git')} pull'`);
  }
}

router.post('/api/v1/webhook', async (ctx) => {
  ctx.body = 'ok';
  hook(JSON.parse(ctx.request.body.payload));
});

router.get('/api/v1/webhook', async (ctx) => {
  ctx.body = 'ok';
  hook(mock);
});

module.exports = router.routes();
