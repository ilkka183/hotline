<script>
export default {
  props: {
    table: { type: Object, required: true }
  },
  computed: {
    dataset() {
      return this.table.dataset;
    }
  }
}
</script>
