<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '600px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Address")) }}</span>
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
      <div class="q-px-md">

        <p class="q-mb-sm">
          <span class="text-bold"> {{ $t("address") }} </span> :
             {{
                  address?.street_address_1
                    ? address?.street_address_1 + ", "
                    : ""
                }}
                {{
                  address?.street_address_1
                    ? address?.street_address_1 + ", "
                    : ""
                }}

                {{
                  address?.city?.city_name
                    ? address?.city?.city_name + ", "
                    : ""
                }}
                {{
                  address?.state?.state_name
                    ? address?.state?.state_name + ", "
                    : ""
                }}
                {{
                  address?.country?.name
                    ? address?.country?.name + ", "
                    : ""
                }}
                {{
                  address?.pincode ? address?.pincode : ""
                }}
                  </p>
        <q-separator  class="q-mb-sm" />
        <p class="q-mb-md">
          <span class="text-bold"> {{ $t("country") }} </span> :
          {{ address?.country?.name }}
        </p>
        <p class="q-mb-md">
          <span class="text-bold"> {{ $t("state") }} </span> :
          {{ address?.state?.state_name }}
        </p>
        <p class="q-mb-md">
          <span class="text-bold"> {{ $t("city") }} </span> :
          {{ address?.city?.city_name }}
        </p>
        <p class="q-mb-md">
          <span class="text-bold"> {{ $t("pincode") }} </span>:
          {{ address?.pincode }}
        </p>
        <p class="q-mb-md">
          <span class="text-bold"> {{ $t("street_address_1") }} </span> :
          {{ address?.street_address_1 }}
        </p>
        <p class="q-mb-md">
          <span class="text-bold"> {{ $t("street_address_2") }}</span> :
          {{ address?.street_address_2 }}
        </p>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import Loading from "src/components/Shared/Loading.vue";
import Utils from "../../helpers/Utils";

const props = defineProps({ address: Object });
const emit = defineEmits(["onClose", "onUpdated"]);
const address = ref(props.address);
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
