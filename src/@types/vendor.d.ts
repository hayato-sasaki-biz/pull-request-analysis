export {}

type Any = any

declare global {
  namespace NodeJS {
    interface Global extends Any { }
  }
}
