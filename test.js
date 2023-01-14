import Editor from "./Editor.js"
const data = {
  "testSVG": `<?xml version="1.0" encoding="utf-8"?>
  <svg version="1.1" id="Warstwa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
    y="0px" viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">

    <image style="overflow:visible;enable-background:new    ;" width="100" height="100"
      xlink:href="https://tnfe.pl/testSvg/house-isolated-field.jpg">
    </image>
    <g class="locals">

	    <polygon id="p1" points="10.4,30.8 30.3,50.5 10.1,22.2 " />

    </g>


  </svg>`,
  "testName": 'budynek.svg',

}
window.RawSVG = data.testSVG
window.FileName = data.testName
document.querySelector('#filename').innerHTML = window.FileName
window.editor = new Editor(data.testSVG)
window.unblockBtns()
// document.querySelector("#objectsArea").classList.add("show")
// document.querySelector('#helpBox').removeAttribute("disabled")