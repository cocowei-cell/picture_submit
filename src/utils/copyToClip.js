/**
 * @description: 复制到剪切板
 * @param {*} content
 * @return {*}
 */
function CopyToBord(content) {
  let copyDOM = document.createElement("div");
  copyDOM.innerText = content;
  copyDOM.style.position = "absolote";
  copyDOM.style.top = "0px";
  copyDOM.style.right = "-99999999px";
  document.body.appendChild(copyDOM);
  let range = document.createRange();
  range.selectNode(copyDOM);
  let selection = getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  let success = document.execCommand("copy");
  copyDOM.parentNode.removeChild(copyDOM);
  return success;
}

export default CopyToBord;
