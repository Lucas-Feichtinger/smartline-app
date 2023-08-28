// Angular
import { Injectable } from '@angular/core'

@Injectable({
   providedIn: 'root',
})
export class CacheService {
   /**
    * String in den SessionStorage schreiben
    * @param {string} key Zu schreibender Schlüssel
    * @param {string} val Zu schreibender Wert
    */
   public setString(key: string, val: string) {
      if (!sessionStorage) {
         console.log('sessionStorage unavailable')
         return
      }
      // sessionStorage.setItem(key,val)
      sessionStorage.setItem(key, val)
   }

   /**
    * String aus dem SessionStorage lesen (als Observable)
    * @param {string} key Zu lesender Schlüssel
    * @return {Promise<string>} Observable auf den Schlüsselwert
    */
   public getString(key: string): Promise<string | null> {
      if (!sessionStorage) {
         console.log('sessionStorage unavailable')
         return new Promise<string | null>((resolve) => {
            resolve(null)
         })
      }
      // let val = sessionStorage.getItem(key)
      const val = sessionStorage.getItem(key)
      return new Promise<string | null>((resolve) => {
         resolve(val)
      })
   }

   public async GetString(key: string): Promise<string> {
      if (!sessionStorage) return ''
      const val = sessionStorage.getItem(key)
      return val ?? ''
   }

   /**
    * String-Wert aus SessionStorage lesen (als String)
    * @param {string} key Zu lesender Schlüssel
    * @return {string} Schlüsselwert
    */
   public getStringValue(key: string): string | null {
      if (!sessionStorage) {
         console.log('sessionStorage unavailable')
         return null
      }
      const val = sessionStorage.getItem(key)
      return val
   }

   /**
    * JSON-String in den SessionStorage schreiben
    * @param {string} key Zu schreibender Schlüssel
    * @param {any} val Zu schreibender Wert (JSON-Objekt)
    */
   public setJson(key: string, val: any) {
      try {
         const str = JSON.stringify(val)
         this.setString(key, str)
      } catch (ex) {
         console.error(ex)
      }
   }

   /**
    * JSON-String aus dem SessionStorage lesen (als Observable)
    * @param {string} key Zu lesender Schlüssel
    * @return {Observable<any>} Observable auf den Schlüsselwert (JSON-Objekt)
    */
   public async getJson(key: string): Promise<any> {
      const str = await this.getString(key)
      if (typeof str === 'string') {
         return JSON.parse(str)
      } else {
         return null
      }
   }

   /**
    * JSON-String aus dem SessionStorage lesen (als String)
    * @param {string} key Zu lesender Schlüssel
    * @return {any} Schlüsselwert (JSON-Objekt)
    */
   public getJsonValue(key: string): any {
      if (!sessionStorage) {
         console.log('sessionStorage unavailable')
         return null
      }
      const val = JSON.parse(this.getStringValue(key) || '')
      return val
   }

   /**
    * String-Wert aus SessionStorage lesen (als String)
    * @param {string} key Zu lesender Schlüssel
    * @return {string} Schlüsselwert
    */
   public getStringValueLocal(key: string): string | null {
      if (!localStorage) {
         console.log('localStorage unavailable')
         return null
      }
      const val = localStorage.getItem(key)
      return val
   }

   /**
    * JSON-String aus dem SessionStorage lesen (als String)
    * @param {string} key Zu lesender Schlüssel
    * @return {any} Schlüsselwert (JSON-Objekt)
    */
   public getJsonValueLocal(key: string): any {
      if (!localStorage) {
         console.log('localStorage unavailable')
         return null
      }
      const val = JSON.parse(this.getStringValueLocal(key) || '')
      return val
   }

   /**
    * JSON-String aus dem SessionStorage lesen (als Observable)
    * @param {string} key Zu lesender Schlüssel
    * @return {Observable<any>} Observable auf den Schlüsselwert (JSON-Objekt)
    */
   public async getJsonLocal(key: string): Promise<any> {
      const str = await this.getStringLocal(key)
      if (typeof str === 'string') {
         return JSON.parse(str)
      } else {
         return null
      }
   }

   /**
    * JSON-String in den SessionStorage schreiben
    * @param {string} key Zu schreibender Schlüssel
    * @param {any} val Zu schreibender Wert (JSON-Objekt)
    */
   public setJsonLocal(key: string, val: any) {
      try {
         const str = JSON.stringify(val)
         this.setStringLocal(key, str)
      } catch (ex) {
         console.error(ex)
      }
   }

   /**
    * String in den SessionStorage schreiben
    * @param {string} key Zu schreibender Schlüssel
    * @param {string} val Zu schreibender Wert
    */
   public setStringLocal(key: string, val: string) {
      if (!localStorage) {
         console.log('localStorage unavailable')
         return
      }
      // sessionStorage.setItem(key,val)
      localStorage.setItem(key, val)
   }

   /**
    * String aus dem SessionStorage lesen (als Observable)
    * @param {string} key Zu lesender Schlüssel
    * @return {Promise<string>} Observable auf den Schlüsselwert
    */
   public getStringLocal(key: string): Promise<string | null> {
      if (!localStorage) {
         console.log('localStorage unavailable')
         return new Promise<string | null>((resolve, reject) => {
            resolve(null)
         })
      }
      // let val = sessionStorage.getItem(key)
      const val = localStorage.getItem(key)
      return new Promise<string | null>((resolve, reject) => {
         resolve(val)
      })
   }

   public async GetStringLocal(key: string): Promise<string> {
      if (!localStorage) return ''
      const val = localStorage.getItem(key)
      return val ?? ''
   }
}
