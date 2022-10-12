export default class PolygonMenu {
  objects = []
  activeElement = null
  constructor() {
    this.DOM = document.querySelector("#polygonObjects")

  }
  push = polygon => {
    this.objects.push(polygon)
    this.refreshMenu()

  }

  idClickHandler = ({ target }) => {
    if (this.activeElement !== null) this.activeElement.classList.remove("active")
    this.activeElement = target.parentElement
    this.activeElement.classList.add("active")
    window.editor.selectPolygon(target.index)
  }
  updatePoint = ({ x, y }, pid, id) => {
    const o = this.DOM.querySelector(`ul#${pid}>li:nth-child(${id + 1})`)
    o.innerHTML = `{ x: ${x}, y: ${y} }`

  }
  over = o => {
    o.DOM.classList.add("over")
  }
  out = o => {
    o.DOM.classList.remove("over")
  }
  refreshMenu = () => {
    this.DOM.innerHTML = ''
    const ul = document.createDocumentFragment()
    this.objects.forEach((o, index) => {

      const li = document.createElement('li')
      const idObj = document.createElement('div')
      idObj.innerHTML = `#${o.id}`
      idObj.index = index
      idObj.addEventListener('click', this.idClickHandler)
      o.DOM.addEventListener('click', () => this.idClickHandler({ target: idObj }))
      li.innerHTML = `
          <details>
          <summary>${o.points.length} points</summary>
          <ul id="${o.id}">
          ${o.points.map(({ x, y }) => `<li>{ x: ${x}, y: ${y} }</li>`).join('')}
          </ul>
        </details>
      `
      li.prepend(idObj)
      li.addEventListener('mouseover', () => this.over(o))
      li.addEventListener('mouseout', () => this.out(o))
      ul.appendChild(li)
    })

    this.DOM.appendChild(ul)
  }
}