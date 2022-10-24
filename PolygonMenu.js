export default class PolygonMenu {
  objects = []
  activeElement = null
  activeInd = NaN
  constructor() {
    this.DOM = document.querySelector("#polygonObjects")
    this.idChanger = document.querySelector("#idChanger")
    this.idChangerInput = document.querySelector("#idChangerInput")
  }
  push = polygon => {
    this.objects.push(polygon)
    this.refreshMenu()

  }

  deselect = () => {
    if (this.activeElement !== null) this.activeElement.classList.remove("active")
    this.activeElement = null
    this.activeInd = NaN
  }
  idClickHandler = ({ target }) => {


    window.editor.selectPolygon(target.index)
    this.activeInd = target.index
    this.activeElement = target.parentElement
    this.activeElement.classList.add("active")

  }
  updatePoint = ({ x, y }, pid, id) => {
    try {
      const o = this.DOM.querySelector(`ul#${pid}>li:nth-child(${id + 1})`)
      o.innerHTML = `{ x: ${x}, y: ${y} }`

    } catch (e) {
      debugger;
    }

  }
  remove = index => {
    this.objects.splice(index, 1)
    this.deselect()
    this.refreshMenu()
  }
  removePoint = (pid) => {
    this.refreshMenu()
    this.idClickHandler({ target: this.DOM.querySelector(`div#${pid}`) })
  }
  over = o => {
    o.DOM.classList.add("over")
  }
  out = o => {
    o.DOM.classList.remove("over")
  }
  changeId = (idObj, polygon) => {
    console.log(idObj, polygon)
    this.idChanger.removeAttribute("disabled")
    const ul = this.DOM.querySelector(`ul#${polygon.id}`)
    const change = ({ target: { value } }) => {
      idObj.id = value
      idObj.innerHTML = `#${value}`
      polygon.id = value
      polygon.DOM.setAttribute("id", value)
      ul.id = value
    }
    this.idChangerInput.value = polygon.id
    this.idChangerInput.select()
    this.idChangerInput.focus()
    this.idChangerInput.oninput = change
    this.idChangerInput.onkeyup = ({ key }) => {
      if (key == "Enter") this.idChanger.setAttribute("disabled", "")
    }
    this.idChanger.querySelector("#closeBtnChanger").onclick = () => this.idChanger.setAttribute("disabled", "")

  }
  refreshMenu = () => {
    this.DOM.innerHTML = ''
    const ul = document.createDocumentFragment()
    this.objects.forEach((o, index) => {

      const li = document.createElement('li')
      const idObj = document.createElement('div')
      idObj.innerHTML = `#${o.id}`
      idObj.id = o.id
      idObj.index = index
      idObj.addEventListener('click', this.idClickHandler)
      const polygonClickHandler = () => {
        this.idClickHandler({ target: idObj })
      }
      const polygonRightClickHandler = (evt) => {
        evt.preventDefault()
        this.changeId(idObj, o)
      }
      // o.DOM.addEventListener('click', polygonClickHandler)
      o.DOM.onclick = polygonClickHandler
      idObj.oncontextmenu = polygonRightClickHandler
      o.DOM.oncontextmenu = polygonRightClickHandler
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
    // if (!isNaN(this.activeInd)) {
    //   this.activeElement = this.DOM.children[this.activeInd]
    //   this.activeElement.classList.add("active")
    // }
  }
}