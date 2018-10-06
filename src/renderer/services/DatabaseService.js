import { Db } from '../store'

export function exec (sql) {
  const response = Db.sql.exec(sql)[0]
  if (response === undefined) {
    return []
  }
  return sqlResponseToObject(response)
}

function sqlResponseToObject (response) {
  const obj = []
  for (let i = 0; i < response.values.length; i++) {
    obj[i] = {}
    for (let j = 0; j < response.columns.length; j++) {
      obj[i][response.columns[j]] = response.values[i][j]
    }
  }
  return obj
}
