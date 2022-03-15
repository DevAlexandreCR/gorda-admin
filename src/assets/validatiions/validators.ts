import * as yup from 'yup'
import i18n from "@/plugins/i18n";

class CustomValidator {
  isImage(image: string, size: string): yup.BaseSchema {
    return yup.mixed().test('image', image, this.image).test('size', size, this.size)
  }
  
  size(files?: [File]): boolean {
    let valid = true
    if (files) {
      files.map(file => {
        const size = file.size / 1024 / 1024
        if (size > 1.024) {
          valid = false
        }
      })
    }
    return valid
  }

  image(files?: [File]): boolean {
    let valid = false
    if (files) {
      files.map(file => {
        if (['image/jpeg', 'image/png'].includes(file.type)) {
          valid = true
        }
      })
    }
    return valid
  }
}

export default new CustomValidator()