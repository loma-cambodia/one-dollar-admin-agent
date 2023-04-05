<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '800px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Add Shipping")) }}</span>
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
      <div  class="row q-mt-xs">
        <!-- <div class="col-12 col-md-4 q-pr-md">
          <label>{{ $t(Utils.getKey("Shipping ID")) }}</label>
          <q-input
            v-model="shipping.shipping_id"
            type="text"
            dense
            outlined
            lazy-rules
            :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
          />
        </div> -->
        <div class="col-12 col-md-6 q-pr-md">
          <label>{{ $t(Utils.getKey("Carrier ID")) }}</label>
          <!-- <q-input
            v-model="shipping.carrier_id"
            type="text"
            dense
            outlined
            lazy-rules
            :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
          /> -->

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
            :oninput="(evt) => Utils.validationSpecailCaracter2(evt)"
            :rules="[
              (val) => !!val || $t(Utils.getKey('Field is required')),
              (val) =>
                !Utils.isNoSpecailCharacter(val) ||
                $t(Utils.getKey('only character number and dash')),
            ]"
            dense
            outlined
          />
        </div>
        <div class="col-12 col-md-6 q-pr-md">
          <label>{{ $t(Utils.getKey("slot id")) }}</label>
          <q-input
            v-model="shipping.booking_id"
            autogrow
            type="textarea"
            dense
            readonly
            outlined
            lazy-rules
            :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
          />
        </div>
        <!-- <div class="col-12 col-md-6 q-pr-md">
          <label>{{ $t(Utils.getKey("Address")) }}</label>
          <q-input
            v-model="shipping.order_id"
            autogrow
            type="textarea"
            dense
            readonly
            outlined
            lazy-rules
            :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
          />
        </div> -->
        <div class="col-12 col-md-6 q-pr-md">
          <label>{{ $t(Utils.getKey("address")) }}</label>
          <q-separator class="q-mb-sm" />

          {{
            shipping?.address?.street_address_1
              ? shipping?.address?.street_address_1 + ", "
              : ""
          }}
          {{
            shipping?.address?.street_address_1
              ? shipping?.address?.street_address_1 + ", "
              : ""
          }}

          {{
            shipping?.address?.city?.city_name
              ? shipping?.address?.city?.city_name + ", "
              : ""
          }}
          {{
            shipping?.address?.state?.state_name
              ? shipping?.address?.state?.state_name + ", "
              : ""
          }}
          {{
            shipping?.address?.country?.name
              ? shipping?.address?.country?.name + ", "
              : ""
          }}
          {{ shipping?.address?.pincode ? shipping?.address?.pincode : "" }}
        </div>
      </div>
    </q-card-section>

    <q-card-section class="text-right">
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

const props = defineProps({ data: Object });
const currency_id = inject("currency_id");
const { t } = useI18n();
const emit = defineEmits(["onClose", "onUpdated"]);
const $q = useQuasar();
const { saving, add, getShipingByBookingID, update } = useShipping();
const { loading, all } = useCarrier();

const carrierOptions = ref();
const tempCarrierOptions = ref();

const shipping = ref({
  shipping_id: "",
  carrier_id: "",
  booking_id: props.data.booking_id,
  carrier_id: "",
  tracking_id: "",
  customer_id: props.data.customer_id,
  status: "In Transit",
  order_id: props.data.order_id,
  address: props.data.address,
});

const shipSatatus = ref([
  {
    id: "In Transit",
    name: "In Transit",
  },
  // {
  //   id: "Pending",
  //   name: "Pending",
  // },
]);

const onSave = async () => {
  try {
    if (Utils.isNoSpecailCharacter(shipping.value.tracking_id)) {
      $q.notify({
        position: "top",
        type: "warning",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("only character number and dash")),
      });
      return;
    }
    if (
      shipping.value.carrier_id == "" ||
      shipping.value.status == "" ||
      shipping.value.tracking_id == ""
    ) {
      $q.notify({
        position: "top",
        type: "warning",
        icon: "fas fa-exclamation-triangle",
        message: t("Field is required"),
      });
      return;
    }
    if (shipping.value.id) {
      await update(shipping.value.id, shipping.value);
      $q.notify({
        position: "top-right",
        type: "positive",
        icon: "fas fa-check",
        message: t(Utils.getKey("updated successfully")),
      });
      emit("onUpdated");
      emit("onClose");
    } else {
      let shipAdd = await add(shipping.value);
      console.log(shipAdd.data.messages[0]);
      if (shipAdd.data.messages[0] != "Shipping created successfully") {
        $q.notify({
          position: "top",
          type: "warning",
          icon: "fas fa-check",
          message: t(Utils.getKey(shipAdd.data.messages[0])),
        });
      } else {
        $q.notify({
          position: "top-right",
          type: "positive",
          icon: "fas fa-check",
          message: t(Utils.getKey("add successfully")),
        });
        emit("onUpdated");
        emit("onClose");
      }
    }
  } catch (err) {
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey(err.message.toString())),
    });
  }
};
const getShiping = async () => {
  let ship = await getShipingByBookingID(props.data.booking_id);
  if (ship.data.length > 0) {
    shipping.value = ship.data[0];
  }
};

const getCarriers = async () => {
  let res = await all();
  carrierOptions.value = res.data;
};

const filterCarrier = () => {
  carrierOptions.value = Utils.filterDropdownOptions(
    tempCarrierOptions,
    val,
    update,
    "name"
  );
};

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
