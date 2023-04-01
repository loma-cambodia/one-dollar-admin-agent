<template>
  <q-card :style="{
    width: $q.platform.is.mobile ? '100%' : '600px',
    maxWidth: '100%',
  }">
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Product id and deal id")) }}</span>
      <q-space />
      <q-btn dense flat icon="fas fa-times" @click="emit('onClose')" :disable="saving">
        <q-tooltip>{{ $t(Utils.getKey("Close")) }}</q-tooltip>
      </q-btn>
    </q-bar>
    <q-card-section class="q-pt-lg">
      <table style="width: 100%;" class="c_table">
        <tr>
          <th class="text-left">{{$t('deal_id')}}</th>
          <th class="text-left">{{$t('product_sku')}}</th>
        </tr>
        <tr v-for="pro in items" :key="pro.id">
          <td>{{pro?.deal_id}}</td>
          <td>{{pro.product?.sku}}</td>
        </tr>
      </table>
    </q-card-section>
  </q-card>
</template>

<script setup>
  import { ref, watch, onMounted, inject, computed } from "vue";
  import { useQuasar } from "quasar";
  import Utils from "../../helpers/Utils";
  import useOrders from "../../composables/useOrders";
  const { get } = useOrders();

  const emit = defineEmits(["onBack"])
  const props = defineProps({data:Object})
  const items = ref([])
  const orderId = ref(props.data.id)
  // console.log(props.data)




onMounted(async ()=>{
  let res = await get(orderId.value)
  items.value = res.data.data;
})


</script>

<style scoped>
.d_icon {
  cursor: pointer;
  top: 1px;
  z-index: 1000;
  font-size: 22px;
  position: absolute;
  left: 1px;
  background: gray;
  padding: 8px;
}

.card_img {
  position: relative;
  box-shadow: 0px 3px 5px 8px rgb(0 0 0 / 15%);
  margin: 10px;
}

.c_table {
    border-collapse:separate;
    border:solid #c3c3c3 1px;
    border-radius:6px;
}

.c_table td, th {
    border-left:solid #c3c3c3 1px;
    border-top:solid #c3c3c3 1px;
}

.c_table th {
    padding: 4px;
    background-color: #dfdddd;
    border-top: none;
}

.c_table td {
     border-left: solid #c3c3c3 1px;
     border-right: none;
     padding: 4px;
  }
.c_table tr:last-child td {
    border-bottom: none;
}
.c_table tr  td:first-child {
    border-left:none !important;
}
</style>
