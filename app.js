const express = require("express"),
  nunjucks = require("nunjucks"),
  fs = require("fs").promises; //fs모듈, 프로미스 문법 사용을 위해 불러옴
const app = express();

let count = 0; //파일 기본 정렬 방식이 앞에 글자면 가나다 순 숫자면 오름차순. 입력 순 나열을 위해 원래 Date.now()를 빼고 그냥 숫자로 증감 진행
app.set("port", process.env.PORT || 3000);

app.set("view engine", "html");

nunjucks.configure("views", {
  express: app,
  watch: true,
});
app.use(express.static(__dirname + "/public")); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => { //처음 방문하면
  fs.readdir("./todobox") 
    .then((filelist) => { //설정 디렉토리에서 파일 배열 불러옴
      res.render("index", {  //랜더링 시 넌적스 파일에 데이터 바인딩 변수들
        toDoListTitle: "할 일 갯수 : " + filelist.length,
        toDoLists: filelist, 
      });
    })
    .catch((err) => {
      throw err;
    });
}); //index.html의 변수에 값 할당하는 곳
app.post("/add_list", (req, res) => {
  if (req.body.content === "") {
    res.redirect("/"); //입력 안하면 리다이렉트
  } else {
    const newContent = count++ + "_" + req.body.content; //파일명 중복방지를 위한 파일이름 형식은 증감숫자_파일이름 붙이기
    console.log(newContent.substring(newContent.indexOf('_')+1) + " 추가"); // 증감숫자_ 제거하고 보여줌
    fs.writeFile(`./todobox/${newContent}.txt`, req.body.content) //파일생성 후 내용물 작성
    res.redirect("/");
  }
});
app.get("/delete_list/:id", (req, res) => {
  //라우트 매개변수. :id에 해당하는 것은 req.params 객체 안에 있다
  fs.readdir("./todobox")
    .then((filelist) => {
      console.log(filelist.length);
      if(filelist.length<2){
        count=0; //파일앞에 붙는 전역 카운트 초기화
      }
      filelist.forEach((file) => {
        if (file == req.params.id) {
          fs.unlink(`./todobox/${file}`, function (err) {
            if (err) {
              console.log("Error : ", err);
            }
          });
        }
      });
    })
    .catch((err) => {
      throw err;
    });
  res.redirect("/");
});
app.get("/open_update/:id", (req, res) => {
  console.log(req.params.id + " : 현재 req.params.id");
  res.render("update", { prevContent: req.params.id });
});

app.post("/update_list", (req, res) => {
  let prevContent = req.body.prevContent;
  let newContent =  req.body.newContent; 
  console.log(prevContent + " : 현재 req.body.prevContent");
  console.log(newContent + " : 현재 newContent");
  fs.readdir("./todobox")
    .then((filelist) => {
      let index = filelist.indexOf(prevContent); //파일명 배열에서 prevContent의 순서 파악
      console.log(prevContent+" 는"+index+" 번째");
      console.log(`나는 ./todobox/${filelist[index]}를 ./todobox/${filelist[index].substring(0,filelist[index].indexOf('_'))}_${newContent}.txt로 바꿀거여.`);
      fs.rename(`./todobox/${filelist[index]}`, `./todobox/${filelist[index].substring(0,filelist[index].indexOf('_'))}_${newContent}.txt`).then(
      ).catch((err)=>{ throw err;})
      fs.writeFile( `./todobox/${filelist[index].substring(0,filelist[index].indexOf('_'))}_${newContent}.txt`, req.body.newContent)
    })
    .catch((err) => {
      throw err;
    });
  res.redirect("/");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
