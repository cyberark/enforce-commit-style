# Enforce Commit Style GitHub Action

This action enforces some basic guidelines on commit subject messages.

It will fail if:
* The commit subject is longer than the `subject-length` variable (default: 55)
* The commit subject does not begin with a capital letter

## Usage

`.github/workflows/commit-style.yml`

```yaml
name: Enforce Commit Style

on:
  pull_request:
    branches: [ master ]
    types: [ opened, synchronize, reopened, edited ]

jobs:
  commit_style:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout the repo
      uses: actions/checkout@v2

    - name: Check commit style
      uses: telday/enforce-commit-style@v1
      with:
        subject-length: 80
```

