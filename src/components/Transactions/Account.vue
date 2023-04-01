<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '900px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{
        $t(Utils.getKey("Account Settlement Request"))
      }}</span>
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
    <q-card-section class="q-mt-none">
      <p style="font-size: 1.2rem">
        {{ $t(Utils.getKey("User Account Information")) }}
      </p>
      <table
        class="floating simpletable"
        style="border-collapse: collapse; width: 100%"
        border="1"
        cellpadding="10"
      >
        <col width="100" />
        <col width="100" />
        <col width="100" />
        <tbody>
          <tr>
            <td
              class="text-left"
              style="text-transform: capitalize"
              colspan="3"
            >
              {{ $t(Utils.getKey("Bank Name")) }}
            </td>
            <td
              class="text-left"
              style="text-transform: capitalize"
              colspan="2"
            >
              <b>{{ transaction?.account?.bank_name }}</b>
            </td>
            <td
              class="text-left"
              style="text-transform: capitalize"
              colspan="3"
            >
              {{ $t(Utils.getKey("account type")) }}
            </td>
            <td
              class="text-left"
              style="text-transform: capitalize"
              colspan="2"
            >
              <b>{{ transaction?.account?.account_type }}</b>
            </td>
          </tr>

          <tr>
            <td
              class="text-left"
              style="text-transform: capitalize"
              colspan="3"
            >
              {{ $t(Utils.getKey("account holder name")) }}
            </td>
            <td
              class="text-left"
              style="text-transform: capitalize"
              colspan="2"
            >
              <b>{{ transaction?.account?.account_name }}</b>
            </td>
            <td
              class="text-left"
              style="text-transform: capitalize"
              colspan="3"
            >
              {{ $t(Utils.getKey("transaction type")) }}
            </td>
            <td
              class="text-left"
              style="text-transform: capitalize"
              colspan="2"
            >
              <b>{{ transaction?.transaction_type_translation }}</b>
            </td>
          </tr>

          <tr>
            <td
              class="text-left"
              style="text-transform: capitalize"
              colspan="3"
            >
              {{ $t(Utils.getKey("account number")) }}
            </td>
            <td
              class="text-left"
              style="text-transform: capitalize"
              colspan="2"
            >
              <b>{{ transaction?.account?.account_no }}</b>
            </td>
            <td
              class="text-left"
              style="text-transform: capitalize"
              colspan="3"
            >
              {{ $t(Utils.getKey("transaction amount")) }}
            </td>
            <td
              class="text-left"
              style="text-transform: capitalize"
              colspan="2"
            >
              <b
                >{{ transaction?.currency?.symbol }}{{ transaction?.amount }}</b
              >
            </td>
          </tr>
        </tbody>
      </table>

      <p style="font-size: 1.2rem" class="q-mt-md">
        {{ $t(Utils.getKey("Member Detail")) }}
      </p>
      <table
        class="floating simpletable"
        style="border-collapse: collapse; width: 100%"
        border="1"
        cellpadding="10"
      >
        <tbody>
          <tr>
            <td
              class="text-left"
              style="text-transform: capitalize"
            >
              {{ $t(Utils.getKey("Name")) }}
            </td>
            <td
              class="text-left"
              style="text-transform: capitalize"
            >
              <b v-if="transaction?.customer?.display_name">{{
                transaction?.customer?.display_name
              }}</b>
              <b v-else>
                {{
                  transaction?.customer?.first_name +
                  " " +
                  transaction?.customer?.last_name
                }}</b
              >
            </td>
            <td
              class="text-left"
              style="text-transform: capitalize"
            >
              {{ $t(Utils.getKey("Member id")) }}
            </td>
            <td
              class="text-left"
              style="text-transform: capitalize"
            >
              <b>{{ transaction?.customer?.member_ID }}</b>
            </td>
          </tr>
          <tr>
            <td
              class="text-left"
              style="text-transform: capitalize"
            >
              {{ $t(Utils.getKey("Email")) }}
            </td>
            <td
              class="text-left"
              style="text-transform: capitalize"
            >
              <b>{{ transaction?.customer?.email || "" }}</b>
            </td>
            <td
              class="text-left"
              style="text-transform: capitalize"
            >
              {{ $t(Utils.getKey("Phone number")) }}
            </td>
            <td
              class="text-left"
              style="text-transform: capitalize"
            >
              <b>{{
                transaction?.customer?.idd + transaction?.customer?.phone_number
              }}</b>
            </td>
          </tr>
        </tbody>
      </table>
    </q-card-section>

    <q-card-section>
      <label class="pa-2 border">
        <i class="fa fa-image"></i> {{ $t("choose_image") }}
        <input
          class="mt-2"
          accept=".jpg, .png, .jpeg, .gif, .bmp, .tif"
          type="file"
          style="display: none"
          id="file-input"
          @change="uploadChange"
          max="10"
          name="image"
        />
      </label>

      <div class="box-2 img-result hide">
        <img class="cropped" :src="images_url" alt="" />
      </div>
      <div class="page">
        <div class="box-2">
          <div class="result"></div>
        </div>
      </div>
    </q-card-section>

    <q-card-section>
      <q-input
        v-model="transaction.comment"
        :label="$t(Utils.getKey('comment'))"
        dense
        autogrow
        type="textarea"
        outlined
        required
      />
    </q-card-section>
    <q-card-section class="text-right q-mt-md">
      <q-btn
        flat
        color="negative"
        class="q-px-md"
        @click="onCancel"
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
import useTransaction from "src/composables/useTransaction";
import Utils from "../../helpers/Utils";
import "../../css/crop.css";
import "../../js/croper";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const emit = defineEmits(["onClose", "onUpdate"]);

const $q = useQuasar();
const props = defineProps({ data: Object });
const { saving, update } = useTransaction();
const transaction = ref({ ...props.data, comment: "" });
const statusValue = ref("Approve");

const images_url = ref("");
const images = ref("");
const cropper = ref("");

const uploadChange = (e) => {
  let img_w = "500";
  let img_h = "500";
  let result = document.querySelector(".result");
  if (e.target.files.length) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target.result) {
        let img = document.createElement("img");
        img.id = "image";
        img.src = e.target.result;
        result.innerHTML = "";
        result.appendChild(img);
        cropper.value = new Cropper(img);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  }
};
const onCancel = () => {
  emit("onClose");
};

async function onSubmit() {
  try {
    if (transaction.value.comment == "") {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("Comment field required")),
      });
      return;
    }
    const FormData = require("form-data");
    if (!cropper.value) {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("Select Image")),
      });
      return;
    }

    cropper.value.getCroppedCanvas().toBlob(async (blob) => {
      const fomrData = new FormData();
      images.value = blob;
      fomrData.append("status", "Success");
      fomrData.append("_method", "patch");
      fomrData.append("transaction_type", transaction.value.transaction_type);
      fomrData.append("file", images.value);
      fomrData.append("comment", transaction.value.comment);

      await update(transaction.value.id, fomrData);
      emit("onUpdate");
      emit("onClose");
      $q.notify({
        position: "top-right",
        type: "positive",
        icon: "fas fa-check",
        message: t(Utils.getKey("Updated successfully")),
      });
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
