class CustomValidator {
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
    let valid = true
    if (files) {
      files.map(file => {
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
          valid = false
        }
      })
    }
    return valid
  }
}

export default new CustomValidator()