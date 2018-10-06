import { exec } from '../services/DatabaseService'
import OPERATION_STATES from './../../config/operation-states'

export function search () {
  return exec('SELECT * FROM OPERATION')
}

export function getStateObjectForStateKey (state) {
  // convert legacy states to new states
  switch (state) {
    case 'fa-check-circle':
      state = 'verified'
      break;
    case 'fa-circle':
      state = 'checked'
      break;
    case 'fa-circle-o':
      state = 'registered'
      break;
  }

  const possibleStates = OPERATION_STATES.filter(x => x.key === state)

  // fallback
  if (possibleStates.length === 0) {
    return {name: 'Unkown', icon: 'question', key: 'unkown' }
  }

  return possibleStates[0]
}
