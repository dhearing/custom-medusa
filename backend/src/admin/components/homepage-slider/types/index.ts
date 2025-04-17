export interface SliderImage {
  id: string
  src: string
  alt_text: string
  link: string
  placement: number
}

export interface TrackedSliderImage extends SliderImage {
  status: 'new' | 'updated' | 'unchanged'
}

export interface DeleteItem {
  id: string
}

export type MenuItemStatus = 'unchanged' | 'updated' | 'new' | 'delete'

export interface SortableSliderProps {
  item: TrackedSliderImage
  index: number
  updateImage: (index: number, field: "src" | "alt_text" | "link", value: string) => void
  deleteImage: (index: number) => void
}

export type ApiSuccessResponse<T> = {
  status: 'success'
  data: T
}

export type ApiErrorResponse = {
  status: 'error'
  error: string
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse 