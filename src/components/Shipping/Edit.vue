<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '800px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Edit Shipping")) }}</span>
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
      <div style="padding: 12px; background: #f5efeb" class="row q-mt-xs">
        <div class="col-12 col-md-6 q-pr-md">
          <label>{{ $t(Utils.getKey("Shipping ID")) }}</label>
          <q-input
            v-model="shipping.shipping_id"
            type="text"
            dense
            readonly
            outlined
            lazy-rules
            :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
          />
        </div>
        <div class="col-12 col-md-6 q-pr-md">
          <label>{{ $t(Utils.getKey("Carrier ID")) }}</label>
          <q-select
            v-model="shipping.carrier_id"
            :options="carrierOptions"
            outlined
            dense
            emit-value
            map-options
            option-value="id"
            option-label="name"
            clearable
            :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
            use-input
            :filter="filterCarrier"
          />
        </div>
        <div class="col-12 col-md-6 q-pr-md">
          <label>{{ $t(Utils.getKey("Tracking ID")) }}</label>
          <q-input
            v-model="shipping.tracking_id"
            type="text"
            dense
            outlined
            lazy-rules
            :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
          />
        </div>
        <div class="col-12 col-md-6 q-pr-md">
          <label>{{ $t(Utils.getKey("status")) }}</label>
          <q-select
            v-model="shipping.status"
            :options="shipSatatus"
            outlined
            dense
            emit-value
            map-options
            option-value="id"
            :option-label="(item) => $t(Utils.getKey(item.name))"
            clearable
            :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
          />
        </div>
        <!-- <div class="col-12 col-md-8 q-pr-md">
          <label>{{$t(Utils.getKey('Address'))}}</label>
          <q-input
            v-model="shipping.address"
            autogrow
            type="textarea"
            dense
            outlined
            lazy-rules
            :rules="[
              (val) => !!val || $t(Utils.getKey('Field is required'))
            ]"
          />
        </div> -->
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
import useShipping from "../../composables/useShipping";
import useCarrier from "../../composables/useCarriers";
import Loading from "src/components/Shared/Loading.vue";
import Utils from "../../helpers/Utils";

import { useI18n } from "vue-i18n";
const { loading, all } = useCarrier();
const props = defineProps({ data: Object });
const currency_id = inject("currency_id");
const { t } = useI18n();
const emit = defineEmits(["onClose", "onUpdated"]);

const shipping = ref({
  ...props.data,
});

const carrierOptions = ref()
const tempCarrierOptions = ref()

const shipSatatus = ref([
  {
    id: "Cancelled",
    name: "Cancelled",
  },

  {
    id: "Delivered",
    name: "Delivered",
  },
  {
    id: "In Transit",
    name: "In Transit",
  },
  {
    id: "Failed Delivery",
    name: "Failed Delivery",
  },
  // {
  //   id: "Pending",
  //   name: "Pending",
  // },
]);

const $q = useQuasar();
const { saving, update } = useShipping();

const onSave = async () => {
  if (
    shipping.value.shipping_id == "" ||
    shipping.value.carrier_id == "" ||
    shipping.value.tracking_id == "" ||
    shipping.value.status == ""
  ) {
    $q.notify({
      position: "top",
      type: "warning",
      icon: "fas fa-exclamation-triangle",
      message: t("Field is required"),
    });
    return;
  }
  await update(shipping.value.id, shipping.value);
  emit("onUpdated");
  emit("onClose");
};

const getCarriers = async () => {
  let res = await all();
  carrierOptions.value = res.data;
};

const filterCarrier = () =>{
  carrierOptions.value = Utils.filterDropdownOptions(
    tempCarrierOptions,
    val,
    update,
    "name"
  );
}

onMounted(() => {
  getCarriers();
});
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
