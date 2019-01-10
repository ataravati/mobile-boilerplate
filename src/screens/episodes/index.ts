// This is needed for the Realm import to work
// https://github.com/realm/realm-js/issues/1509
if ((global as any).self === undefined) {
  (global as any).self = global;
}

export { Episodes } from "./episodes";
