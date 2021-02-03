const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require('child_process');

const runShellCmd = async (command) => {
  console.log(command);
  return exec(command, (error, stdout, stderr) => {
    console.log("Command Output: ", stdout, stderr, error);
  });
}

const run = async () => {
  const SUBJECT_LENGTH = core.getInput('default-branch');

  try {
    let res = await runShellCmd(`git --no-pager log --no-merges --no-abbrev --format=%H origin/${github.context.payload.repository.master_branch}..HEAD`);
    console.log(res);
    res.on('exit', code => console.log(code));
  } catch (error) {
    core.setFailed(error)
  }
}

run()
