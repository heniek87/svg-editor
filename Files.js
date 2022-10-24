import Editor from "./Editor.js"
export const readFile = ({ target: { files: [file] } }) => {
  const { name } = file
  const reader = new FileReader()
  reader.onloadend = ({ target }) => {
    window.RawSVG = target.result
    window.FileName = name
    document.querySelector('#filename').innerHTML = name
    if (window.editor != null) {
      window.editor.svg.remove()
    }
    window.editor = new Editor(target.result)
    unblockBtns()
  }
  reader.readAsText(file)

}
export const readImageFile = ({ target: { files: [file] } }) => {
  const { name, type } = file
  const reader = new FileReader()
  reader.onloadend = ({ target }) => {
    // let u = URL.createObjectURL(new Blob([RawSVG], { type }))

    window.editor.setTmpImgSrc(target.result)
  }
  reader.readAsDataURL(file)

}
export const openFile = () => {

  const fileHelper = document.querySelector('#fileOpenHelper')
  fileHelper.click()
  fileHelper.addEventListener('change', readFile)
}
export const saveFile = () => {
  window.editor.deselectPolygon()
  RawSVG = window.editor.svg.outerHTML
  let u = URL.createObjectURL(new Blob([RawSVG], { type: "image/svg+xml" }))
  const helper = document.querySelector("#fileSaveHelper")
  helper.download = FileName
  helper.href = u
  helper.click()

}

export const importImage = () => {
  const imageFileHelper = document.querySelector('#imageFileHelper')
  imageFileHelper.click()
  imageFileHelper.addEventListener('change', readImageFile)
}