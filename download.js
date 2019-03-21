let fs = require('fs')
let https = require('https')
let id = process.argv[2]
let base = 'https://support.microsoft.com'
let url = `${base}/en-us/help/${id}`
https.get(url, res => {
  https.get(base + res.headers.location, res => {
    let buf = []
    res.on('data', chunk => buf.push(chunk))
    res.on('end', () => {
      let html = Buffer.concat(buf).toString()
      fs.writeFileSync(`${id}.html`, html)
    })
  })
})
