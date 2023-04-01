<template>
  <q-card :style="{
    width: $q.platform.is.mobile ? '100%' : '700px',
    maxWidth: '100%',
  }">
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Add Member")) }}</span>
      <q-space />
      <q-btn dense flat icon="fas fa-times" @click="emit('onClose')" :disable="saving">
        <q-tooltip>{{ $t(Utils.getKey("Close")) }}</q-tooltip>
      </q-btn>
    </q-bar>

    <q-card-section class="q-pt-lg">
      <div class="row">
        <div class="col-12 col-md-6 q-pr-md">
          <q-input :autofocus="true" v-model="member.idd" :label="$t(Utils.getKey('Idd'))" dense outlined maxlength="20" />
          </div>
          <div class="col-12 col-md-6 q-pr-md">
      <q-input :autofocus="true" v-model="member.phone_number" :label="$t(Utils.getKey('Phone Number'))" dense outlined maxlength="20" />
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-lg">
      <div class="row">
        <div class="col-12 col-md-6 q-pr-md">
          <q-input :autofocus="true" v-model="member.first_name" :label="$t(Utils.getKey('First Name'))" dense outlined maxlength="20" />
          </div>
          <div class="col-12 col-md-6 q-pr-md">
      <q-input :autofocus="true" v-model="member.last_name" :label="$t(Utils.getKey('Last Name'))" dense outlined maxlength="20" />
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-lg">
      <div class="row">
        <div class="col-12 col-md-6 q-pr-md">
          <q-input :autofocus="true" v-model="member.display_name" :label="$t(Utils.getKey('Display Name'))" dense outlined maxlength="20" />
          </div>
          <div class="col-12 col-md-6 q-pr-md">
      <q-input

      :autofocus="true" type="email" aria-autocomplete="none" autocomplete="off" v-model="member.email"
          :label="$t(Utils.getKey('Email Id'))" dense outlined  required maxlength="40"
          @keydown.space="(event) => event.preventDefault()"
          :rules="[ (val, rules) => rules.email(val) || $t(Utils.getKey('invalid email address'))  ]"
         />
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-lg">
      <div class="row">
          <div class="col-12 col-md-6 q-pr-md">
            <q-input :autofocus="true" v-model="member.parent_referral_code" :label="$t(Utils.getKey('Parent Referral Code'))" dense outlined maxlength="20" />
        </div>
        <div class="col-12 col-md-6 q-pr-md">
            <q-input :autofocus="true" v-model="member.password" :label="$t(Utils.getKey('Password'))" dense outlined maxlength="20" />
        </div>
      </div>
    </q-card-section>

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
import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import useMember from "src/composables/useMember";
import Utils from "../../helpers/Utils";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const emit = defineEmits(["onClose", "onAdded"]);

const $q = useQuasar();
const { saving, add } = useMember();
const member = ref({
  first_name: "",
  last_name: "",
  display_name: "",
  phone_number: "",
  email: "",
  referral_code:"",
  parent_referral_code:"",
  idd:"",
  password: Utils.randomString(12)
});

watch(
  () => member.value.first_name,
  () => {
    console.log(member.value.first_name)
  }
);

async function onSubmit() {
  try {
    if (!Utils.onlyEmail(user.value.email)) {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("invalid email address")),
      });
      return;
    }
    await add(member.value);
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

<style>

</style>
