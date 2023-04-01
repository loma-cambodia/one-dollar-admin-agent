<template>
  <q-card :style="{
    width: $q.platform.is.mobile ? '100%' : '700px',
    maxWidth: '100%',
  }">
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Select Winner Option")) }}</span>
      <q-space />
      <q-btn dense flat icon="fas fa-times" @click="emit('onClose')" :disable="saving">
        <q-tooltip>{{ $t(Utils.getKey("Close")) }}</q-tooltip>
      </q-btn>
    </q-bar>
    <q-separator />
    <q-card-section class="q-pt-md">
    <!-- <span>{{ $t(Utils.getKey("Select Winner Option")) }}</span> -->
      <div class="q-pt-md">
        <div class="q-gutter-sm">
          <q-radio v-model="deals.winner_option" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="auto"
            label="Auto" />
          <q-radio v-model="deals.winner_option" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="1"
            label="Customer" />
          <q-radio v-model="deals.winner_option" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="2"
            label="Bot" />
        </div>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section class="text-right q-mt-md">
      <q-btn flat color="negative" class="q-px-md" @click="emit('onClose')" :disable="saving">{{
        $t(Utils.getKey("Cancel"))
      }}</q-btn>
      <q-btn color="accent" style="color: var(--q-primary) !important" class="q-px-md q-ml-md" @click="onSubmit"
        :disable="saving">{{ $t(Utils.getKey("Save")) }}</q-btn>
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
const emit = defineEmits(["onClose", "onUpdated"]);
const props = defineProps({ data: Object });
const $q = useQuasar();
const { saving, winnerSelect } = useDeals();
const deals = ref({...props.data, winner_option: ''});

async function onSubmit() {
  try {
    if (!deals.value.winner_option) {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-check",
        message: t(Utils.getKey("Need to select Winning Option")),
      });
      return;
    }
    if(deals.value.winner_option=='auto')
    deals.value.winner_option= ""
    deals.value.deal_id = deals.value.id
    const data = {
      deal_id : deals.value.id,
      winner_option : deals.value.winner_option,
    }
    await winnerSelect(data);
    emit("onUpdated");
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("created successfully")),
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
