export function paginateItems(items, pageNumber, pageSize) {
  const startIndex = (pageNumber - 1)*pageSize;
  const slice = [];

  for (let i = 0; i < pageSize; i++) {
    const index = startIndex + i;

    if (index >= items.length)
      break;

    const item =  items[index];
    slice.push(item);
  }

  return slice;
}