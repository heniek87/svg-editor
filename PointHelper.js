export default class PointHelper {
  active = false
  constructor({ x, y }, w, svg, polygon, id, polygonMenu) {
    this.id = id
    this.x = x
    this.y = y
    this.polygon = polygon
    this.polygonMenu = polygonMenu
    this.svg = svg
    this.coord = { x, y }
    this.point = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    this.point.setAttribute("cx", x)
    this.point.setAttribute("cy", y)
    this.point.setAttribute("r", w)
    this.point.classList.add('pointHelper')
    // this.point.addEventListener("click", () => console.log("test", x, y))
    this.point.addEventListener("mousedown", this.setActive)
    this.point.addEventListener("mouseup", this.removeActive)
    this.point.addEventListener("click", this.remove)
    // this.point.addEventListener("mouseout", this.removeActive)


  }

  obj = () => this.point
  hide = () => this.point.style.pointerEvents = "none"
  move = (evt) => {
    let { x, y } = this.getMousePosition(evt)

    x = Math.round(x * 10) / 10
    y = Math.round(y * 10) / 10

    this.point.setAttributeNS(null, "cx", x)
    this.point.setAttributeNS(null, "cy", y)
    this.polygon.updatePoint({ x, y }, this.id)
    this.polygonMenu.updatePoint({ x, y }, this.polygon.id, this.id)

  }

  remove = evt => {
    if (evt.ctrlKey) {
      this.polygon.removePoint(this.id)
      this.polygonMenu.removePoint(this.polygon.id)

    }
  }
  removeListen = cb => {
    cb(true)
  }
  setActive = () => {
    this.point.classList.add('active')
    this.svg.addEventListener("mousemove", this.move)
    this.active = true
  }
  removeActive = () => {
    if (this.active) {
      this.point.classList.remove('active')
      this.svg.removeEventListener('mousemove', this.move)
      this.active = false
    }
  }
  getMousePosition = ({ clientX, clientY }) => {
    const { e, f, a, d } = this.svg.getScreenCTM();

    return {
      x: (clientX - e) / a,
      y: (clientY - f) / d
    }
  }
}