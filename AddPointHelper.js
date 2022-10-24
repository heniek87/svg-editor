

export default class AddPointHelper {
  index = NaN
  pointBefore = null
  pointAfter = null
  DOM = null
  scale = 1

  cbFunction = null
  textLeft = -9
  textTop = 11
  c1r = 30
  c2r = 10
  visible = false
  constructor({ pointBefore, pointAfter, index, svg }) {
    this.svg = svg
    this.index = index
    this.pointAfter = pointAfter
    this.pointBefore = pointBefore
    this.setDOM()
  }
  clickCallbackListener = (func) => {
    this.cbFunction = func
  }
  clickListener = () => {

  }
  setScale = scale => {
    this.DOM.remove()
    this.c1r = (scale * 3)
    this.c2r = scale
    // this.scale = scale / 10
    this.setDOM()
    if (this.visible) this.show()
  }
  show = () => {
    // console.log(this)
    this.visible = true
    this.svg.appendChild(this.DOM)
  }
  hide = () => {
    this.visible = false
    this.DOM.remove()
  }
  getPosition = () => {
    const x = (this.pointAfter.x + this.pointBefore.x) / 2
    const y = (this.pointAfter.y + this.pointBefore.y) / 2
    return { x, y }
  }
  setDOM = () => {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g")
    const c1 = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    const c2 = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    const t = document.createElementNS("http://www.w3.org/2000/svg", "text")
    const { x, y } = this.getPosition()

    g.setAttribute("transform", `translate(${x} ${y})`)
    g.classList.add("addPoint")
    c1.setAttribute("cx", 0)
    c1.setAttribute("cy", 0)
    c1.setAttribute("r", this.c1r)
    c1.classList.add("outer")
    c2.classList.add("inner")
    c2.setAttribute("cx", 0)
    c2.setAttribute("cy", 0)
    c2.setAttribute("r", this.c2r)
    t.setAttribute("x", this.textLeft)
    t.setAttribute("y", this.textTop)
    t.innerHTML = "+"
    g.append(c1)

    g.append(c2)
    g.append(t)
    // window.editor.svg.appendChild(t)
    this.DOM = g
  }

}