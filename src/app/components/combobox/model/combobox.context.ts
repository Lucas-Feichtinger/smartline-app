import { Subject } from 'rxjs'
import { ComboboxItemIFace } from './combobox-item.iface'

type GridCommandType = { command: string; userdata?: any }

export class ComboboxContext<T> {
   public Dataset: ComboboxItemIFace<T>[] = []

   public readonly $Command: Subject<GridCommandType> = new Subject()

   public requestData() {
      this.execCommand({ command: 'request-data' })
   }
   // public setSelectedItem(item: T) {
   //     this.execCommand({command: 'set-item', userdata: item})
   // }

   // --- ---
   public statusInGrid = false
   private commandStack: GridCommandType[] = []
   public execCommand(cmd: GridCommandType) {
      if (this.statusInGrid) {
         this.$Command.next(cmd)
      } else {
         this.commandStack.push(cmd)
      }
   }
   public execCommandStack() {
      this.statusInGrid = true
      const cmdList = this.commandStack
      this.commandStack = []
      for (const cmd of cmdList) {
         this.$Command.next(cmd)
      }
   }
}
