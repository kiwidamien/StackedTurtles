const cumsum = (array) => {
  const new_array = [];
  array.reduce( (runningSum, term, index) => {
    new_array[index] = runningSum + term;
    return new_array[index];
  }, 0);
  return new_array;
}

const getPositiveRate = (array) => {
  const total = array.reduce((a,b) => a+b);
  const cumulative = [0].concat(cumsum(array));
  return cumulative.map( doesCount => (total - doesCount)/total );
}

const truePositiveRate = (array) => getPositiveRate(array);
const falsePositiveRate = (array) => {
  return getPositiveRate(array.map(x => !x));
}

const getTally = (people, threshold, modelNumber) => {
  const payback = {accepted: 0, total: 0};
  const noPayback = {accepted: 0, total: 0};
  Object.values(people).forEach(
    person => {
      const obj = (person.payback ? payback : noPayback);
      if (person.score[modelNumber] >= threshold) {
        obj.accepted += 1
      }
      obj.total += 1;
    });
  const numRejected = payback.total - payback.accepted +
                      noPayback.total - noPayback.accepted;
  return {payback, noPayback, numRejected};
}

const getPlayerOrder = (people, modelNumber) => {
  return Object.values(people)
               .sort((a,b) => a.score[modelNumber] - b.score[modelNumber])
               .map(person => person.payback);
}
