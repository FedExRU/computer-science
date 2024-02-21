export interface ILinkedList {
  first: IListItem | null
  last: IListItem | null

  add: (value: IListItem['value']) => void
}

export interface IListItem {
  value: number

  prev: IListItem | null
  next: IListItem | null
}

export class ListItem implements IListItem {
  value: number

  prev: IListItem | null = null
  next: IListItem | null = null

  constructor(value: IListItem['value']) {
    this.value = value
  }
}

export class LinkedList implements ILinkedList {
  first: IListItem | null = null
  last: IListItem | null = null

  /**
   * Добавление нового элемента в конец списка
   *
   * @param value значение элемента связанного списка
   */
  add(value: IListItem['value']) {
    const listItem = new ListItem(value)

    // Новый добавленный элемент автоматически становится последним
    this.last = listItem

    if (this.first === null) {
      // Если связанный список был пуст, то новый добавленный элемент становится первым
      this.first = listItem
    } else {
      // Цикл идет с первого элемента списка
      let currentListItem: IListItem = this.first

      // Цикл идет пока мы не дойдем до "головы" связанного списка
      while (currentListItem !== this.last) {
        if (currentListItem.next === null) {
          // Новый элемент связанного списка в качестве предыдущего элемента принимает ссылку на текущий элемент списка
          listItem.prev = currentListItem
          // Текущий элемент связанного списка в качестве следующего элемента принимает ссылку на новый элемент списка
          currentListItem.next = listItem
        } else {
          // Иначе двигаемся далее по списку
          currentListItem = currentListItem.next
        }
      }
    }
  }

  [Symbol.iterator]() {
    let currentListItem: IListItem | null | undefined = this.first
    return {
      next() {
        if (currentListItem !== null) {
          const value = currentListItem?.value
          currentListItem = currentListItem?.next

          return { value, done: false }
        }

        return { done: true }
      },
    }
  }
}

type Encoding = 'utf16' | 'u16'

type Value = string | number

type Meta = {
  [x: string]: Encoding
}

type StructureConstructorArgs = [string, Encoding, number] | [string, Encoding]

interface IStructure {
  meta: Meta
  set: (key: string, value: Value) => void
  get: (key: string) => Value
}

interface ISetter {
  set: (value: Value) => void
}

class Setter {
  view: Uint16Array

  constructor(view: Uint16Array) {
    this.view = view
  }
}

class Utf16Setter extends Setter implements ISetter {
  set(value: Value) {
    for (let i = 0; i < (value as string).length; i++) {
      this.view[i] = (value as string).charCodeAt(i)
    }
  }
}

class Uint16Setter extends Setter implements ISetter {
  set(value: Value) {
    this.view[0] = value as number
  }
}

class SetterFabric {
  static getSetter(view: Uint16Array, encoding: Encoding) {
    switch (encoding) {
      case 'utf16':
        return new Utf16Setter(view)
      case 'u16':
        return new Uint16Setter(view)
    }
  }
}

interface IGetter {
  get: () => Value
}

class Getter {
  view: Uint16Array

  constructor(view: Uint16Array) {
    this.view = view
  }
}

class Utf16Getter extends Getter implements IGetter {
  get() {
    return String.fromCharCode(...this.view)
  }
}

class Uint16Getter extends Getter implements IGetter {
  get() {
    return this.view[0]
  }
}

class GetterFabric {
  static getGetter(view: Uint16Array, encoding: Encoding) {
    switch (encoding) {
      case 'utf16':
        return new Utf16Getter(view)
      case 'u16':
        return new Uint16Getter(view)
    }
  }
}

export class Structure implements IStructure {
  meta: Meta = {}

  constructor(args: StructureConstructorArgs[]) {
    for (let i = 0; i < args.length; i++) {
      const [key, encoding, length] = args[i]

      const buffer = new ArrayBuffer(
        (length || 2) * (encoding === 'utf16' ? 2 : 1),
      )

      // eslint-disable-next-line
      // @ts-ignore
      this[key] = new Uint16Array(buffer)

      this.meta[key] = encoding
    }
  }

  set(key: string, value: string | number) {
    // eslint-disable-next-line
    // @ts-ignore
    const view: Uint16Array = this[key]
    const setter = SetterFabric.getSetter(view, this.meta[key])

    setter.set(value)
  }

  get(key: string) {
    // eslint-disable-next-line
    // @ts-ignore
    const view: Uint16Array = this[key]
    const getter = GetterFabric.getGetter(view, this.meta[key])

    return getter.get()
  }
}
