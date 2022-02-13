const express = require('express')
, path = require('path')
, nunjucks = require('nunjucks');
const app = express();
app.set('port', process.env.PORT || 3000);

const toDoLists = ["밥먹기"]

app.set('view engine' ,'html');

nunjucks.configure('views', {
  express: app,
  watch: true,
});

app.use(express.static(__dirname + '/public'));
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
  res.render('index', {toDoListTitle: '할 일 갯수 : ' + toDoLists.length, toDoLists:toDoLists});
});

app.post('/add_list', (req, res)=>{
  const newContent = req.body.content;
  console.log(newContent+' 추가');
  toDoLists.push(newContent);
  res.redirect('/');
})

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});