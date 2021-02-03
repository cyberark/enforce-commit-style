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

class Subject{
  static MAX_SUBJECT_LENGTH = core.getInput('subject-length');
  constructor(subject){
    this.subject = subject;
  }

  _verifyLength(){
    if (this.subject.length > this.MAX_SUBJECT_LENGTH)
      core.setFailed(`Subject "${this.subject}" is longer than ${this.MAX_SUBJECT_LENGHT} characters`)
  }

  _verifyCapital(){
    if (this.subject[0].toUpper() !== this.subject[0])
      core.setFailed(`Subject "${this.subject}" must begin with a capital`);
  }

  verify(){
    if (this.subject === '')
      return;
    this._verifyLength();
    this._verifyCapital();
    core.debug(`Verifying subject line ${this.subject}`);
  }
}

const verifyCommitSubjects = async () => {
  getCommitSubjects()
    .then((subjectData) => {
      let subjects = subjectData.split('\n');
      for (let subject of subjects){
        new Subject(subject).verify();
      }
    }).catch((error) => {
      core.setFailed(error);
    });
}

verifyCommitSubjects()
