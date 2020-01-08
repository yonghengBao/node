const express = require('express')
const oringinRequest = require('request')
const iconv = require('iconv-lite')
const cheerio = require('cheerio')
const app = express()

app.use('/static',express.static(__dirname + '/public'));
// app.use(express.static('public'))

function requst(url) {
  const option = {
    encoding: null
  }
  return new Promise(function (resove, reject) {
    oringinRequest(url, option, (err, res, body) => {
      if (err) {
        console.log("====",err)
        return reject(err)
      }
      if (body) {
        resove({
          url:url,
          body:res.body
        })
      } else {
        resove()
      }
    })
  })
}

app.get("/list", (req, res) => {
  let promiseList = [], moveList = [];
  let start = req.query.start;
  let end = req.query.end;
  for (let i = start; i < end; i++) {
    const url = `https://www.dy2018.com/i/${i}.html`;
    promiseList.push(requst(url))
  }
  Promise.all(promiseList).then(promiseAll=> {
    promiseAll.forEach(val=>{
      const html = iconv.decode(val.body, 'gb2312')
      const $ = cheerio.load(html)
      let item = {
        name: $(".title_all h1").text(),
        url: val.url
      }
      moveList.push(item)
    })
    res.json(moveList)
  }).catch(err => {
    console.log("出错了", err)
  })
})
app.listen(3000, () => {
  console.log("3000端口启动成功")
})


