export function hasAccounts (db) {
  try {
    return db.exec('SELECT count(1) FROM accounts')[0] > 0
  }catch (e) {
    return false
  }
}

export default {
  hasAccounts
}
