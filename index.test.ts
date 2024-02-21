import { LinkedList, Structure } from './index'

// Реализовать двусторонний двусвязный список
test('01 Doubly linked list', () => {
  const list = new LinkedList()

  list.add(1)
  list.add(2)
  list.add(3)
  list.add(4)

  expect(list?.first?.value).toEqual(1) // 1
  expect(list?.last?.value).toEqual(4) // 4
  expect(list?.first?.next?.value).toEqual(2) // 2
  expect(list?.first?.next?.prev?.value).toEqual(1) // 1
  expect(list?.last?.prev?.prev?.prev?.value).toEqual(1) // 1
})

// Сделать связанный список итерируемым
test('02 Doubly linked list (iterable)', () => {
  const list = new LinkedList()

  list.add(1)
  list.add(2)
  list.add(3)
  list.add(4)

  const expectedValues = [1, 2, 3, 4]
  const actualValues = []
  let counter = 0

  for (const value of list) {
    ++counter
    actualValues.push(value)
  }

  expect(counter).toEqual(expectedValues.length)
  expect(actualValues).toEqual(expectedValues)
})

// Реализовать структуру на основе ArrayBuffer
test('03 Structure based on Array Buffer', () => {
  const jackBlack = new Structure([
    ['name', 'utf16', 4], // Число - это максимальное количество символов
    ['lastName', 'utf16', 5],
    ['age', 'u16'], // uint16
  ])

  jackBlack.set('name', 'Jack')
  jackBlack.set('lastName', 'Black')
  jackBlack.set('age', 53)

  expect(jackBlack.get('name')).toEqual('Jack') // 'Jack'
  expect(jackBlack.get('lastName')).toEqual('Black') // 'Black'
  expect(jackBlack.get('age')).toEqual(53) // 53
})
