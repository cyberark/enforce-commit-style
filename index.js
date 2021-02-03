const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require('child_process');

const DEFAULT_BRANCH = github.context.payload.repository.master_branch;
const GET_SUBJECTS_COMMAND = 
 `git log --no-merges --no-abbrev --format=%s origin/${DEFAULT_BRANCH}..HEAD`;

const getCommitSubjects = async () => {
  const promise = new Promise((resolve, reject) => {
    exec(GET_SUBJECTS_COMMAND, (err, stdout, _) => {
      if (err !== null){
        reject(err);
      }
      resolve(stdout);
    });
  });

  return promise;
}

const runShellCmd = async (command) => {
  return exec(command);
}

const run = async () => {
  const SUBJECT_LENGTH = core.getInput('default-branch');

  getCommitSubjects()
    .then((result) => console.log('resolved:', result))
    .catch((error) => {
      core.setFailed(error);
    });
}

run()
