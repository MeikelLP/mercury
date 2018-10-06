import { translate } from '../filters'
import OPERATION_TYPES from '../../config/operation-types'
import OPERATION_STATES from '../../config/operation-states'


/**
 * Translates a configuration name to its equivalent.
 * @param obj {string|*} Object (with 'name' as property) or String.
 * @returns {string} The translated string
 */
export function configTranslation (obj) {
  let name
  if (obj instanceof Object) {
    name = obj.name
  } else {
    name = obj + ""
  }
  return name.startsWith('$')
    ? translate(name.replace('$', ''))
    : name
}

export function translateOperationType (key){
  const type = OPERATION_TYPES.filter(x => x.key === key)[0]

  return type ? configTranslation(type.name) : key
}

export function translateOperationState (key){
  const state = OPERATION_STATES.filter(x => x.key === key)[0]

  return state ? configTranslation(state.name) : key
}
