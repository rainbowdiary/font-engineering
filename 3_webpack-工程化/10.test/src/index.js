function component() {
  let element = document.createElement('div')
  element.innerHTML = _.join(['hello', 'webpack'], "~")
  return element;
}
document.getElementById("root").appendChild(component());
