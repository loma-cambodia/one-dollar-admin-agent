<template>
  <q-page :class="!store.leftDrawerOpen ? 'ml-5' : ''">
      <q-card class="pa-3 mt-4">
          <All />
        <!-- <div style="">
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="white"
            indicator-color="primary"
            align="center"
          >
            <q-tab name="All" :label="$t('all')"></q-tab>
            <q-tab name="Reserved" :label="$t('reserved')"></q-tab>
            <q-tab name="Confirmed" :label="$t('confirmed')"></q-tab>
            <q-tab name="Canceled" :label="$t('canceled')"></q-tab>
            <q-tab name="partial" :label="$t('partial')"></q-tab>
          </q-tabs>
        </div>

        <KeepAlive>
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel class="pa-0" name="All">
              <All />
            </q-tab-panel>
            <q-tab-panel class="pa-0" name="Confirmed">
              <Confirmed status="confirmed" />
            </q-tab-panel>
            <q-tab-panel class="pa-0" name="Reserved">
              <Reserved />
            </q-tab-panel>
            <q-tab-panel class="pa-0" name="Canceled">
              <Canceled />
            </q-tab-panel>
            <q-tab-panel class="pa-0" name="partial">
              <Confirmed status="remaining" />
            </q-tab-panel>
          </q-tab-panels>
        </KeepAlive> -->
      </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import All from "./All.vue";
import Reserved from "./Reserved.vue";
import Confirmed from "./Confirmed.vue";
import Canceled from "./Canceled.vue";
import { store } from "../../store/store";
const tab = ref("All");
</script>
<style scoped>
.q-tabs--dense .q-tab {
  min-height: 40px;
  border: 1px solid #e9e5e5;
  margin: 3px;
}
.q-tab__indicator {
  background-color: #f46932 !important;
}
</style>
