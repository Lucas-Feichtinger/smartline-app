import { ComboboxItemIFace } from './combobox-item.iface'

export type ComboboxSetDataArgsI<T> = {
   dataset: ComboboxItemIFace<T>[]
}
export type ComboboxSetDataArgs<T> = {
   dataset: T[]
}

export interface ComboboxDataRequestIFace<T> {
   FilterText?: string

   SetDataI: (args: ComboboxSetDataArgsI<T>) => void
   SetData: (args: ComboboxSetDataArgs<T>) => void
}
