<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '700px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Edit")) }}</span>
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
      <q-form ref="refForm">
        <q-input
          :autofocus="true"
          type="email"
          readonly
          v-model="user.agent_id"
          :label="$t(Utils.getKey('agent_id'))"
          dense
          outlined
          :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
          maxlength="20"
          @keydown.space="(event) => event.preventDefault()"
          lazy-rules
        />
        <!-- <q-input
          type="profit"
          v-model="user.own_commision"
          :label="$t(Utils.getKey('profit'))"
          dense
          outlined
          lazy-rules
          :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
        /> -->
        <q-input
          :autofocus="true"
          v-model="user.own_commision"
          :label="$t(Utils.getKey('profit')) + ' ' + '0-10 %'"
          dense
          outlined
          maxlength="5"
          @change="onChange(1)"
          lazy-rules
          :oninput="(evt) => Utils.validationOnlyNumberDecimalEvent(evt, 4)"
          :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
        />
      </q-form>
      <!-- minLength="2" maxlength="3" -->
      <div>
        <p>
          {{ $t(Utils.getKey("profit_sharing_notes_edit")) }}
        </p>
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
import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import useAgent from "src/composables/useAgent";
import useACL from "src/composables/useACL";
import Utils from "../../helpers/Utils";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps({ data: Object });
const emit = defineEmits(["onClose", "onUpdated"]);
const $q = useQuasar();
const { saving, update } = useAgent();
const { getAllRoles } = useACL();
const roleOptions = ref([]);
const user = ref({
  ...props.data,
  // role_id: props.data?.roles[0]?.id,
});
const refForm = ref(null);

Promise.allSettled[fetchRoles()];

watch(
  () => user.value.role_id,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      let role = roleOptions.value.find((item) => item.id == newValue);
    }
  }
);
async function fetchRoles() {
  try {
    const response = await getAllRoles();
    roleOptions.value = response.data;
  } catch (e) {}
}

async function onSubmit() {
  let role = roleOptions.value.find((item) => item.id == user.value.role_id);

  try {
    let validation = await refForm.value.validate();
    if (!validation) {
      return;
    }
    // if (!Utils.onlyEmail(user.value.email)) {
    //   $q.notify({
    //     position: "top-right",
    //     type: "negative",
    //     icon: "fas fa-exclamation-triangle",
    //     message: t(Utils.getKey("invalid email address")),
    //   });
    //   return;
    // }
    await update(user.value.id, { ...user.value });

    emit("onUpdated");
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("updated successfully")),
    });
  } catch (err) {
    var errMessage = t(Utils.getKey(err.message.toString()));
    if (errMessage && errMessage.match("___"))
      errMessage = err.message.toString();
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: errMessage,
    });
  }
}
const onChange = (val) => {
  user.value.own_commision = user.value.own_commision.replace('-', '')
  switch (val) {
    case 1:
      if (user.value.own_commision[0] == ".") {
        user.value.own_commision = 0 + user.value.own_commision;
      }
      break;
  }
};
</script>
