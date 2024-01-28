# webpack-git-version-plugin

This plugin will generate a `version.json` file and add build information that contains build time、project name, version、branch、commit id、commit msg and so on into `index.html` head meta when webpack the current repository on a local git repository.
 
## Usage

install it as a local development dependency:

  ```bash
  npm install @east0422/webpack-git-version-plugin -D
  ```

Then, simply configure it as a plugin in the webpack config `vue.config.js`:

  ```js
  const WebpackGitVersionPlugin = require('@east0422/webpack-git-version-plugin');

  module.exports = {
    ...
    configureWebpack: config => {
      config.plugins.push(new WebpackGitVersionPlugin())
    }
    ...
  }
  ```

This will generate a file `version.json`:

  ```
  {
    "projectName": "xxx",
    "projectVersion": "xxx",
    "branchName": "xxx",
    "commitId": "xxx",
    "commitAuthor": "xxx",
    "commitEmail": "xxx",
    "commitTime": "xxx",
    "commitMsg": "xxx",
    "buildTime": "xxx",
    "buildUserName": "xxx",
    "buildUserEmail": "xxx"
  }
  ```

and add meta into head `index.html`

  ```
  <head>
  ...
  <meta name="pkgInfo" content="buildTime:xxx version:xxx project:xxx branch:xxx commit:xxx">
  <meta name="revised" content="buildUser:xxx buildEmail:xxx commitTime:xxx commitMsg:xxx commitAuthor:xxx commitEmail:xxx">
  ...
  </head>
  ```

## Configuration

The plugin requires no configuration by default, but it is possible to configure it to support custom build info.

### `isBuildFile: true`
whether or not generate a `version.json` file in output directory, default true.

### `outputFile: version.json`
generate file name, default `version.json`

### `indexFileName: index.html`
add meta info into file name, default `index.html`

### `replaceMeta: <meta name="buildversion">`
the placeholder for replace real build info in indexFileName, default `<meta name="buildversion">`

### `hiddenHead: false`
whether or not hidden build info in head, default false.

### `hiddenProjectName: false`
whether or not hidden project name in head, default false.

### `hiddenProjectVersion: false`
whether or not hidden project version in head, default false.

### `hiddenBranchName: false`
whether or not hidden current branch name in head, default false.

### `hiddenCommitId: false`
whether or not hidden current commit id in head, default false.

### `hiddenBuildTime: false`
whether or not hidden current build time in head, default false.

### `hiddenCommitAuthor: false`
whether or not hidden current commit author in head, default false.

### `hiddenCommitEmail: false`
whether or not hidden current commit email in head, default false.

### `hiddenCommitTime: false`
whether or not hidden current commit time in head, default false.

### `hiddenCommitMsg: false`
whether or not hidden current commit message in head, default false.

### `hiddenBuildUserName: false`
whether or not hidden current commit user in head, default false.

### `hiddenBuildUserEmail: false`
whether or not hidden build user email  in head, default false.