import { useSnapshot } from 'valtio'

export function useStore<T extends object>(store: T) {
  const snapshot = useSnapshot(store)
  return new Proxy(snapshot, {
    set(obj, prop, value, receiver) {
      store[prop as keyof typeof store] = value
      return true
    },
    get: function (target, prop, receiver) {
      if (typeof Reflect.get(target, prop, receiver) === 'function') {
        return function (...args: any) {
          //@ts-ignore
          return target[prop].apply(store, args)
        }
      } else {
        return target[prop as keyof typeof target]
      }
    },
  })
}
