/* @flow */
import test from 'ava'
import * as admin from 'firebase-admin'
import Store, {NullId} from '../firebase-store'
import {firebaseConfig} from './firebase-config'

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: firebaseConfig.databaseURL
})

type Todo = {
  id: string,
  title: string,
  done: boolean
}

// test('firebase-store', async t => {
test('firebase-store', async t => {
  const todoStore: Store<Todo> = new Store({
    refPath: `todos/testUser`,
    firebase: admin
  })
  todoStore.observeAll().subscribe(items => {
    console.log('all', items)
  })

  // await todoStore.clear(true)
  const saved = await todoStore.save({
    id: NullId,
    title: 'Eat meal',
    done: false
  })
  console.log(saved)

  // await todoStore.replace({...saved, done: true})
  await todoStore.update(Object.assign({}, saved, {
    done: true
  }))
  const todo = await todoStore.find(saved.id)
  console.log(todo)
  const all = await todoStore.all()
  console.log(all)
  t.pass()
})
