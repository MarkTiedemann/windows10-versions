let fs = require('fs')
let kbs = require('./release_kbs.json')
let table = []
for (let [release_kb, release] of Object.entries(kbs)) {
  for (let { version, version_kb } of require(`./${release_kb}.json`)) {
    table.unshift([release, release_kb, version, version_kb])
  }
}
table.unshift(['release', 'release_kb', 'version', 'version_kb'])
let tsv = table.map(x => x.join('\t')).join('\n')
fs.writeFileSync('versions.tsv', tsv)
