import * as bootstrap from 'bootstrap'

export const hide = (id: string): void => {
  const modal = document.getElementById(id) as HTMLElement
  const modalObj = bootstrap.Modal.getOrCreateInstance(modal ?? '')
  modalObj.hide() 
}