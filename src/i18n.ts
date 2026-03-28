const zh = navigator.language.startsWith('zh')

export const t = {
  selectPhoto:  zh ? '点击选取图片'    : 'Tap to select a photo',
  changePhoto:  zh ? '重新选取图片'    : 'Change photo',
  saveFailed:   zh ? '保存失败，请重试' : 'Save failed, please try again',
  ratio:        zh ? '比例'            : 'Ratio',
  steps: zh
    ? ['从相册选取一张图片', '选择网格类型和比例', '保存切图，按顺序发布']
    : ['Select a photo from your library', 'Choose grid layout & aspect ratio', 'Save tiles & post them in order'],
  shareTitle:   zh ? '分享 GridSnap'                                   : 'Share GridSnap',
  shareText:    zh ? 'GridSnap — 免费在线切图工具，支持多种网格和比例'         : 'GridSnap — Split any photo into a grid for social media',
  copyLink:     zh ? '复制'   : 'Copy',
  copied:       zh ? '已复制' : 'Copied!',
  wechatCopied: zh ? '链接已复制，去微信粘贴分享' : 'Link copied — paste in WeChat to share',
  moreOptions:  zh ? '更多'   : 'More',
}
