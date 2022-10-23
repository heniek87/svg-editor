import { AddPointHelper } from "./AddPointHelper.js"

export default class Polygon {
  id = 15
  points = []
  startPoints = []
  dragStartPos = { x: 0, y: 0 }
  pointHelpers = []
  addPointHelpers = []
  constructor(obj, index) {
    this.id = obj.id
    this.index = index

    this.DOM = obj
    let points = obj.getAttribute("points")
    points.trim().replace(/[\t\n\r]/g, " ").split(" ").forEach(point => {
      const points = []
      const [x, y] = point.split(",")
      if (x == undefined || y == undefined) return
      if (x.length > 0 && y.length > 0) this.points.push({ x: parseFloat(x), y: parseFloat(y) })
    });
    this.setAddPointHelpers()

  }
  reloadAddPointHelpers = () => {
    this.addPointHelpers = []
    this.setAddPointHelpers()
  }
  hideAddPointHelpers = () => {

  }
  showAddPointHelpers = () => {

  }
  setAddPointHelpers = () => {
    this.points.forEach((h, index) => {

      let nextPointIndex = index == this.points.length - 1 ? 0 : index + 1
      let n = this.points[nextPointIndex]
      const data = {
        pointBefore: { x: h.x, y: h.y },
        pointAfter: { x: n.x, y: n.y },
        index
      }
      const addPointHelper = new AddPointHelper(data)
      console.log(addPointHelper)
    })
  }
  dragListen = () => {

    this.DOM.addEventListener("mousedown", this.startDrag)
    this.DOM.addEventListener("mouseup", this.endDrag)
    this.DOM.addEventListener("mouseout", this.endDrag)
  }
  dragUnListen = () => {

    this.DOM.removeEventListener("mousedown", this.startDrag)
    this.DOM.removeEventListener("mouseup", this.endDrag)
    this.DOM.removeEventListener("mouseout", this.endDrag)
  }
  startDrag = evt => {
    editor.pointHelpers.forEach(h => h.hide())
    this.dragStartPos = this.getMousePosition(evt)
    this.DOM.addEventListener("mousemove", this.drag)
    this.startPoints = [...this.points]

  }
  drag = evt => {
    let { x, y } = this.getMousePosition(evt)
    const { x: xs, y: ys } = this.dragStartPos
    let r = { x: x - xs, y: y - ys }

    this.points = this.points.map((p, i) => {
      const { x: xs, y: ys } = this.startPoints[i]
      return { x: this.toTenDec(r.x + xs), y: this.toTenDec(r.y + ys) }
    })
    this.points.forEach((p, i) => {
      editor.polygonMenu.updatePoint(p, this.id, i)
    })
    this.refresh()

  }
  endDrag = () => {
    this.DOM.removeEventListener("mousemove", this.drag)
    this.startPoints = []
  }
  pointsToString = () => {
    return this.points.map(({ x, y }) => `${x},${y}`).join(" ")
  }
  updatePoint = (coords, i) => {
    this.points[i] = coords
    this.refresh()

  }
  toTenDec = num => Math.round(num * 10) / 10
  getMousePosition = ({ clientX, clientY }) => {
    const { e, f, a, d } = editor.svg.getScreenCTM();

    return {
      x: this.toTenDec((clientX - e) / a),
      y: this.toTenDec((clientY - f) / d)
    }
  }
  refresh = () => this.DOM.setAttributeNS(null, "points", this.pointsToString())
  removePoint = i => {
    this.points.splice(i, 1)
    this.refresh()
  }
  highLight = () => {
    this.DOM.classList.add("active")
  }
  lowLight = () => {

    this.DOM.classList.remove("active")
  }
}