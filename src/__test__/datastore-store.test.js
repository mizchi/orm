/* @flow */
import test from 'ava'
import Datastore from '@google-cloud/datastore'
import Store, {NullId} from '../datastore-store.js'
import {projectId} from './firebase-config'

type Todo = {
  id: string,
  title: string,
  done: boolean
}

const datastore = Datastore({
  projectId
})

test('test', async t => {
  const myschema: any = {
    '$schema': 'http://json-schema.org/draft-04/schema#',
    'definitions': {
      'todo': {
        'type': 'object',
        'required': ['id', 'title', 'done'],
        'properties': {
          'id': {
            'type': 'string'
          },
          'title': {
            'type': 'string'
          },
          'done': {
            'type': 'boolean'
          }
        }
      }
    }
  }

  const store: Store<Todo> = new Store({
    storeName: 'todo',
    datastore,
    schema: myschema.definitions.todo
  })
  console.log('start')
  const saved = await store.save({
    id: NullId,
    title: 'aaa',
    done: false
  })
  const item = await store.find(saved.id)
  console.log('find', item)

  const items = await store.where({done: false})
  console.log('not done', items)

  // delete
  await store.delete(saved.id)

  t.pass()
})
