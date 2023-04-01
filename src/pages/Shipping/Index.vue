<template>
  <q-page :class="!store.leftDrawerOpen ? 'ml-5' : '' ">
  <keep-alive>
    <q-card class="pa-3 mt-4">
      <!-- <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="white"
        indicator-color="primary"
        align="left"
      >
        <q-tab name="order_delivery" :label="$t('order_delivery')" ></q-tab>
        <q-tab name="delivery_tracking" :label="$t('delivery_tracking')" ></q-tab>
      </q-tabs>
      <q-separator></q-separator>
      <q-tab-panels v-model="tab"  animated>
        <q-tab-panel class="pa-0" name="order_delivery">
          <order-delivery/>
        </q-tab-panel>

        <q-tab-panel class="pa-0" name="delivery_tracking">
          <delivery-tracking/>
        </q-tab-panel>
      </q-tab-panels> -->
        <order-delivery/>
    </q-card>
  </keep-alive>

  </q-page>
</template>

<script setup>
import { ref, inject, computed } from "vue";
import Utils from "../../helpers/Utils";
import {store} from '../../store/store'
import DeliveryTracking from './DeliveryTracking'
import OrderDelivery from './OrderDelivery'
const tab = ref('order_delivery')
</script>
