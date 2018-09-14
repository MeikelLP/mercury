export function groupBy (list, getter) {
  // modified version of https://stackoverflow.com/a/34890276/8321861
  return list.reduce(function(rv, x) {
    (rv[getter(x)] = rv[getter(x)] || []).push(x);
    return rv;
  }, {});
}
