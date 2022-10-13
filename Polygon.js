export default class Polygon {
  id = 15
  points = []
  constructor(obj) {
    this.id = obj.id
    this.DOM = obj
    let points = obj.getAttribute("points")
    points.trim().replace(/[\t\n\r]/g, " ").split(" ").forEach(point => {
      const points = []
      const [x, y] = point.split(",")
      if (x == undefined || y == undefined) return
      if (x.length > 0 && y.length > 0) this.points.push({ x: parseFloat(x), y: parseFloat(y) })
    });

  }

  pointsToString = () => {
    return this.points.map(({ x, y }) => `${x},${y}`).join(" ")
  }
  updatePoint = (coords, i) => {
    this.points[i] = coords


    this.DOM.setAttributeNS(null, "points", this.pointsToString())

  }
  highLight = () => {
    this.DOM.classList.add("active")
  }
  lowLight = () => {

    this.DOM.classList.remove("active")
  }
}