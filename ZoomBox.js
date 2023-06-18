export default class ZoomBox {
  zoom = 1
  callback = null
  constructor() {
    this.input = document.querySelector("#zoomInput")
  }
  change = (cb) => {
    this.callback = cb
    document.querySelector("#zoomOut").addEventListener("click", () => this.setZoom(this.zoom - 0.1, 'c'))
    document.querySelector("#zoomIn").addEventListener("click", () => this.setZoom(this.zoom + 0.1, 'c'))
    this.input.addEventListener("input", ({ target }) => {
      this.zoom = parseFloat(target.value)
      this.callback(this.zoom, 'c')
    })
  }
  setZoom = (zoom, c) => {
    if (zoom >= 1 && zoom <= 5) this.zoom = Math.round(zoom * 10) / 10
    this.input.value = this.zoom
    this.callback(this.zoom, c)
  }
}