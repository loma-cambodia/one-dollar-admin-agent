<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '700px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Approval Request")) }}</span>
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
    <q-card-section>
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
              <b>{{ transaction?.transaction_type }}</b>
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
      <div class="q-mt-md">
        <p style="text-transform: capitalize">
          {{ $t(Utils.getKey("Transaction Requested Amount")) }}:
          <b>{{ transaction?.currency?.symbol }}{{ transaction?.amount }}</b>
        </p>
        <p style="text-transform: capitalize">
          {{ $t(Utils.getKey("Wallet Amount")) }}:
          <b>{{ getWalletBalance() }}</b>
        </p>
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
        >{{ $t(Utils.getKey("Reject")) }}</q-btn
      >
      <q-btn
        color="accent"
        class="q-px-md q-ml-md"
        style="color: var(--q-primary) !important"
        @click="onSubmit"
        :disable="saving"
        >{{ $t(Utils.getKey("Approve")) }}</q-btn
      >
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import useTransaction from "src/composables/useTransaction";
import Utils from "../../helpers/Utils";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const emit = defineEmits(["onClose", "onUpdate"]);

const $q = useQuasar();
const props = defineProps({ data: Object });
const { saving, update } = useTransaction();
const transaction = ref({ ...props.data });
const statusValue = ref("Approve");

const onCancel = () => {
  statusValue.value = "Reject";
  onSubmit();
};

const getWalletBalance = () => {
  let balance = transaction?.value?.customer?.wallets?.amount || 0;
  if (
    transaction?.value?.currency_id !=
    transaction?.value?.customer?.wallets?.currency_id
  ) {
    balance = 0;
  }

  return transaction?.value?.currency?.symbol + Utils.formatCurrency(balance);
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
    const fomrData = new FormData();

    fomrData.append("status", statusValue.value);
    fomrData.append("_method", "patch");
    fomrData.append("transaction_type", transaction.value.transaction_type);
    fomrData.append("comment", transaction.value.comment);

    transaction.value.status = statusValue.value;

    await update(transaction.value.id, fomrData);
    emit("onUpdate");
    emit("onClose");
    let message =
      statusValue.value == "Approve"
        ? t(Utils.getKey("Approved successfully"))
        : t(Utils.getKey("Rejected successfully"));
    let type = statusValue.value == "Approve" ? "positive" : "negative";
    $q.notify({
      position: "top-right",
      type: type,
      icon: "fas fa-check",
      message: message,
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
