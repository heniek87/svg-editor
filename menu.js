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
  document.querySelector("#gridOn").removeAttribute("disabled")

}


// events

document.querySelector("#openFileBtn").addEventListener("click", openFile)
document.querySelector("#settingsBtn").addEventListener("click", () => document.querySelector('#settings').removeAttribute("disabled"))
document.querySelector("#helpBtn").addEventListener("click", () => document.querySelector('#helpBox').removeAttribute("disabled"))
document.querySelector(".settings>#closeBtn").addEventListener("click", () => document.querySelector('#settings').setAttribute("disabled", ""))
document.querySelector(".helpBox>#closeHelpBox").addEventListener("click", () => document.querySelector('#helpBox').setAttribute("disabled", ""))
document.querySelector("#saveFileBtn").addEventListener("click", saveFile)
document.querySelector("#importImageBtn").addEventListener("click", importImage)
document.querySelector("#viewToggleBtn").addEventListener("click", () => editor.DOMEditor.classList.toggle("view"))
document.querySelector("#gridOn").addEventListener("click", () => editor.DOMEditor.classList.toggle("grid"))
document.querySelector("#showObjectsBtn").addEventListener("click", () => {
  document.querySelector("#objectsArea").classList.toggle("show")
  const { width, height } = editor.svg.getBoundingClientRect()
  editor.rect = document.querySelector('#rect')
  editor.rect.style.width = `${width}px`
  editor.rect.style.height = `${height}px`
})
document.querySelector(".settings #dotSize").addEventListener("input", ({ target: { value } }) => {
  if (editor) editor.setDotSize(value)
})
document.querySelector(".settings #gridSize").addEventListener("input", ({ target: { value } }) => {
  if (editor) editor.setGridSize(value)
})
document.querySelector(".settings #borderWidth").addEventListener("input", ({ target: { value } }) => {
  if (editor) editor.setBorderWidth(value)
})
document.addEventListener("click", ({ target }) => {
  if (target.id != "idChanger" && target.parentElement.id != "idChanger") {
    document.querySelector("#idChanger").setAttribute("disabled", "")
  }
})
document.addEventListener("keydown", (evt) => {
  const { ctrlKey, key } = evt
  if (key == "Escape") {
    document.querySelector("#idChanger").setAttribute("disabled", "")
    document.querySelector("#settings").setAttribute("disabled", "")
    document.querySelector("#helpBox").setAttribute("disabled", "")
  }
  if (ctrlKey) {
    evt.preventDefault()
    switch (key) {
      case "s":
        document.querySelector("#saveFileBtn").click()
        break;
      case "o":
        document.querySelector("#openFileBtn").click()
        break;
      case "+":
        document.querySelector("#zoomIn").click()
        break;
      case "-":
        document.querySelector("#zoomOut").click()
        break;
      case "d":
        if (!isNaN(window.editor.selectedPolygon)) document.querySelector("#clonePolygon").click()
        break;

    }
  }
})