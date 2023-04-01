<template>
  <q-card :style="{
    width: $q.platform.is.mobile ? '100%' : '700px',
    maxWidth: '100%',
  }">
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("order update")) }}</span>
      <q-space />
      <q-btn dense flat icon="fas fa-times" @click="emit('onClose')" :disable="saving">
        <q-tooltip>{{ $t(Utils.getKey("Close")) }}</q-tooltip>
      </q-btn>
    </q-bar>
    <q-card-section class="q-pt-lg">
      <q-select :autofocus="true" outlined v-model="order.status" :options="options" :label="$t(Utils.getKey('status'))"
        dense  option-value="name" option-label="name" />
    </q-card-section>

    <!-- <q-card-section class="q-pt-lg">
      <q-input :autofocus="true" v-model="order.phone_number" :label="$t(Utils.getKey('Phone Number'))" dense outlined maxlength="20" />
    </q-card-section> -->

    <q-card-section class="text-right q-mt-md">
      <q-btn flat color="negative" class="q-px-md" @click="emit('onClose')" :disable="saving">{{
        $t(Utils.getKey("Cancel"))
      }}</q-btn>
      <q-btn color="accent" class="q-px-md q-ml-md" style="color: var(--q-primary) !important" @click="onSubmit"
        :disable="saving">{{
  $t(Utils.getKey("Save"))
        }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import useOrders from "src/composables/useOrders";
import Utils from "../../helpers/Utils";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps({ data: Object });
const emit = defineEmits(["onClose", "onUpdated"]);

const $q = useQuasar();
const { saving, updateStatus } = useOrders();
const order = ref({ ...props.data });

const options = [
  'reserved', 'confirmed', 'canceled', 'remaining', 'partial_confirmed'
]

async function onSubmit() {
  try {
    if (!Utils.containsOnlyCharacter(order.value.status)) {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("only character")),
      });
      return;
    }
    console.log('order ========== ', order.value)
    await updateStatus(order.value.id, { ...order.value });
    emit("onUpdated");
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
