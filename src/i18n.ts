const zh = navigator.language.startsWith('zh')

export const t = {
  selectPhoto: zh ? '点击选取图片' : 'Tap to select a photo',
  changePhoto: zh ? '重新选取图片' : 'Change photo',
  saveFailed:  zh ? '保存失败，请重试' : 'Save failed, please try again',
  ratio:       zh ? '比例' : 'Ratio',
  steps: zh
    ? ['从相册选取一张图片', '选择网格类型和比例', '保存切图，按顺序发布']
    : ['Select a photo from your library', 'Choose grid layout & aspect ratio', 'Save tiles & post them in order'],
}
