export default class ZoomBox {
  zoom = 1
  callback = null
  constructor() {
    this.input = document.querySelector("#zoomInput")
  }
  change = (cb) => {
    this.callback = cb
    document.querySelector("#zoomOut").addEventListener("click", () => this.setZoom(this.zoom - 0.1))
    document.querySelector("#zoomIn").addEventListener("click", () => this.setZoom(this.zoom + 0.1))
    this.input.addEventListener("input", ({ target }) => {
      this.zoom = parseFloat(target.value)
      this.callback(this.zoom)
    })
  }
  setZoom = zoom => {
    if (zoom >= 1 && zoom <= 5) this.zoom = Math.round(zoom * 10) / 10
    this.input.value = this.zoom
    this.callback(this.zoom)
  }
}