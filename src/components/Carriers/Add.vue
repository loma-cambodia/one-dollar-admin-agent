<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '700px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Add Carrier")) }}</span>
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
            dense
            outlined
            v-on:keyup="changeName('name')"
            lazy-rules
            :rules="[
              (val) => !!val || $t(Utils.getKey('Field is required')),
              (val) => Utils.containsOnlyCharacter(val) || $t('only_character'),
            ]"
            maxlength="20"
          />
        </div>
        <div class="col-12 col-md-6 q-pr-md">
          <q-input
            :autofocus="true"
            v-model="carriers.email"
            :label="$t(Utils.getKey('Email'))"
            dense
            outlined
            lazy-rules
            :rules="[
              (val) => !!val || $t(Utils.getKey('Field is required')),
              (val) => Utils.onlyEmail(val) || $t('invalid_email_address'),
            ]"
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
            v-model="carriers.contact_no"
            :label="$t(Utils.getKey('Contact No'))"
            dense
            outlined
            :oninput="(evt) => Utils.validationOnlyNumberEvent(evt)"
            :rules="[
              (val) => !!val || $t(Utils.getKey('Field is required')),
              (val) =>
                !Utils.validationOnlyNumber(val) ||
                $t(Utils.getKey('only number')),
            ]"
            maxlength="20"
          />
        </div>
        <div class="col-12 col-md-6 q-pr-md">
          <q-input
            :autofocus="true"
            v-model="carriers.address"
            :label="$t(Utils.getKey('Address'))"
            dense
            outlined
            lazy-rules
            :rules="[
              (val) => !!val || $t(Utils.getKey('Field is required'))]"
            maxlength="100"
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
            dense
            outlined
            lazy-rules
            :rules="[
              (val) => !!val || $t(Utils.getKey('Field is required'))]"
            maxlength="20"
          />
        </div>
        <div class="col-12 col-md-6 q-pr-md">
          <q-input
            :autofocus="true"
            v-model="carriers.website"
            :label="$t(Utils.getKey('Website'))"
            dense
            outlined
            lazy-rules
            :rules="[
              (val) => !!val || $t(Utils.getKey('Field is required'))]"
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
        style="color: var(--q-primary) !important"
        class="q-px-md q-ml-md"
        @click="onSubmit"
        :disable="saving"
        >{{ $t(Utils.getKey("Save")) }}</q-btn
      >
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import useCarriers from "src/composables/useCarriers";
import Utils from "../../helpers/Utils";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const emit = defineEmits(["onClose", "onAdded"]);

const $q = useQuasar();
const { saving, add } = useCarriers();
const carriers = ref({
  name: "",
  email: "",
  address: "",
  contact_no: "",
  website: "",
  tracking_url: "",
  password: Utils.randomString(12),
});

// watch(
//   () => carriers.value.name,
//   () => {
//     // console.log(carriers.value.name)
//     carriers.value.name = Utils.containsOnlyCharacter2(carriers.value.name)
//     carriers.value.contact_no = Utils.containsOnlyCharacter2(carriers.value.contact_no)
//   }
// );

const changeName = (val) => {
  switch (val) {
    case "name":
      carriers.value.name = Utils.containsOnlyCharacter2(carriers.value.name);

      break;
    case "contact_no":
      carriers.value.contact_no = Utils.containsOnlyNumber2(
        carriers.value.contact_no
      );
      //carriers.value = {carriers.value,contact_no:...Utils.containsOnlyNumber2(carriers.value.contact_no)};
      //console.log('carriers.value:',);

      break;
  }
};

async function onSubmit() {
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
  try {
    await add(carriers.value);
    emit("onAdded");
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


