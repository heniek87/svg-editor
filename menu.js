import { importImage, openFile, saveFile } from "./Files.js"


window.RawSVG = ""
window.FileName = ""
window.editor = null
window.unblockBtns = () => {
  document.querySelector("#saveFileBtn").removeAttribute("disabled")
  document.querySelector("#importImageBtn").removeAttribute("disabled")
  document.querySelector("#viewToggleBtn").removeAttribute("disabled")
  document.querySelector("#showObjectsBtn").removeAttribute("disabled")
  document.querySelector("#zoomBox").removeAttribute("disabled")

}


// events

document.querySelector("#openFileBtn").addEventListener("click", openFile)
document.querySelector("#saveFileBtn").addEventListener("click", saveFile)
document.querySelector("#importImageBtn").addEventListener("click", importImage)
document.querySelector("#viewToggleBtn").addEventListener("click", () => editor.DOMEditor.classList.toggle("view"))
document.querySelector("#showObjectsBtn").addEventListener("click", () => document.querySelector("#objectsArea").classList.toggle("show"))