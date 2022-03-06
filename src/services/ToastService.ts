import Swal, {SweetAlertIcon} from "sweetalert2";

class ToastService {
  readonly SUCCESS = 'success'
  readonly ERROR = 'error'
  
  async toast(icon: SweetAlertIcon, title: string, msg?: string): Promise<void> {
    await Swal.fire({
      icon: icon,
      title: title,
      text: msg,
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      position: 'top-right'
    })
  }
}

export default new ToastService()