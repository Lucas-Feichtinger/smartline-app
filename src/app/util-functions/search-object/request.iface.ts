import { SearchObjectIFace } from './search-object.iface'

// Welche Daten werden von der Funktion benoetigt
export interface RequestSearchObjectIFace<T> {
   InputString: string
   Dataset: SearchObjectIFace<T>[]
}
