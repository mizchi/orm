/* @flow */
import Observable from 'zen-observable'
import idGenerator from './id-generator'

export const NullId: any = null
export default class Store<T> {
  _ref: any;
  _refPath: string;
  _firebase: any;
  constructor (opts: {
    refPath: string,
    firebase: any
  }) {
    this._refPath = opts.refPath
    this._firebase = opts.firebase
    this._ref = this._firebase.database().ref(this._refPath)
  }

  async save (item: T): Promise<T> {
    const _item: any = item
    const id = idGenerator()
    const data: any = {..._item, id}
    await this._ref.child(id).set(data)
    return data
  }

  async update (item: T): Promise<T> {
    const _item: any = item
    return this._ref.child(_item.id).set(item)
  }

  async find (id: string): Promise<T> {
    const snapshot = await this._ref.child(id).once('value')
    return snapshot.val()
  }

  // TODO: Just one parameter
  async where (obj: Object): Promise<T[]> {
    for (const key in obj) {
      const val = obj[key]
      const ret: any = Object.values(this._ref.orderByChild(key).equalTo(val).once('value').val())
      return ret
    }
    return []
  }

  // platform extension
  async exists (id: string): Promise<T> {
    return await this._ref.child(id).exists()
  }

  async all (): Promise<Array<T>> {
    const snapshot = await this._ref.once('value')
    return Object.values(snapshot.val())
  }

  async clear (confirmed: boolean): Promise<void> {
    if (confirmed) {
      await this._ref.remove()
    }
  }

  getRef () {
    return this._ref
  }

  observeAll (): Observable<Array<T>> {
    const ref = this._ref
    return new Observable(observer => {
      const f = snapshot => {
        observer.next(Object.values(snapshot.val()))
      }
      ref.on('value', f)
      return () => observer.off('value', f)
    })
  }

  observeOne (id: string): Observable<T> {
    const childRef = this._ref.child(id)
    return new Observable(observer => {
      const f = snapshot => {
        observer.next(Object.values(snapshot.val()))
      }
      childRef.on('value', f)
      return () => observer.off('value', f)
    })
  }
}
