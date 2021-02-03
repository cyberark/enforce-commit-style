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

const verifySubject = async (subject) => {
  const MAX_SUBJECT_LENGTH = core.getInput('default-branch');
  if (subject.length > MAX_SUBJECT_LENGTH)
    core.setFailed(`Subject ${subject} is longer than ${MAX_SUBJECT_LENGHT} characters`)
  else
    core.debug(`Subject ${subject} is good!`);
}

const verifyCommitSubjects = async () => {
  getCommitSubjects()
    .then((subjectData) => {
      let subjects = subjectData.split('\n');
      for (let subject of subjects){
        verifySubject(subject).catch(error => core.setFailed(error));;
      }
    }).catch((error) => {
      core.setFailed(error);
    });
}

verifyCommitSubjects()
