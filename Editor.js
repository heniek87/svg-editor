// import PointHelper from "./PointHelper.js"
import Polygon from "./Polygon.js"
import PolygonMenu from "./PolygonMenu.js"
import ZoomBox from "./ZoomBox.js"
export default class Editor {
  tmpImg = false
  polygons = []
  zoom = 1
  pointHelpers = []
  selectedPolygon = NaN
  DOT_SIZE = localStorage["DOT_SIZE"] | 10
  POLYGON_BORDER_WIDTH = localStorage["POLYGON_BORDER_WIDTH"] | 1
  constructor(RawSVG) {
    this.RawSvg = RawSVG
    this.DOMEditor = document.querySelector("#editor")
    this.ZoomBox = new ZoomBox()
    this.zoomUpdateObject = document.createElementNS("http://www.w3.org/2000/svg", "g")
    this.zoomUpdateObject.id = 'zoomUpdateObject'
    this.ZoomBox.change(zoom => {
      this.zoom = zoom
      this.updateZoomEditor()
    })
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
    const { width, height } = this.svg.getBoundingClientRect()
    this.rect = document.querySelector('#rect')
    this.rect.style.width = `${width}px`
    this.rect.style.height = `${height}px`

    this.readPolygons()
    this.svg.addEventListener('click', this.unselectAll)
    this.svg.addEventListener("wheel", this.wheelHandler)
    this.setDefaultSettings()
  }
  wheelHandler = evt => {
    evt.preventDefault()
    if (evt.altKey) {
      let { deltaY } = evt
      deltaY = deltaY / 1000
      this.ZoomBox.setZoom(this.zoom - deltaY)

    }
    let scrollLvl = 0.1
    if (evt.shiftKey) scrollLvl = 1
    if (evt.ctrlKey) {
      this.DOMEditor.scrollTo(this.DOMEditor.scrollLeft + evt.deltaY * scrollLvl, this.DOMEditor.scrollTop)
    }
    // this.DOMEditor.scrollTop()
    if (!evt.ctrlKey && !evt.altKey) {

      this.DOMEditor.scrollTo(this.DOMEditor.scrollLeft, this.DOMEditor.scrollTop + evt.deltaY * scrollLvl)
    }
  }
  setDefaultSettings = () => {
    this.setBorderWidth(this.POLYGON_BORDER_WIDTH)
    this.setDotSize(this.DOT_SIZE)
    document.querySelector(".settings #dotSize").value = this.DOT_SIZE
    document.querySelector(".settings #borderWidth").value = this.POLYGON_BORDER_WIDTH

  }
  updateZoomEditor = () => {
    this.svg.style.transform = `scale(${this.zoom})`
    this.rect.style.transform = `translate(-50%,-50%) scale(${this.zoom})`
    this.svg.appendChild(this.zoomUpdateObject)


    let { left, top } = this.rect.getBoundingClientRect()

    // console.log(left, top)

    this.svg.style.transformOrigin = `${top < 36 ? "top" : "center"} ${left < 10 ? "left" : "center"}`
    if (left < 0) this.DOMEditor.style.justifyContent = "flex-start"
    else this.DOMEditor.style.justifyContent = "center"

    if (top < 36) this.DOMEditor.style.alignItems = "flex-start"
    else this.DOMEditor.style.alignItems = "center"
    clearTimeout(this.gHelper)
    this.gHelper = setTimeout(() => {
      this.zoomUpdateObject.remove()
    }, 100)
    if (!isNaN(this.selectedPolygon)) this.selectPolygon(this.selectedPolygon)
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
      const object = new Polygon(p, i)

      this.polygons.push(object)
      this.polygonMenu.push(object)

    })

  }
  setBorderWidth = value => {
    this.POLYGON_BORDER_WIDTH = parseFloat(value)
    localStorage["POLYGON_BORDER_WIDTH"] = parseFloat(value)
    document.querySelector('#polygonWidth').innerHTML = `polygon{stroke-width:${this.POLYGON_BORDER_WIDTH};}`
  }
  unselectAll = ({ target: { tagName } }) => {
    if (tagName == 'image') this.deselectPolygon()
  }
  deselectPolygon = () => {
    this.pointHelpers = []
    this.polygons.forEach(p => p.dragUnListen())
    this.svg.querySelectorAll("circle.pointHelper").forEach(p => p.remove())
    if (!isNaN(this.selectedPolygon)) this.polygons[this.selectedPolygon].lowLight()
    this.selectedPolygon = NaN
    this.polygonMenu.deselect()
  }
  setDotSize = (value) => {
    this.DOT_SIZE = parseFloat(value)
    localStorage["DOT_SIZE"] = parseFloat(value)
    if (!isNaN(this.selectedPolygon)) this.selectPolygon(this.selectedPolygon)
  }

  selectPolygon = ind => {
    this.deselectPolygon()
    this.selectedPolygon = ind
    this.polygons[ind].highLight()
    this.polygons[ind].points.forEach((p, i) => {
      let helper = new PointHelper(p, this.DOT_SIZE / this.zoom, this.svg, this.polygons[ind], i, this.polygonMenu)
      this.pointHelpers.push(helper)

      this.svg.appendChild(helper.obj())
    })
    this.polygons[ind].dragListen()
  }



}