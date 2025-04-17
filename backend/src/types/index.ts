export type HomepageContent = {
  content: string
}

export type ContentBody = {
  content: string
}

export type MenuItem = {
  id: string
  title: string
  link: string
  placement: number
}

export type MenuItemCreateUpdate = Omit<MenuItem, 'id'> & { id?: string }

export type DeleteItem = {
  id: string
}

export type { DeleteItem as MenuItemDelete }

export type BlogResourceItem = {
  id: string
  title: string
  description: string
  content: string
  main_image: string
  link: string
  status: boolean
  author: string
  views: number
  category: string
  updated_at: string
}

export type MenuItemStatus = 'unchanged' | 'updated' | 'new' | 'delete'
export type TrackedMenuItem = MenuItem & { status: MenuItemStatus }

export interface SortableMenuItemProps {
  item: TrackedMenuItem
  index: number
  updateMenuItem: (index: number, field: "title" | "link", value: string) => void
  deleteMenuItem: (index: number) => void
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