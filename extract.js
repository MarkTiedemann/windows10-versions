let fs = require('fs')
let vm = require('vm')
let { JSDOM } = require('jsdom')
let id = process.argv[2]
let html = fs.readFileSync(`${id}.html`)
let document = new JSDOM(html).window.document.documentElement
let scripts = document.getElementsByTagName('script')
let lastScript = scripts.item(scripts.length - 1)
let script = new vm.Script(lastScript.innerHTML)
let sandbox = {}
script.runInNewContext(sandbox)
let metadata = sandbox.microsoft.support.prefetchedArticle[`en-us/${id}`]
let json = JSON.stringify(metadata, null, 2)
fs.writeFileSync(`${id}.tmp`, json)
