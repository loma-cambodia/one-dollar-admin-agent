<template>
  <div class="col-md-12 col-sm-12 col-xs-12">
    <q-bar dark class="chart-qbar q-py-lg">
      <span class="text-body1">{{
        $t(Utils.getKey("cdxfgcxdvdfgvdf"))
      }}</span>
    </q-bar>
    <q-card-section
      class="q-pa-md bordered"
      style="border: 1px solid #ebeef5 !important"
    >

    </q-card-section>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import Utils from "src/helpers/Utils";
import useStats from "../../composables/useStats";
import useTable from "../../composables/useTable";

const {
  transactionLoading,
  transactionColumns,
  transactionItems,
  getRecentTransactions,
} = useStats();
const { pagination, onRequest } = useTable(getRecentTransactions);

onMounted(() => {
  onRequest({
    pagination: { ...pagination.value, rowsPerPage: 10 },
    filter: undefined,
  });
});
</script>
