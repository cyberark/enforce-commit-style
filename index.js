const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require('child_process');

const MAX_SUBJECT_LENGTH = core.getInput('subject-length');
const DEFAULT_BRANCH = github.context.payload.repository.master_branch;
core.debug(github.context);
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

const Subject = function(subject){
  function verifyLength(){
    if (subject.length > MAX_SUBJECT_LENGTH)
      core.setFailed(`Commit subject "${subject}" is longer than ${MAX_SUBJECT_LENGTH} characters`)
  }

  function verifyCapital(){
    if (subject[0].toUpperCase() !== subject[0])
      core.setFailed(`Commit subject "${subject}" must begin with a capital`);
  }

  return {
    subject: subject,
    verify: function() {
      if (subject === '')
        return;
      verifyLength();
      verifyCapital();
    }
  }
}

const verifyCommitSubjects = async () => {
  getCommitSubjects()
    .then((subjectData) => {
      let subjects = subjectData.split('\n');
      for (let subject of subjects){
        Subject(subject).verify();
      }
    }).catch((error) => {
      core.setFailed(error);
    });
}

verifyCommitSubjects()
