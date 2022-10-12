// import PointHelper from "./PointHelper.js"
import Polygon from "./Polygon.js"
import PolygonMenu from "./PolygonMenu.js"

export default class Editor {
  tmpImg = false
  polygons = []
  selectedPolygon = NaN
  constructor(RawSVG) {
    this.RawSvg = RawSVG
    this.DOMEditor = document.querySelector("#editor")
    this.polygonMenu = new PolygonMenu()
    this.editorHelper = document.querySelector("#editorHelper")
    this.editorHelper.innerHTML = this.RawSvg
    this.svg = this.editorHelper.querySelector("SVG")


    let image = new Image()
    this.imageSrc = this.svg.querySelector("IMAGE").getAttribute("xlink:href")
    image.src = this.imageSrc
    image.addEventListener('error', (e) => {
      const c = confirm("Nie mogę wczytać zdjęcia ze ścieżki: " + this.imageSrc + ", czy chcesz załadować ręcznie?")
      if (c) {
        console.log("impoet image")
        importImage()
      }
    })
    this.image = image
    this.DOMEditor.appendChild(this.svg)
    this.readPolygons()
    this.svg.addEventListener('click', this.unselectAll)
  }
  refresh = () => {
    this.DOMEditor.innerHTML = this.svg.outerHTML


  }
  setTmpImgSrc = u => {
    this.tmpImg = true
    this.tmpImgSrc = u
    this.DOMEditor.querySelector("IMAGE").setAttribute("xlink:href", u)

  }

  readPolygons = () => {
    this.svg.querySelectorAll("polygon").forEach((p, i) => {
      const object = new Polygon(p)

      this.polygons.push(object)
      this.polygonMenu.push(object)

    })

  }
  unselectAll = ({ target: { tagName } }) => {
    if (tagName == 'image') this.deselectPolygon()
  }
  deselectPolygon = () => {
    this.svg.querySelectorAll("circle.pointHelper").forEach(p => p.remove())
    if (!isNaN(this.selectedPolygon)) this.polygons[this.selectedPolygon].lowLight()
    this.selectedPolygon = NaN
    this.polygonMenu.deselect()
  }
  selectPolygon = ind => {
    this.deselectPolygon()
    this.selectedPolygon = ind
    this.polygons[ind].highLight()
    this.polygons[ind].points.forEach((p, i) => {
      this.svg.appendChild(new PointHelper(p, this.svg, this.polygons[ind], i, this.polygonMenu))
    })
  }



}