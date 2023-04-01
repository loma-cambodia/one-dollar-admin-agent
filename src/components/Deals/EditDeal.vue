<template>
  <q-card :style="{
    width: $q.platform.is.mobile ? '100%' : '700px',
    maxWidth: '100%',
  }">
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("edit_deals_data")) }}</span>
      <q-space />
      <q-btn dense flat icon="fas fa-times" @click="emit('onClose')" :disable="saving">
        <q-tooltip>{{ $t(Utils.getKey("Close")) }}</q-tooltip>
      </q-btn>
    </q-bar>
    <q-card-section class="q-pt-lg">
      <q-input :autofocus="true" v-model="deal.slot_price" :label="$t(Utils.getKey('slot_price'))" dense outlined
        maxlength="20" lazy-rules :rules="[
          val => !!val || $t(Utils.getKey('Field is required')),
        ]" />
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-input :autofocus="true" v-model="deal.deal_price" :label="$t(Utils.getKey('deal_price'))" dense outlined
        maxlength="20" lazy-rules :rules="[
          val => !!val || $t(Utils.getKey('Field is required')),
        ]" />
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-select v-model="deal.status" :options="dealStatus" outlined :label="$t(Utils.getKey('deal_status'))" dense
        emit-value :rules="[
          (val) => !!val || $t(Utils.getKey('Field is required'))
        ]">
      </q-select>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-select v-model="deal.is_bot" :options="botStatus" outlined :label="$t(Utils.getKey('bot_status'))" dense
      map-options use-chips option-value="id" option-label="name"
        emit-value :rules="[
          (val) => !!val || $t(Utils.getKey('Field is required'))
        ]">
      </q-select>
    </q-card-section>

    <q-card-section class="text-right q-mt-md">
      <q-btn flat color="negative" class="q-px-md" @click="emit('onClose')" :disable="savings">{{
        $t(Utils.getKey("Cancel"))
      }}</q-btn>
      <q-btn color="accent" class="q-px-md q-ml-md" style="color: var(--q-primary) !important" @click="onSubmit"
        :disable="savings">{{
  $t(Utils.getKey("Save"))
        }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import useDeals from "src/composables/useDeals";
import Utils from "../../helpers/Utils";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps({ data: Object });
const emit = defineEmits(["onClose", "onUpdated"]);

const $q = useQuasar();
const { saving, update } = useDeals();
const { savings, updates } = useDeals();
const deal = ref({ ...props.data });
const dealStatus = ref([
  'active', 'inactive', 'settled'
]);

const botStatus = ref([{
  id: 0,
  name: "inactive"
},
{
  id: 1,
  name: "active"
}]
);

async function onSubmit() {
  try {
    if (deal.value.slot_price == "" || deal.value.deal_price == "") {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey('Field is required')),
      });
      return;
    }

    await updates({ ...deal.value });
    emit("onUpdated");
    emit("onClose");
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("updated successfully")),
    });

  } catch (err) {
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey(err.message.toString())),
    });
  }
}
</script>

<style>

</style>
