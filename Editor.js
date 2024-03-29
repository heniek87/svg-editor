import PointHelper from "./PointHelper.js"

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
    this.cloneBtn = document.querySelector("#clonePolygon")
    this.cloneBtn.addEventListener("click", this.cloneSelectedPolygon)
    this.ZoomBox = new ZoomBox()
    this.zoomUpdateObject = document.createElementNS("http://www.w3.org/2000/svg", "g")
    this.zoomUpdateObject.id = 'zoomUpdateObject'
    this.scrollPos = { x: 0, y: 0 }
    this.mousePos = { x: 0, y: 0 }
    this.ZoomBox.change((zoom, c) => {
      this.zoom = zoom
      this.updateZoomEditor(c)
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
    this.DOMEditor.addEventListener('scroll', this.setScroll)

    const { width, height } = this.svg.getBoundingClientRect()
    this.rect = document.querySelector('#rect')
    this.rect.style.width = `${width}px`
    this.rect.style.height = `${height}px`

    this.readPolygons()
    this.svg.addEventListener('click', this.unselectAll)

    this.svg.addEventListener("wheel", this.wheelHandler)
    document.querySelector('#editorKeyHelper').addEventListener("keyup", this.keyHandler)
    this.setDefaultSettings()

  }
  cloneSelectedPolygon = () => {
    if (!isNaN(this.selectedPolygon)) {


      const obj = this.polygons[this.selectedPolygon].DOM.cloneNode()
      obj.classList.remove("active")
      this.polygons[this.selectedPolygon].DOM.parentElement.append(obj)

      const object = new Polygon(obj, this.selectedPolygon + 1, this.svg)
      object.onAddPoint = this.onAddPoint
      this.polygons.push(object)
      this.polygonMenu.push(object)

      this.polygonMenu.selectLastElement()
    }
  }
  setScroll = () => {

    this.scrollPos.x = this.DOMEditor.scrollLeft
    this.scrollPos.y = this.DOMEditor.scrollTop
    this.setScrollCenter()
  }

  setScrollCenter = () => {
    const { width, height } = editor.DOMEditor.getBoundingClientRect()
    const { x, y } = this.scrollPos
    this.scrollCenter = {
      x: ((width / 2) + x) / this.zoom,
      y: ((height / 2) + y) / this.zoom
    }

  }
  getNewPoints = () => {


    return `250,200 200,300 300,300`
  }

  newPolygon = () => {
    const p = document.createElementNS("http://www.w3.org/2000/svg", "polygon")
    p.setAttributeNS(null, "id", `newPolygon`)
    p.setAttributeNS(null, "points", this.getNewPoints())
    this.polygons[0].DOM.parentElement.append(p)

    const object = new Polygon(p, this.polygons.length, this.svg)
    object.onAddPoint = this.onAddPoint
    this.polygons.push(object)
    this.polygonMenu.push(object)

    this.polygonMenu.selectLastElement()

  }
  deleteSelectedPolygon = () => {

    this.polygons[this.selectedPolygon].DOM.remove()
    this.deselectPolygon()
    this.polygonMenu.objects = []
    this.polygonMenu.activeElement = null
    this.polygonMenu.activeInd = NaN
    this.selectedPolygon = NaN
    this.polygons = []

    this.readPolygons()
    this.cloneBtn.setAttribute("disabled", "")
  }
  keyHandler = ({ key }) => {
    if (key == 'Delete' && !isNaN(this.selectedPolygon)) {
      this.deleteSelectedPolygon()

    }
  }
  wheelHandler = evt => {
    evt.preventDefault()
    if (evt.altKey) {
      let { deltaY } = evt
      deltaY = deltaY / 1000
      this.ZoomBox.setZoom(this.zoom - deltaY, 'm')

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
  updateZoomEditor = (c) => {



    this.svg.style.transform = `scale(${this.zoom})`
    this.rect.style.transform = `translate(-50%,-50%) scale(${this.zoom})`
    this.svg.appendChild(this.zoomUpdateObject)


    let { left, top } = this.rect.getBoundingClientRect()

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


    // wyrównanie pozycji do środka oekranu
    const { x, y } = this.scrollCenter
    const { width: w, height: h } = this.DOMEditor.getBoundingClientRect()
    this.DOMEditor.scroll(x * this.zoom - (w / 2), y * this.zoom - (h / 2))



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
      const object = new Polygon(p, i, this.svg)
      object.onAddPoint = this.onAddPoint
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
    document.querySelector('#editorKeyHelper').focus()
    if (tagName == 'image') this.deselectPolygon()
  }
  deselectPolygon = () => {
    this.cloneBtn.setAttribute("disabled", "")
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
    this.polygons.forEach(pl => pl.setScale(this.DOT_SIZE))
    if (!isNaN(this.selectedPolygon)) this.selectPolygon(this.selectedPolygon)
  }
  onAddPoint = () => {
    const selected = this.selectedPolygon
    this.deselectPolygon()
    this.polygonMenu.objects = []
    this.polygonMenu.activeElement = null
    this.polygonMenu.activeInd = NaN
    this.selectedPolygon = NaN
    this.polygons = []

    this.readPolygons()
    this.cloneBtn.setAttribute("disabled", "")
    this.selectPolygon(selected)
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
    this.polygons.forEach(pl => pl.setScale(this.DOT_SIZE / this.zoom))


    this.polygons[ind].dragListen()
    this.cloneBtn.removeAttribute("disabled")
  }



}