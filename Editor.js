class Editor {
  tmpImg = false
  constructor() {
    this.RawSvg = RawSVG
    this.DOMEditor = document.querySelector("#editor")
    this.editorHelper = document.querySelector("#editorHelper")
    this.editorHelper.innerHTML = this.RawSvg
    this.svg = this.editorHelper.querySelector("SVG")
    let image = new Image()
    this.imageSrc = this.svg.querySelector("IMAGE").getAttribute("xlink:href")
    image.src = this.imageSrc
    image.addEventListener('error', (e) => {
      const c = confirm("Nie mogę wczytać zdjęcia ze ścieżki: " + this.imageSrc + ", czy cchesz załadować ręcznie?")
      if (c) {
        console.log("impoet image")
        importImage()
      }
    })
    this.image = image
    this.DOMEditor.innerHTML = this.svg.outerHTML
  }
  refresh = () => {
    this.DOMEditor.innerHTML = this.svg.outerHTML
  }
  setTmpImgSrc = u => {
    this.tmpImg = true
    this.tmpImgSrc = u
    this.DOMEditor.querySelector("IMAGE").setAttribute("xlink:href", u)

  }
  imageUpload = () => {

  }
}