<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '700px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Agent")) }}</span>
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
      <q-form ref="refForm" autocomplete="off">
        <form autocomplete="off">
          <q-input
            v-model="user.agent_id"
            :label="$t(Utils.getKey('agent_id'))"
            dense
            outlined
            :oninput="
              (evt) => Utils.containsOnlyCharacterAllLanguageEvent2(evt)
            "
            @keydown.space.prevent
            autocomplete="off"
            maxlength="20"
            :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
          />
        </form>
        <form autocomplete="off">
          <q-input
            type="password"
            v-model="user.password"
            :label="$t(Utils.getKey('Password'))"
            dense
            outlined
            maxlength="20"
            lazy-rules
            :rules="[
              (val) => !!val || $t(Utils.getKey('Field is required')),
              (val) => val.length || $t(Utils.getKey('Please enter password')),
            ]"
          />
        </form>
        <form autocomplete="off">
          <q-input
            type="number"
            v-model="user.own_commision"
            :label="$t(Utils.getKey('profit'))+ ' ' +'0-10 %'"
            dense
            outlined
            required
            maxlength="3"
            minValue="1"
            maxValue="5"
            lazy-rules
            :rules="[
              (val) => !!val || $t(Utils.getKey('Field is required'))
            ]"
          />
        </form>
      </q-form>
      <div>
        <p>
            {{ $t(Utils.getKey('profit_sharing_notes')) }}
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
      >
        {{ $t(Utils.getKey("Save")) }}</q-btn
      >
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, inject } from "vue";
import { useQuasar } from "quasar";
import useAgent from "src/composables/useAgent";
import { useI18n } from "vue-i18n";
import Utils from "src/helpers/Utils";

const auth = inject("auth");
const { t } = useI18n();
const emit = defineEmits(["onClose", "onAdded"]);
const refForm = ref(null);
const $q = useQuasar();
const { saving, add, all } = useAgent();
const user = ref({
  agent_id: "",
  password: "",
  parent_id: auth.state.user.id,
  own_commision: ''
});
const agentItems = ref([]);

const getAgent = async () => {
  let agetns = await all();
  agentItems.value = agetns.data || [];
  console.log(agentItems.value, "agentItems");
};

Promise.allSettled([getAgent()]);

async function onSubmit() {
  try {
    let validation = await refForm.value.validate();
    if (!validation) {
      return;
    }
    await add(user.value);
    emit("onAdded");
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("created successfully")),
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
</script>
