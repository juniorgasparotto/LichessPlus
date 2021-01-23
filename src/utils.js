Array.prototype.last = function () {
  return this[this.length - 1];
}

Array.prototype.groupBy = function (groupingKeyFn) {
  if (typeof groupingKeyFn !== 'function') {
    throw new Error("groupBy take a function as only parameter");
  }
  return this.reduce((result, item) => {
    let key = groupingKeyFn(item);
    if (!result[key])
      result[key] = [];
    result[key].push(item);
    return result;
  }, {});
};

Array.prototype.sum = function (propertySelector = obj => obj) {
  const intialValue = 0;
  return this.reduce((sum, obj) => sum + propertySelector(obj), intialValue);
};