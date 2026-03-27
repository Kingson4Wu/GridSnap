const zh = navigator.language.startsWith('zh')

export const t = {
  selectPhoto: zh ? '点击选取图片' : 'Tap to select a photo',
  changePhoto: zh ? '重新选取图片' : 'Change photo',
  saveFailed:  zh ? '保存失败，请重试' : 'Save failed, please try again',
  ratio:       zh ? '比例' : 'Ratio',
}
