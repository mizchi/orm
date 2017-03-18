/* @flow */
/* eslint-disable */
import type { JSONSchema } from './jsonschema'
import idGenerator from './id-generator'
const tv4 = require('tv4')

const Comparotor = {
  '$gte': '<=',
  '$gt': '<',
  '$lte': '>=',
  '$lt': '>',
  '$eq': '='
}

export const NullId: any = null
export default class Store<T> {
  kind: string;
  schema: any;
  datastore: any;
  validate: ?(T => boolean);

  constructor (opts: {
    storeName: string,
    schema: any,
    datastore: any,
    validate?: (T) => boolean
  }) {
    this.kind = opts.storeName
    this.schema = opts.schema
    this.datastore = opts.datastore
    this.validate = opts.validate
  }

  async save (data: T): Promise<T> {
    const _data: any = data
    const id = idGenerator()
    const key = this.datastore.key([this.kind, id])
    const newData: any = {..._data, id}
    const result = await this.datastore.save({key, data: newData})
    return newData
  }

  async update (data: T): Promise<T> {
    const _data: any = data
    const old: any = await this.find(_data.id)
    const newData: any = {...old, ..._data}
    const _result = await this.datastore.update(newData)
    return _data
  }

  async where (obj: Object, opts?: {limit: number, order: {key: string, descending?: boolean}}) {
    let q = this.datastore.createQuery(this.kind)
    for (const k in obj) {
      const v = obj[k]
      if (
        (v instanceof Object) &&
        Object.keys(v).length === 1 &&
        !!Comparotor[Object.keys(v)[0]]
      ) {
        const compExp = Comparotor[Object.keys(v)[0]]
        q = q.filter(k, compExp, Object.values(v)[0])
      } else {
        // TODO: Search nested object
        q = q.filter(k, v)
      }
    }
    if (opts && opts.limit) {
      q = q.limit(opts.limit)
    }

    if (opts && opts.order) {
      q = q.order(opts.order.key, { descending: !!opts.order.descending })
    }

    return q.run()
  }

  async delete (id: string): Promise<?T> {
    const key = this.datastore.key([this.kind, id])
    await this.datastore.delete(key)
  }

  async find (id: string): Promise<?T> {
    const key = this.datastore.key([this.kind, id])
    const [result] = await this.datastore.get(key)
    return result
  }
}
