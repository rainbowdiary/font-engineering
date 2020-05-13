
/* 引入json */
import data from "./json/data.json"
console.log(data);  //转化为对象了 {name: "damu", age: "18"}

/* 引入css */
// import "./index.css"

function component() {
  let element = document.createElement("div")
  element.innerHTML = _.join(["hello", "webpack"], "~")
  return element
}

document.body.appendChild(component())