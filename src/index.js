// 同步子进程
const execSync = require('child_process').execSync

// 获取当前git分支信息
function getGitVersionInfo() {
  // 当前分支名 git rev-parse --abbrev-ref HEAD 这个命令会在终端输出你当前的版本或标签信息。
  const branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
  // 最后一次提交的commit full hash
  const commitId = execSync('git rev-parse HEAD').toString().trim()
  // 提交人姓名
  const commitAuthor = execSync('git show -s --format=%cn').toString().trim()
  // 提交人邮箱
  const commitEmail = execSync('git show -s --format=%ce').toString().trim()
  // 提交时间
  const commitTime = new Date(new Date(execSync('git show -s --format=%cd').toString())).toLocaleString()
  // 提交描述
  const commitMsg = execSync('git show -s --format=%s').toString().trim()
  // 构建时间
  const buildTime = (new Date()).toLocaleString()
  // 构建人姓名
  const buildUserName = execSync('git config user.name').toString().trim()
  // 构建人邮箱
  const buildUserEmail = execSync('git config user.email').toString().trim()
  return {
    branchName: branchName,
    commitId: commitId,
    commitAuthor: commitAuthor,
    commitEmail: commitEmail,
    commitTime: commitTime,
    commitMsg: commitMsg,
    buildTime: buildTime,
    buildUserName: buildUserName,
    buildUserEmail: buildUserEmail
  }
}

// 创建分支版本类
class WebpackGitVersionPlugin {
  defaultOptions = {
    outputFile: 'version.json', // 版本信息保存文件名称
    isBuildFile: true, // 是否生成版本信息文件
    indexFileName: 'index.html', // 在head中增加打包版本信息文件名称
    replaceMeta: '<meta name="buildversion">', // indexFileName文件中用于替换打包版本信息的占位
    hiddenHead: false, // 是否在head中隐藏版本信息
    hiddenProjectName: false,
    hiddenProjectVersion: false,
    hiddenBranchName: false,
    hiddenCommitId: false,
    hiddenBuildTime: false,
    hiddenCommitAuthor: false,
    hiddenCommitEmail: false,
    hiddenCommitTime: false,
    hiddenCommitMsg: false,
    hiddenBuildUserName: false,
    hiddenBuildUserEmail: false,
  }
  constructor(options) {
    // options 为调用时传的参数
    this.options = {...this.defaultOptions, ...options}
  }
  /**
   * compiler: webpack的实例 所有的内容
   * compilation: 本次打包的内容
   * */ 
  apply(compiler) {
    // 异步方法，生成打包目录时：生成文件
    compiler.hooks.emit.tapAsync('WebpackGitVersionPlugin', (compilation, callback) => {
      try {
        // 添加分支版本信息文件
        let branchVersionObj = getGitVersionInfo()
        if (!this.options.hiddenProjectName || !this.options.hiddenProjectVersion) {
          // 获取package.json文件获取项目工程相关信息
          const packageInfo = require(`${compilation.options.context}/package.json`)
          branchVersionObj = {
            projectName: packageInfo.name,
            projectVersion: packageInfo.version,
            ...branchVersionObj
          }
        }
        
        // 将打包版本信息添加到head中
        if (!this.options.hiddenHead) {
          let pkgInfoArr = []
          let buildInfoArr = []
          if (!this.options.hiddenBuildTime && branchVersionObj.buildTime) {
            pkgInfoArr.push('buildTime:' + branchVersionObj.buildTime)
          }
          if (!this.options.hiddenProjectVersion && branchVersionObj.projectVersion) {
            pkgInfoArr.push('version:' + branchVersionObj.projectVersion)
          }
          if (!this.options.hiddenProjectName && branchVersionObj.projectName) {
            pkgInfoArr.push('project:' + branchVersionObj.projectName)
          }
          if (!this.options.hiddenBranchName && branchVersionObj.branchName) {
            pkgInfoArr.push('branch:' + branchVersionObj.branchName)
          }
          if (!this.options.hiddenCommitId && branchVersionObj.commitId) {
            pkgInfoArr.push('commit:' + branchVersionObj.commitId)
          }

          if (!this.options.hiddenBuildUserName && branchVersionObj.buildUserName) {
            buildInfoArr.push('buildUser:' + branchVersionObj.buildUserName)
          }
          if (!this.options.hiddenBuildUserEmail && branchVersionObj.buildUserEmail) {
            buildInfoArr.push('buildEmail:' + branchVersionObj.buildUserEmail)
          }
          if (!this.options.hiddenCommitTime && branchVersionObj.commitTime) {
            buildInfoArr.push('commitTime:' + branchVersionObj.commitTime)
          }
          if (!this.options.hiddenCommitMsg && branchVersionObj.commitMsg) {
            buildInfoArr.push('commitMsg:' + branchVersionObj.commitMsg)
          }
          if (!this.options.hiddenCommitAuthor && branchVersionObj.commitAuthor) {
            buildInfoArr.push('commitAuthor:' + branchVersionObj.commitAuthor)
          }
          if (!this.options.hiddenCommitEmail && branchVersionObj.commitEmail) {
            buildInfoArr.push('commitEmail:' + branchVersionObj.commitEmail)
          }

          let metaInfo = '<meta name="pkgInfo" content="' + pkgInfoArr.join(' ') + '">' +
            '<meta name="revised" content="' + buildInfoArr.join(' ') + '">'
          let assets = compilation.assets
          let source = assets[this.options.indexFileName].source()
          if (source.indexOf(this.options.replaceMeta) != -1) {
            source = source.replace(this.options.replaceMeta, metaInfo)
          } else {
            source = source.replace('<head>', '<head>' + metaInfo)
          }
          assets[this.options.indexFileName] = {
            source() {
              return source
            },
            size() {
              return source.length
            }
          }
        }
        
        // 生成打包版本信息文件
        if (this.options.isBuildFile) {
          let versionInfoStr = JSON.stringify(branchVersionObj, null, 2)
          compilation.assets[this.options.outputFile] = {
            source: () => versionInfoStr,
            size: () => versionInfoStr.length
          }
        }
      } catch (error) {
        console.log('WebpackGitVersionPlugin error:', error)
      }
      callback()
    })
  }
}

module.exports = WebpackGitVersionPlugin
