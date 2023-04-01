<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '700px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Edit Carrier")) }}</span>
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
      <div class="row">
        <div class="col-12 col-md-6 q-pr-md">
          <q-input
            :autofocus="true"
            v-model="carriers.name"
            :label="$t(Utils.getKey('Name'))"
            :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
            dense
            outlined
            maxlength="20"
          />
        </div>
        <div class="col-12 col-md-6 q-pr-md">
          <q-input
            :autofocus="true"
            v-model="carriers.email"
            :label="$t(Utils.getKey('Email'))"
            :rules="[
              (val) => !!val || $t(Utils.getKey('Field is required')),
              (val) => Utils.onlyEmail(val) || $t('invalid_email_address'),
            ]"
            dense
            outlined
            maxlength="20"
          />
        </div>
      </div>
    </q-card-section>

    <!-- <q-card-section class="q-pt-lg">
      <div class="row">
        <div class="col-12 col-md-6 q-pr-md">
          <q-input :autofocus="true" v-model="carriers.contact_no" :label="$t(Utils.getKey('Contact No'))" dense outlined maxlength="20" />
          </div>
          <div class="col-12 col-md-6 q-pr-md">
      <q-input :autofocus="true" v-model="carriers.address" :label="$t(Utils.getKey('Address'))" dense outlined maxlength="20" />
        </div>
      </div>
    </q-card-section> -->

    <q-card-section class="q-pt-lg">
      <div class="row">
        <div class="col-12 col-md-6 q-pr-md">
          <q-input
            :autofocus="true"
            v-model="carriers.contact_no"
            :label="$t(Utils.getKey('Contact No'))"
            :oninput="(evt) => Utils.validationOnlyNumberEvent(evt)"
            :rules="[
              (val) => !!val || $t(Utils.getKey('Field is required')),
              (val) =>
                !Utils.validationOnlyNumber(val) ||
                $t(Utils.getKey('only  number')),
            ]"
            dense
            outlined
            maxlength="20"
          />
        </div>
        <div class="col-12 col-md-6 q-pr-md">
          <q-input
            :autofocus="true"
            v-model="carriers.address"
            :label="$t(Utils.getKey('Address'))"
            :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
            dense
            outlined
            maxlength="20"
          />
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-lg">
      <div class="row">
        <div class="col-12 col-md-6 q-pr-md">
          <q-input
            :autofocus="true"
            v-model="carriers.tracking_url"
            :label="$t(Utils.getKey('Tracking Url'))"
            :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
            dense
            outlined
            maxlength="20"
          />
        </div>
        <div class="col-12 col-md-6 q-pr-md">
          <q-input
            :autofocus="true"
            v-model="carriers.website"
            :label="$t(Utils.getKey('Website'))"
            :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
            dense
            outlined
            maxlength="20"
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
        color="accent"
        class="q-px-md q-ml-md"
        style="color: var(--q-primary) !important"
        @click="onSubmit"
        :disable="saving"
        >{{ $t(Utils.getKey("Save")) }}</q-btn
      >
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import useCarriers from "src/composables/useCarriers";
import Utils from "../../helpers/Utils";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps({ data: Object });
const emit = defineEmits(["onClose", "onUpdated"]);

const $q = useQuasar();
const { saving, update } = useCarriers();
const carriers = ref({ ...props.data });

async function onSubmit() {
  try {
    if (
      carriers.value.name == "" ||
      carriers.value.email == "" ||
      carriers.value.contact_no == "" ||
      carriers.value.website == "" ||
      carriers.value.tracking_url == ""
    ) {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("Field is required")),
      });
      return;
    }
    if (!Utils.onlyEmail(carriers.value.email)) {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t("invalid_email_address"),
      });
      return;
    }
    if (
      !Utils.containsOnlyCharacter(carriers.value.name) ||
      !Utils.containsOnlyCharacter(carriers.value.iso)
    ) {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("only character")),
      });
      return;
    }
    await update(carriers.value.id, { ...carriers.value });
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


