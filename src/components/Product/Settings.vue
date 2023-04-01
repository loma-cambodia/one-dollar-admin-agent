<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '800px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Product Settings")) }}</span>
      <q-space />
      <q-btn
        dense
        flat
        icon="fas fa-times"
        @click="emit('onClose')"
        :disable="saving"
      >
        <q-tooltip>{{ $t(Utils.getKey("Close")) }}</q-tooltip>
      </q-btn>
    </q-bar>
    <q-card-section class="q-pt-lg">
      <p class="text-bold mb-0 mt-3">{{ $t(Utils.getKey("Slot Settings")) }}</p>
      <q-separator />

      <div style="padding: 12px; background: #f5efeb" class="row q-mt-xs">
        <div class="col-12 col-md-4 q-pr-md">
          <label>{{ $t(Utils.getKey("Total Slots")) }}</label>
          <q-input
            v-model="slot.total_slots"
            type="number"
            dense
            outlined
            :oninput="numberValidation"
            lazy-rules
            :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
          />
        </div>
        <div class="col-12 col-md-4 q-pr-md">
          <label>{{ $t(Utils.getKey("Sale Price")) }}</label>
          <q-input
            v-model="slot.sale_price"
            type="number"
            dense
            :oninput="numberValidation"
            readonly
            outlined
            lazy-rules
            :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
          />
        </div>
        <div class="col-12 col-md-4 q-pr-md">
          <label>{{ $t(Utils.getKey("Price")) }}</label>
          <q-input
            v-model="price"
            type="number"
            dense
            :oninput="numberValidation"
            readonly
            outlined
            lazy-rules
            :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
          />
        </div>
      </div>

      <p class="text-bold mb-0 mt-3">
        {{ $t(Utils.getKey("Deals Settings")) }}
      </p>
      <q-separator />
      <div style="padding: 12px; background: #f5efeb" class="row q-mt-xs">
        <div class="col-12 col-md-4 q-pr-md">
          <label>{{ $t(Utils.getKey("slot price")) }}</label>
          <q-input
            v-model="slot.slot_price"
            type="number"
            dense
            outlined
            :oninput="numberValidation"
            lazy-rules
            :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
          />
        </div>
        <div class="col-12 col-md-4 q-px-md">
          <label>{{ $t(Utils.getKey("deal price")) }}</label>
          <q-input
            type="number"
            v-model="slot.deal_price"
            :oninput="numberValidation"
            dense
            outlined
            lazy-rules
            :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
          />
        </div>
        <div class="col-12 col-md-4 q-px-md">
          <label
            >{{ $t(Utils.getKey("time period")) }} ({{
              $t(Utils.getKey("hours"))
            }})</label
          >
          <q-input
            type="number"
            v-model="slot.time_period"
            dense
            outlined
            :oninput="numberValidation"
            maxlength="12"
            lazy-rules
            :rules="[
              (val) => !!val || $t(Utils.getKey('Field is required')),
              (val) => val > 0 || $t(Utils.getKey('Allow only decimal numbers')),
              (val) => Utils.containsOnlyNumbers(val) || $t(Utils.getKey('Allow only decimal numbers')),
            ]"
          />
        </div>
      </div>
    </q-card-section>

    <q-card-section class="text-right q-mt-md">
      <q-btn
        flat
        color="negative"
        class="q-px-md"
        @click="emit('onClose')"
        :disable="saving"
        >{{ $t(Utils.getKey("Cancel")) }}</q-btn
      >
      <q-btn
        color="primary"
        class="q-px-md q-ml-md"
        @click="onSave"
        :disable="saving"
        >{{ $t(Utils.getKey("Save")) }}</q-btn
      >
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch, onMounted, inject, computed } from "vue";
import { useQuasar } from "quasar";
import useProduct from "src/composables/useProduct";
import useSubCategory from "src/composables/useSubCategory";
import Loading from "src/components/Shared/Loading.vue";
import Utils from "../../helpers/Utils";

import { useI18n } from "vue-i18n";
import { values } from "lodash-es";

const props = defineProps({ data: Object });
const currency_id = inject("currency_id");
const { t } = useI18n();
const emit = defineEmits(["onClose", "onAdded"]);
const price =  props.data?.prices[0]?.price || 0;
const slot = ref({
  sale_price: props.data?.prices[0]?.sale_price || "",
  total_slots: props.data.deal_configuration?.total_slots || "",
  slot_price: props.data.deal_configuration?.slot_price || "",
  deal_price: props.data.deal_configuration?.deal_price || "",
  time_period: props.data.deal_configuration?.time_period || "",
});
const products = ref({
  ...props.data,
});


const getDeaalPriceUpdate = (dp) => {
  let slotsPrice = slot.value.slot_price;

  switch (dp) {
    case "deal_price":
      if (slotsPrice === 1) slot.value.total_slots = slot.value.deal_price;
      else
        slot.value.total_slots = Math.round(slot.value.deal_price / slotsPrice);
      break;
    case "total_slots":
      if (slotsPrice === 1) slot.value.deal_price = slot.value.total_slots;
      else
        slot.value.total_slots = Math.round(slot.value.deal_price / slotsPrice);
      break;
    case "slot_price":
      if (slotsPrice === 1) slot.value.deal_price = slot.value.total_slots;
      else
        slot.value.total_slots = Math.round(slot.value.deal_price / slotsPrice);
      break;
  }

  slot.value.sale_price = slot.value.deal_price;

  //console.log('slot.value.deal_price        ',slot.value.deal_price)
};
const numberValidation = (event) => {
  if (event.target.value > 4) {
    event.target.value = event.target.value.slice(0, 5);
  } else {
    event.target.value = event.target.value.replace("-", "");
  }
};

watch(
  () => slot.value.deal_price,
  () => {
    if (parseFloat(slot.value.deal_price) < parseFloat(price)) {
      $q.notify({
        position: "top",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t("sale price must be greater than price"),
      });
    }
    getDeaalPriceUpdate("deal_price");
  }
);

watch(
  () => slot.value.slot_price,
  () => {
    getDeaalPriceUpdate("slot_price");
  }
);

watch(
  () => slot.value.total_slots,
  () => {
    getDeaalPriceUpdate("total_slots");
  }
);

const $q = useQuasar();
const { saving, productSetting } = useProduct();

const onSave = async () => {

    if (
    slot.value.time_period == "" ||
    slot.value.time_period == 0
  ) {
    $q.notify({
      position: "top",
      type: "warning",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey('Time period field is required')),
    });
    return;
  }

  if (
    slot.value.total_slots == "" ||
    slot.value.slot_price == "" ||
    slot.value.deal_price == "" ||
    slot.value.time_period == "" ||
    slot.value.time_period == 0
  ) {
    $q.notify({
      position: "top",
      type: "warning",
      icon: "fas fa-exclamation-triangle",
      message: t("Field is required"),
    });
    return;
  }
  if(!Utils.containsOnlyNumbers(slot.value.time_period) || slot.value.time_period <1) {
       $q.notify({
        position: "top",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t("Allow only decimal numbers"),
      });
      return;
  }
  console.log(parseFloat(slot.value.deal_price), parseFloat( price))
   if (parseFloat(slot.value.deal_price) < parseFloat(price)) {
      $q.notify({
        position: "top",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t("sale price must be greater than price"),
      });
      return;
    }
  await productSetting(products.value.id, slot.value);
  emit("onAdded");
  emit("onClose");
};
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
</style>
