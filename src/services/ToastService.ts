import Swal, { SweetAlertIcon } from "sweetalert2"

class ToastService {
  readonly SUCCESS = 'success'
  readonly ERROR = 'error'

  async toast(icon: SweetAlertIcon, title: string, msg?: string): Promise<void> {
    await Swal.fire({
      icon: icon,
      title: title,
      text: msg,
      showConfirmButton: false,
      timer: 3000,
      toast: true,
      position: 'top-right'
    })
  }

  showLoading(title: string, text?: string): void {
    Swal.fire({
      title: title,
      text: text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })
  }

  close(): void {
    Swal.close()
  }
}

export default new ToastService()