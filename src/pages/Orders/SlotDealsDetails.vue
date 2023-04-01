<template>

    <q-card-section>
      <q-table flat  color="primary" :loading="loading" :rows="items" row-key="id" :columns="columnsOrderProductSlotDetails"
        v-model:pagination="pagination" :filter="filters" @request="onRequest"
        :rows-per-page-options="[10, 15, 20, 50, 100, 150, 200, 500]" binary-state-sort
        :rows-per-page-label="$t(Utils.getKey('Records per page'))">
        <!-- header column -->
        <template v-slot:top>
            <!-- <q-btn @click="Back" class="q-mr-sm q-mt-xs q-px-md" dense color="primary">Back</q-btn>
            <span style="font-size:1.1rem">Order Product Slot Booked Details</span> -->
            <OrderNav :items="store.orderNav" @callback="Back" />
        </template>
        <template v-slot:header-cell="props">
          <q-th :props="props">
            {{
              props.col.label === "#"
                ? props.col.label
                : $t(Utils.getKey(props.col.label))
            }}
          </q-th>
        </template>
        <!-- no data -->
        <template v-slot:no-data>
          <q-icon style="margin-right: 5px" class="fas fa-exclamation-triangle" />
          {{ $t(Utils.getKey("No matching records found")) }}
        </template>
        <template v-slot:body-cell-sl="props">
          <q-td>
            {{ props.rowIndex + 1 }}
          </q-td>
        </template>

        <!-- product.translations['en'].name -->
        <template v-slot:body-cell-order_id>
          <q-td>
            {{ orderId }}
          </q-td>
        </template>
        <template v-slot:body-cell-product_name>
          <q-td>
            {{ productName }}
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td class="text-center">
            <q-chip size="sm" :label="$t(Utils.getKey(props.row.status.toUpperCase())).toUpperCase()"
              :color="getStatusColor(props)" :class="'text-white'" />
          </q-td>
        </template>
      </q-table>
    </q-card-section>
    <Loading :loading="loading" />
</template>

<script setup>
import { onMounted, reactive, ref, inject } from "vue";
import useOrders from "../../composables/useOrders";
import Utils from "../../helpers/Utils";

import Confirm from "../../components/Shared/Confirm.vue";
import Loading from "src/components/Shared/Loading.vue";
import { store } from '../../store/store'
import OrderNav from "./OrderNav.vue"
const props = defineProps({data:Object, orderId: String})
const emit = defineEmits(["back"])

const { columnsOrderProductSlotDetails, loading } = useOrders();

const locale = inject('locale')

const items = ref([...props.data.slot_deals])
const orderId = ref(props.data.order_table_id)
const productName = ref(props.data.product.translations[locale.value]?.name)
// const product = ref(props.product.product)

store.orderNav.push({
      id: 3,
      name: 'Product Slot Booked Details',
      icon: 'mdi-details'
})
// console.log('columnsOrderProductSlotDetails   items  =================', props.data.product.translations[locale.value]?.name)

const Back = (i) => {
  if(store.orderNav[store.orderNav.length-1].id == i.id){
    return;
  }
  store.orderNav.pop();
  emit("back", i)
}


const getStatusColor = (props) => {
  if (props.row.status === "confirmed") {
    return "positive";
  }

  if (props.row.status === "canceled") {
    return "negative";
  }

  return "warning";
};

</script>
