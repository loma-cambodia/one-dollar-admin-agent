<template>
  <q-card :style="{
    width: $q.platform.is.mobile ? '100%' : '700px',
    maxWidth: '100%',
  }">
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("total_slots"))   }} <span class="text-bold">{{props.data.slot_deals.length}}</span></span>
      <q-space />
      <q-btn dense flat icon="fas fa-times" @click="emit('onClose')" :disable="saving">
        <q-tooltip>{{ $t(Utils.getKey("Close")) }}</q-tooltip>
      </q-btn>
    </q-bar>
    <q-card-section class="q-pt-lg">
      <dv class="row">
        <div style="margin-bottom: 10px;" class="col-md-3 col-xs-3 r_4 ma-1 mx-2 q-pt-lg border pa-2" v-for="pro in props.data.slot_deals" :key="pro.id">
          <span>{{pro.booking_id}}</span>
        </div>
      </dv>
    </q-card-section>
  </q-card>
</template>

<script setup>
  import { ref, watch, onMounted, inject, computed } from "vue";
  import { useQuasar } from "quasar";
  import Utils from "../../helpers/Utils";
  const emit = defineEmits(["onBack"])
  const props = defineProps({data:Object})
  console.log('props.data   ',props.data)
</script>

<style>
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
/* td, th{
  border: 1px solid #c3c3c3;
  padding: 6px;
  border-radius: 2px;
} */
table{
  border-collapse: collapse;
}
</style>
