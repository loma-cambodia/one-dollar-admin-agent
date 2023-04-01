<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '500px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Bot")) }}</span>
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
        <div class="row">
          <div class="col-12 col-md-12 q-pr-md">
            <q-input
              :autofocus="true"
              v-model="bot.count"
              :label="$t(Utils.getKey('bot'))"
              dense
              outlined
              :oninput="(evt) => Utils.validationOnlyNumberEvent(evt, 2)"
              lazy-rules
              :rules="[(val) => !!val || $t(Utils.getKey('Field is required')), (val) => val > 0 || $t(Utils.getKey('Field is required'))]"
              maxlength="2"
            />
          </div>
        </div>
      </q-form>
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
import useMember from "src/composables/useMember";
import Utils from "../../helpers/Utils";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const emit = defineEmits(["onClose", "onAdded"]);
const $q = useQuasar();

const bot = ref({
  count: "",
});
const refForm = ref(null);
const { addBotCount } = useMember();

async function onSubmit() {
  try {
    let validation = await refForm.value.validate();
    if (!validation) {
      return;
    }
    await addBotCount(bot.value);
    emit("onAdded");
    emit("onClose");
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
