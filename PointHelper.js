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

  getSibiblingsPositions = () => {
    let beforeDOM = this.point.previousSibling
    if (beforeDOM.nodeName == 'g') beforeDOM = this.point.parentNode.querySelectorAll('circle.pointHelper')[this.point.parentNode.querySelectorAll('circle.pointHelper').length - 1]

    let afterDOM = this.point.nextSibling
    if (afterDOM == null) afterDOM = this.point.parentNode.querySelector('circle.pointHelper')

    const x = [
      parseFloat(beforeDOM.cx.baseVal.valueAsString),
      parseFloat(afterDOM.cx.baseVal.valueAsString)
    ]
    const y = [
      parseFloat(beforeDOM.cy.baseVal.valueAsString),
      parseFloat(afterDOM.cy.baseVal.valueAsString)
    ]
    return { x, y }
  }

  getClosestValue = (number, array) => {
    if (array.length === 0) {
      return null;
    }

    let closestValue = array[0];
    let closestDifference = Math.abs(number - closestValue);

    for (let i = 1; i < array.length; i++) {
      const currentDifference = Math.abs(number - array[i]);

      if (currentDifference < closestDifference) {
        closestValue = array[i];
        closestDifference = currentDifference;
      }
    }

    return {
      value: closestValue,
      difference: closestDifference
    };
  }

  snap = ({ x: px, y: py }) => {

    const sibilingCoords = this.getSibiblingsPositions()


    return {
      x: this.getClosestValue(px, sibilingCoords.x),
      y: this.getClosestValue(py, sibilingCoords.y)
    }

  }

  move = (evt) => {
    let { x, y } = this.getMousePosition(evt)

    x = Math.round(x * 10) / 10
    y = Math.round(y * 10) / 10

    if (evt.shiftKey) {
      const newC = this.snap({ x, y })
      if (newC.x.difference < 5) x = newC.x.value
      if (newC.y.difference < 5) y = newC.y.value
    }

    this.point.setAttributeNS(null, "cx", x)
    this.point.setAttributeNS(null, "cy", y)
    this.polygon.updatePoint({ x, y }, this.id)
    this.polygonMenu.updatePoint({ x, y }, this.polygon.id, this.id)
    this.svg.querySelectorAll(".addPoint").forEach(p => {
      p.style.pointerEvents = "none"
    })
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
    this.svg.querySelectorAll(".addPoint").forEach(p => {
      p.style.pointerEvents = "auto"
    })
  }
  getMousePosition = ({ clientX, clientY }) => {
    const { e, f, a, d } = this.svg.getScreenCTM();

    return {
      x: (clientX - e) / a,
      y: (clientY - f) / d
    }
  }
}