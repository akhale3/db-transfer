'use strict';

const csvtojson = require('csvtojson');
const assert = require('assert');
const jsonTable = require('json-table');

const _map = json => {
  let map = {};

  json.forEach(obj => {
    map[obj.id] = obj.hash;
  });

  return map;
};

const compare = () => {
  const left = process.env.FILE_ONE;
  assert.ok(left, 'Missing FILE_ONE path');

  const right = process.env.FILE_TWO;
  assert.ok(right, 'Missing FILE_TWO path');

  const rawOutput = !!process.env.RAW;

  return csvtojson()  // Convert left CSV to JSON
  .fromFile(left)
  .then(leftJSON => { // Convert right CSV to JSON
    return Promise.all([
      Promise.resolve(leftJSON),
      csvtojson().fromFile(right)
    ]);
  })
  .then(leftRightJSON => {  // Reduce left and right JSON to { id, hash } pairs
    const leftJSON = leftRightJSON[0].map(leftVal => {
      return {
        id: leftVal.id,
        hash: leftVal.hash
      };
    });
    const rightJSON = leftRightJSON[1].map(rightVal => {
      return {
        id: rightVal.id,
        hash: rightVal.hash
      };
    });

    return Promise.all([
      leftJSON,
      rightJSON
    ]);
  })
  .then(leftRightMap => { // Compare for outliers
    const leftMap = _map(leftRightMap[0]);
    const rightMap = _map(leftRightMap[1]);
    const outliers = [];

    Object.keys(leftMap).forEach(leftId => {
      // Filter canceled cards from left
      if (leftMap[leftId].indexOf('cancel_') !== -1) {
        return;
      }

      if (!rightMap[leftId]) { // id not present in right
        outliers.push({
          id: leftId,
          hash: leftMap[leftId],
          missing: true
        });
      } else if (leftMap[leftId] !== rightMap[leftId]) { // left hash !== right hash
        outliers.push({
          id: leftId,
          hash: leftMap[leftId],
          missing: false
        });
      }
    });

    if (rawOutput) {
      console.log(outliers);
    } else {
      new jsonTable(outliers, table => {
        table.show();
      });
    }
  })
  .catch(e => {
    console.error(e);
  });
};

exports.compare = compare;
