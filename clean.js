let fs = require('fs')
let id = process.argv[2]
let tmp = fs.readFileSync(`${id}.tmp`)
let metadata = JSON.parse(tmp.toString())
let releases = []
for (let minor of metadata.releaseNoteRelationship.minorVersions) {
  let versions = minor.releaseVersion.match(/\d+.\d+/g)
  for (let version of versions) {
    let [build, patch] = version.split('.').map(x => parseInt(x))
    releases.unshift({ version: `10.0.${build}.${patch}`, version_kb: minor.id })
  }
}
let json = JSON.stringify(releases, null, 2)
fs.writeFileSync(`${id}.json`, json)
