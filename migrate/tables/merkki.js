function text(value) {
  return value ? value : undefined;
}

function insert(destination, items) {
  for (const item of items) {
    const row = {
      Id: item.M_ID,
      Name: text(item.M_MERKKI)
    }

    destination.insert('Make', row);
  }
}

module.exports = insert;
 