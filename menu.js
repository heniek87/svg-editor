

let RawSVG = ""
let FileName = ""
const unblockBtns = () => {
  document.querySelector("#saveFileBtn").removeAttribute("disabled")
  document.querySelector("#importImage").removeAttribute("disabled")

}
const readFile = ({ target: { files: [file] } }) => {
  const { name } = file
  const reader = new FileReader()
  reader.onloadend = ({ target }) => {
    RawSVG = target.result
    FileName = name
    window.editor = new Editor()
    unblockBtns()
  }
  reader.readAsText(file)

}
const readImageFile = ({ target: { files: [file] } }) => {
  const { name, type } = file
  const reader = new FileReader()
  reader.onloadend = ({ target }) => {
    // let u = URL.createObjectURL(new Blob([RawSVG], { type }))

    window.editor.setTmpImgSrc(target.result)
  }
  reader.readAsDataURL(file)

}
const openFile = () => {

  const fileHelper = document.querySelector('#fileOpenHelper')
  fileHelper.click()
  fileHelper.addEventListener('change', readFile)
}
const saveFile = () => {
  let u = URL.createObjectURL(new Blob([RawSVG], { type: "image/svg+xml" }))
  const helper = document.querySelector("#fileSaveHelper")
  helper.download = FileName
  helper.href = u
  helper.click()
}

const importImage = () => {
  const imageFileHelper = document.querySelector('#imageFileHelper')
  imageFileHelper.click()
  imageFileHelper.addEventListener('change', readImageFile)
}

// events

document.querySelector("#openFileBtn").addEventListener("click", openFile)
document.querySelector("#saveFileBtn").addEventListener("click", saveFile)
document.querySelector("#importImage").addEventListener("click", importImage)