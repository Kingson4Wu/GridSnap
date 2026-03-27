export interface GridLayout {
  id: string
  rows: number
  cols: number
  label: string
}

export interface AspectRatio {
  id: string
  label: string
  width: number
  height: number
}

export interface CropPixels {
  x: number
  y: number
  width: number
  height: number
}

export interface Point {
  x: number
  y: number
}
