const express = require('express')
, nunjucks = require('nunjucks');
const app = express();
app.set('port', process.env.PORT || 3000);

let toDoLists = []



app.set('view engine' ,'html');

nunjucks.configure('views', {
  express: app,
  watch: true,
});

app.use(express.static(__dirname + '/public')); //정적파일 담아두는 곳
//body-parser 미들웨어.
//요청의 본문에 있는 데이터를 해석해서 req.body 객체로 만들어준다.
//원래는 따로 설치했으나 현재는 express에 내장됨
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
  res.render('index', {toDoListTitle: '할 일 갯수 : ' + toDoLists.length, toDoLists:toDoLists});
});

app.post('/add_list', (req, res)=>{
  const newContent = req.body.content+'_'+Date.now();
  console.log(newContent.substring(0,newContent.indexOf('_'))+' 추가');
  toDoLists.push(newContent);
  res.redirect('/');
})

app.get('/delete_list/:id', (req, res)=>{
  const deleteContent = req.params.id;
  console.log(deleteContent.substring(0,deleteContent.indexOf('_'))+' 삭제');
  toDoLists=toDoLists.filter((item) => item!=deleteContent);
  res.redirect('/');
})

app.get('/open_update/:id', (req, res)=>{
  console.log(req.params.id);
  res.render('update', {prevContent: req.params.id})
})

app.post('/update_list',(req,res)=>{
  let prevContent= req.body.prevContent;
  let newContent= req.body.newContent+'_'+Date.now();
  let index = toDoLists.indexOf(prevContent);
  toDoLists.splice(index, 1, newContent);
  console.log(prevContent+'을(를)'+newContent+'으로 수정');
  res.redirect('/');
})

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});