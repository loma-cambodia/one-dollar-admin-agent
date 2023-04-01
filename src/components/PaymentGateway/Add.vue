<template>
  <q-card :style="{
    width: $q.platform.is.mobile ? '100%' : '700px',
    maxWidth: '100%',
  }">
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Add Payment GateWay")) }}</span>
      <q-space />
      <q-btn dense flat icon="fas fa-times" @click="emit('onClose')" :disable="saving">
        <q-tooltip>{{ $t(Utils.getKey("Close")) }}</q-tooltip>
      </q-btn>
    </q-bar>
    <q-card-section class="q-pt-lg">

      <q-input :autofocus="true" v-model="payment.name" :label="$t(Utils.getKey('Name'))" dense outlined maxlength="20"
        lazy-rules :rules="[
          val => !!val || $t(Utils.getKey('Field is required')), x
        ]" />
    </q-card-section>
    <q-card-section class="q-pt-none">
      <div v-for="(data, index) in inputsData" :key="data.id" class="row">
        <div class="col-4 col-md-4 mr-2">
          <q-input v-model="data.name" :label="$t(Utils.getKey('Name'))" dense outlined maxlength="20" lazy-rules :rules="[
            val => !!val || $t(Utils.getKey('Field is required')),
          ]" />
        </div>
        <div class="col-7 col-md-7">
          <q-input v-model="data.value" :label="$t(Utils.getKey('value'))" dense outlined maxlength="20" lazy-rules
            :rules="[
              val => !!val || $t(Utils.getKey('Field is required')), x
            ]" />
        </div>
        <div>
          <q-btn dense flat size="xs" color="negative" icon="fas fa-trash" @click="onDeletedFiled(index)">
            <q-tooltip>{{ $t(Utils.getKey("Delete")) }}</q-tooltip>
          </q-btn>
        </div>
      </div>
      <add-button @click="onAddField" tooltip-text="Add" color="primary" style="margin-top: 10px;" />
    </q-card-section>
    <q-card-section class="text-right q-mt-md">
      <q-btn flat color="negative" class="q-px-md" @click="emit('onClose')" :disable="saving">{{
        $t(Utils.getKey("Cancel")) }}</q-btn>
      <q-btn color="accent" style="color: var(--q-primary) !important" class="q-px-md q-ml-md" @click="onSubmit"
        :disable="saving">{{ $t(Utils.getKey("Save")) }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import usePayment from "src/composables/usePayment";
import Utils from "../../helpers/Utils";
import AddButton from "../../components/Buttons/AddButton.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const emit = defineEmits(["onClose", "onAdded"]);

const $q = useQuasar();
const { saving, add } = usePayment();
const payment = ref({
  name: "",
  configuration: []
});

const inputsData = ref([{
  id: 1,
  name: "",
  value: ""
}])


const onDeletedFiled = (index) => {
  inputsData.value.splice(index, 1);
}

const onAddField = () => {
  let id = inputsData.value.length
  inputsData.value.push({
    id: id,
    name: "",
    value: ""
  });
}

async function onSubmit() {
  try {
    let error = false
    if (payment.value.name == "") {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-check",
        message: t(Utils.getKey("Name Field Required")),
      });
      return;
    }
    inputsData.value.forEach((inputData) => {
      console.log('inputsData   ', inputData)
      if (inputData.name == "" || inputData.value == "") {
        $q.notify({
          position: "top-right",
          type: "negative",
          icon: "fas fa-exclamation-triangle",
          message: t(Utils.getKey('Name and Value Field Required from the Settings Sections')),
        });
        error = true
      } else {
        payment.value.configuration.push(inputData)
      }
    })

    if (error) {
      return false
    }

    await add(payment.value);
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


