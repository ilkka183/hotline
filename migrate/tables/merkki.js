function insert(destination, items) {
  for (const item of items) {
    const row = {
      Id: item.M_ID,
      Name: item.M_MERKKI
    }

    destination.insert('Make', row);
  }
}

module.exports = insert;
 