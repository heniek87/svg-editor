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
document.querySelector("#settingsBtn").addEventListener("click", () => document.querySelector('#settings').removeAttribute("disabled"))
document.querySelector(".settings>#closeBtn").addEventListener("click", () => document.querySelector('#settings').setAttribute("disabled", ""))
document.querySelector("#saveFileBtn").addEventListener("click", saveFile)
document.querySelector("#importImageBtn").addEventListener("click", importImage)
document.querySelector("#viewToggleBtn").addEventListener("click", () => editor.DOMEditor.classList.toggle("view"))
document.querySelector("#showObjectsBtn").addEventListener("click", () => {
  document.querySelector("#objectsArea").classList.toggle("show")
  const { width, height } = editor.svg.getBoundingClientRect()
  editor.rect = document.querySelector('#rect')
  editor.rect.style.width = `${width}px`
  editor.rect.style.height = `${height}px`
})
document.querySelector(".settings #dotSize").addEventListener("input", ({ target: { value } }) => editor.setDotSize(value))
document.querySelector(".settings #borderWidth").addEventListener("input", ({ target: { value } }) => editor.setBorderWidth(value))