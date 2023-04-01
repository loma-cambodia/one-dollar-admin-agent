<template>
  <q-card style="margin-left: 0px; box-shadow: none; min-height: 85vh" v-if="!viewOrderDetials">

    <q-card-section>
      <q-table flat   color="primary" :loading="loading" :rows="items" row-key="id"
        :columns="columnsOrderDetails" v-model:pagination="pagination" :filter="filters" @request="onRequest"
        :rows-per-page-options="[10, 15, 20, 50, 100, 150, 200, 500]" binary-state-sort
        :rows-per-page-label="$t(Utils.getKey('Records per page'))">
        <template v-slot:top>
          <OrderNav :items="store.orderNav" @callback="Back" />
        </template>
        <!-- header column -->
        <template v-slot:header-cell="props">
          <q-th :props="props">
            {{
              props.col.label === "#"
                ? props.col.label
                : $t(Utils.getKey(props.col.label))
            }}
          </q-th>
        </template>
        <!-- row.product_slot_deals[0].slot_deals_count -->
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

        <template v-slot:body-cell-amount="props">
          <q-td class="text-center">
            {{ props.row.amount }} USD
          </q-td>
        </template>

        <!-- product.translations['en'].name -->
        <template v-slot:body-cell-product_name="props">
          <q-td>
            {{ props.row?.product?.translations[locale]?.name }}
          </q-td>
        </template>

        <template v-slot:body-cell-booked_slots="props">
          <q-td class="text-center">
            <!-- <span @click="viewOrderSlotDetials(props.row)" class="pointer">
              <q-chip size="sm" :label="props.row?.slot_deals_counts" />
            </span> -->
            <span>
              <q-chip size="sm" :label="props.row?.slot_deals_counts" />
            </span>
               <span class="pointer" @click="onsShowOrderSlot(props.row)">
              <q-icon
                name="mdi-eye"
                size="xs"
                class="blue r_50 b_l_blue"
              ></q-icon>
            </span>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td class="text-center">
            <q-chip size="sm" :label="$t(Utils.getKey(getStatusText(props)))"
              :color="getStatusColor(props)"  />
          </q-td>
        </template>
      </q-table>
    </q-card-section>
    <Loading :loading="isLoading" />
  </q-card>
  <q-card v-else  style="margin-left: 0px; box-shadow: none; min-height: 85vh" >
    <SlotDealsDetails :data="selectedOrderProduct" @back="Back" />

  </q-card>
  <Loading :loading="loading" />

  <q-dialog v-model="showPayment" persistent>
    <confirm @confirm="onPayment" @onUpdated="onRefresh" @cancel="showPayment = false"
      message="Are you sure you want to Confirm this payment ?" :button-label="$t(Utils.getKey('Payment'))" />
  </q-dialog>
    <q-dialog v-model="onShowSlot" persistent>
    <OrderListBootSlotList :data="selectedOrderProduct" @onClose="onShowSlot = false" />
  </q-dialog>
</template>

<script setup>
import { onMounted, reactive, ref, inject, watch } from "vue";
import useTable from "../../composables/useTable";
import useOrders from "../../composables/useOrders";
import Utils from "../../helpers/Utils";

import Confirm from "../../components/Shared/Confirm.vue";
import Loading from "src/components/Shared/Loading.vue";
import OrderListBootSlotList from './OrderListBootSlotList.vue'
import SlotDealsDetails from "./SlotDealsDetails.vue";
import OrderNav from "./OrderNav.vue"
import { store } from '../../store/store'
const navId = ref(0)

store.orderNav = [
{
      id: 1,
      name: 'Back',
      icon: 'mdi-backburger'
    },
    {
      id: 2,
      name: props.data.order_id,
      icon: 'mdi-order-bool-descending-variant'
    }
]

const props = defineProps({ data: Object })
const emit = defineEmits(["back"])
const viewOrderDetials = ref(false)
const { columnsOrderDetails, loading, get } = useOrders();

const locale = inject('locale')

const items = ref([])
const orderId = ref(props.data.id)
const isLoading = ref(false)
const selectedOrderProduct = ref();

const getStatusText = (props) => {
  if (props.row.status === "reserved") {
    return "upaid";
  }

  if (props.row.status === "remaining") {
    return "paid";
  }

  if (props.row.status === "canceled") {
    return "cancelled";
  }

  return "paid";
};

onMounted(async ()=>{
  isLoading.value = true
  let res = await get(orderId.value)
  items.value = res.data.data;
  isLoading.value = false
})

console.log('locale   ',locale.value)

const Back = (i) => {
  viewOrderDetials.value = false
  navId.value = i.id
  if(store.orderNav[store.orderNav.length-1].id == i.id){
    return;
  }
  emit("back")
}
watch(() => navId, () => {
  if(navId.value == 1){
      emit("back")
  }
})

watch(() => locale.value, () =>{
  console.log('locale  watch ',locale.value)
})
const onShowSlot = ref(false)

const onsShowOrderSlot = (row) => {
  onShowSlot.value = true
  selectedOrderProduct.value = row
}

const viewOrderSlotDetials = (row) => {
  selectedOrderProduct.value = row
  viewOrderDetials.value = true
}




const getStatusColor = (props) => {
  if (props.row.status == "reserved") {
    return "b_l_blue blue";
  }
  if (props.row.status == "remaining") {
    return "b_l_orange orange";
  }

  if (props.row.status == "canceled") {
    return "red b_l_red";
  }
  return "b_l_green green2";
};

</script>
