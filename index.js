var http = require('http')
var fs = require('fs')
var url = require('url')

var port = process.env.PORT||1234

var server = http.createServer(function(request,response){
    var temp = url.parse(request.url,true)
    var path = temp.pathname
    var query = temp.query
    var method = request.method


    if(path === '/'){
        var string = fs.readFileSync('./index.html','utf8')
        var amount = fs.readFileSync('./db','utf8')  //db的值是100   文件的类型是string
        string = string.replace('&&&amount&&&',amount)
        response.setHeader('Content-Type','text/html;charset=utf-8')
        response.write(string)
        response.end()
    }
    else if (path === './style.css') {
        var string = fs.readFileSync('./style.css','utf8')
        response.setHeader('Content-Type','text/css')
        response.write(string)
        response.end()
    }
    else if(path === './main.js')
    {
        var string = fs.readFileSync('./main.js','utf8')
        response.setHeader('Content-Type','application/javascript')
        response.write(string)
        response.end()
    }
    else if (path === '/pay'){
        let amount = fs.readFileSync('./db', 'utf8')
        amount = amount - 1
        fs.writeFileSync('./db', amount)
        response.setHeader('Content-Type', 'application/javascript')
        response.statusCode = 200
        //response.write(`amount.innerText =  amnount.innerText - 1`)
        //说明happy.com的程序员要对ebony.com的页面细节很了解
        //耦合  关系太紧密   解耦 调用函数（一般）
        //JSON + padding = JSONP  STRING + padding = STRINGP
        response.write(`
        ${query.callback}.call(undefined,{
        "success": true,
        "left": ${newAmount}
        })
        `)
        response.end()
    }
    else {
        response.statusCode = 404
        response.setHeader('Content-Type','text/html;charset=utf-8')
        response.write('找不到对应的路径，需要自行修改index.js')
        response.end()
    }
})


server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)
