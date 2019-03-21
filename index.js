let fs = require('fs')
let { JSDOM } = require('jsdom')

let html = fs.readFileSync('en-US.html')
let dom = new JSDOM(html)
let document = dom.window.document

let releases = Array.from(document.querySelectorAll('h4'))
  .map(h4 => /Version (\d+)/.exec(h4.innerHTML).pop())

let versions = [ ['release', 'version', 'date', 'kb'] ]
let tables = Array.from(document.getElementsByTagName('table'))
tables.shift()
for (let i = 0; i < tables.length; i++) {
  let release = releases[i]
  for (let row of tables[i].getElementsByTagName('tr')) {
    /*
      <tr>
        <td>17763.379</td>
        <td>3/12/2019</td>
        <td>Semi-Annual Channel (Targeted) <span> &bull; </span> LTSC</td>
        <td><a href="https://support.microsoft.com/?kbid=4489899" target="_top">KB 4489899</a></td>
      </tr>
    */
    let tds = row.getElementsByTagName('td')
    if (tds.length === 0) continue
    let version = '10.0.' + tds.item(0).textContent
    let date = tds.item(1).textContent
    let kb = /KB (\d+)/.exec(tds.item(3).innerHTML)
    versions.push([release, version, date, kb ? kb.pop() : ''])
  }
}

let tsv = versions.map(x => x.join('\t')).join('\n')
fs.writeFileSync('versions.tsv', tsv)

let csv = versions.map(x => x.join(',')).join('\n')
fs.writeFileSync('versions.csv', csv)

let json = versions.splice(1, versions.length)
  .map(([release, version, date, kb]) => ({ release, version, date, kb }))
let prettyJson = JSON.stringify(json, null, 2)
  .replace(/",\n\s+"/g, `", "`)
  .replace(/{\n\s+"/g, `{ "`)
  .replace(/"\n\s+}/g, `" }`)
fs.writeFileSync('versions.json', prettyJson)
