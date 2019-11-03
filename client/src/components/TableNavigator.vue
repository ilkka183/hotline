<template>
  <div class="navigator">
    <button @click="table.startAdd">Lisää uusi</button>
    <button @click="table.refresh">Päivitä</button>
    <template v-if="table.pageCount > 1">
      <button :disabled="table.pageNumber == 1" @click="table.firstPage">Ensimmäinen</button>
      <button :disabled="table.pageNumber == 1" @click="table.prevPage">Edellinen</button>
      <button v-for="number in table.pageCount" :key="number" :disabled="table.pageNumber == number" @click="table.setPageNumber(number)">{{number}}</button>
      <button :disabled="table.pageNumber == table.pageCount" @click="table.nextPage">Seuraava</button>
      <button :disabled="table.pageNumber == table.pageCount" @click="table.lastPage">Viimeinen</button>
      <span class="number">sivu {{table.pageNumber}}/{{table.pageCount}}</span>
    </template>
  </div>
</template>

<script>
import TableComponent from './TableComponent';

export default {
  extends: TableComponent,
  methods: {
  }
}
</script>

<style>
button:disabled {
/*  background-color: transparent;
  border-color: transparent; */
}

.navigator button {
  margin-right: 4px
}

.number {
  padding-left: 5px;
  padding-right: 5px;
}
</style>