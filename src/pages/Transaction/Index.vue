<template>
  <q-page>
    <q-card
      style="
        margin-top: 20px;
        margin-left: 0px;
        box-shadow: none;
        min-height: 85vh;
      "
    >
      <q-card-section>
        <q-table
          flat
          class="q-pt-md"
          color="primary"
          :loading="loading"
          :rows="items"
          row-key="id"
          :columns="columns"
          v-model:pagination="pagination"
          :filter="filters"
          @request="onRequest"
          :rows-per-page-options="[10, 15, 20, 50, 100, 150, 200, 500]"
          binary-state-sort
          :rows-per-page-label="$t(Utils.getKey('Records per page'))"
        >
          <template v-slot:top>
            <q-input
              dense
              outlined
              debounce="300"
              v-model="filters.transaction_ID"
              :placeholder="$t(Utils.getKey('Search by transaction id'))"
              style="width: 180px"
            />
            <q-input
              dense
              outlined
              debounce="300"
              v-model="filters.member_id"
              :placeholder="$t(Utils.getKey('Search by member id'))"
              style="width: 180px; margin-left: 10px"
            />
            <q-select
              v-model="filters.status"
              :options="statusOptions"
              outlined
              dense
              emit-value
              :style="$q.platform.is.mobile ? 'width:100%' : 'width:150px'"
              map-options
              option-value="id"
              :label="$t(Utils.getKey('Status'))"
              :option-label="(item) => $t(Utils.getKey(item.name))"
              clearable
              class="pa-2"
            />
            <el-date-picker
              class=" input_white"
              v-model="filters.dates"
              type="daterange"
              value-format="YYYY-MM-DD"
              style="width: 180px"
              :start-placeholder="$t(Utils.getKey('Start Date'))"
              :end-placeholder="$t(Utils.getKey('End Date'))"
            >
            </el-date-picker>
            <q-btn
              class="q-mr-sm q-mt-xs"
              dense
              color="primary"
              icon="mdi-filter-remove-outline"
              rounded
              style="margin-left: 10px"
              @click="resetFilters"
            />

            <div class="pa-5 d_flex_center">
              <div class="d-flex">
                <div
                  class="card_1 primary d-flex r_4 mx-3 pointer"
                  :class="active == 'withdraw' ? 'active_shadow' : ''"
                  @click="onClickActive('withdraw')"
                >
                  <img
                    src="../../assets/mdi_gift-open.png"
                    style="height: 26px"
                  />
                  <span class="px-3 white">{{ $t("withdraw") }}</span>
                  <div class="count">
                    <span>{{ counts.withdraw || 0 }}</span>
                  </div>
                </div>

                <div
                  class="card_1 third d-flex r_4 mx-3 pointer"
                  :class="active == 'transfer_in' ? 'active_shadow' : ''"
                  @click="onClickActive('transfer_in')"
                >
                  <img src="../../assets/like.png" style="height: 26px" />
                  <span class="px-3 green">{{ $t("transfer_in") }}</span>
                  <div class="count">
                    <span>{{ counts.transfer_in || 0 }}</span>
                  </div>
                </div>
                <div
                  class="card_1 secondary d-flex r_4 mx-3 pointer"
                  :class="active == 'transfer_out' ? 'active_shadow' : ''"
                  @click="onClickActive('transfer_out')"
                >
                  <img src="../../assets/time-out.png" style="height: 26px" />
                  <span class="px-3 orange">{{ $t("transfer_out") }}</span>
                  <div class="count">
                    <span>{{ counts?.transfer_out || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- header column -->
          <template v-slot:header-cell="props">
            <q-th :props="props">
              {{
                props.col.label === "#"
                  ? props.col.label
                  : $t(Utils.getKey(props.col.label))
              }}
            </q-th>
          </template>
          <!-- no data -->
          <template v-slot:no-data>
            <q-icon
              style="margin-right: 5px"
              class="fas fa-exclamation-triangle"
            />
            {{ $t(Utils.getKey("No matching records found")) }}
          </template>
          <template v-slot:body-cell-sl="props">
            <q-td>
              {{ props.rowIndex + 1 }}
            </q-td>
          </template>
          <template v-slot:body-cell-transaction_ID="props">
            <q-td class="text-center">
              <span
                @click="viewTrasaction(props.row)"
                v-if="props.row.transaction_type == 'withdraw' "
                class="pointer"
              >
                <q-chip :class="props.row.status != 'Review' ? 'white' : 'black' " :color="getColorCode(props.row.status)" size="sm" :label="props.row?.transaction_ID" />
              </span>
              <span v-else>
                {{ props.row?.transaction_ID }}
              </span>
            </q-td>
          </template>

          <!-- transaction_type -->

          <template v-slot:body-cell-amount="props">
            <q-td class="text-right">
              <div>
                {{ Utils.formatCurrency(props.row?.amount || 0 ) }}
              </div>
            </q-td>
          </template>
<!--
          <template v-slot:body-cell-message="props">
            <q-td class="text-center">
              <div>
                {{props.row.message && $t(Utils.getKey(props.row.message)) }}
              </div>
            </q-td>
          </template> -->

          <template v-slot:body-cell-transaction_type="props">
            <q-td class="text-center">
              <div>{{ $t(Utils.getKey(props.row.transaction_type)) }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td class="text-center">
              <div :class="getColorCode(props.row.status)">{{ $t(Utils.getKey(props.row.status)) }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td class="text-center">
              <q-btn
                v-if="
                  Utils.hasPermissions(['Transaction: Edit/Update Transaction'])
                "
                class="q-mr-sm"
                size="xs"
                rounded
                padding="5px"
                color="primary"
                icon="fas fa-pen"
                @click="onEditClick(props.row)"
              >
                <q-tooltip>{{ $t(Utils.getKey("Edit")) }}</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="approval" position="top" persistent>
      <show-approval
        :data="selectedTransaction"
        @onClose="approval = false"
        @onUpdate="onUpdatedCallBack"
      />
    </q-dialog>

    <q-dialog v-model="account" position="top" persistent>
      <show-account
        :data="selectedTransaction"
        @onClose="account = false"
        @onUpdate="onUpdatedCallBack"
      />
    </q-dialog>

    <q-dialog v-model="detail" position="top" persistent>
      <show-detail
        :data="selectedTransaction"
        @onClose="detail = false"
        @onUpdate="onUpdatedCallBack"
      />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref, watch, inject } from "vue";
import useTable from "../../composables/useTable";
import useTransaction from "../../composables/useTransaction";
import Utils from "../../helpers/Utils";

import showApproval from "../../components/Transactions/Approval.vue";
import showAccount from "../../components/Transactions/Account.vue";
import showDetail from "../../components/Transactions/Detail.vue";
import { useI18n } from "vue-i18n";
const locale = inject('locale');
const { t } = useI18n();
const { loading, columns, items, trash, paginate, getTransfer } =
  useTransaction();
const {
  showAdd,
  showEdit,
  selected,
  showConfirm,
  pagination,
  onRequest,
  onRefresh,
} = useTable(paginate, trash);

const selectedTransaction = ref();
const approval = ref(false);
const account = ref(false);
const detail = ref(false);
const filters = reactive({
  transaction_ID: "",
  transaction_type: "",
});

const counts = ref({});
const active = ref(0);
watch(()=>locale.value, () => {
  onRefresh();
})

const statusOptions = ref([
  {
    id: "Fail",
    name:"Fail"
  },
  {
    id: "Success",
    name:"Success"
  },
  {
    id: "Pending",
    name:"Pending"
  },
  {
    id: "Reject",
    name:"Reject"
  },
  {
    id: "Review",
    name:"Review"
  },
  {
    id: "Approve",
    name: "Approve",
  },
]);
const statusOptionsTmp = ref([
  {
    id: "Fail",
    name:"Fail"
  },
  {
    id: "Success",
    name:"Success"
  },
  {
    id: "Pending",
    name:"Pending"
  },
  {
    id: "Reject",
    name:"Reject"
  },
  {
    id: "Review",
    name:"Review"
  },
  {
    id: "Approve",
    name: "Approve",
  },
]);

const onClickActive = (val) => {
  active.value = val;
  filters.transaction_type = val;
  if(val == "withdraw"){
    statusOptions.value =  statusOptionsTmp.value.filter(st => st.id != 'Fail' && st.id != 'Pending')
  } else {
    statusOptions.value =  statusOptionsTmp.value.filter(st => st.id != 'Approve' && st.id != 'Review' && st.id != 'Reject')
  }
};

const getColorCode = (status,) => {
  if(status == "Success") {
    return "green";
  } else if(status == "Pending") {
    return "gray";
  } else if(status == "Fail") {
    return "red";
  } else if (status == 'Approve') {
    return "primary";
  }  else if (status == 'Reject') {
    return "orange";
  }
}

const onUpdatedCallBack = () => {
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "transactions.updated_at",
      transaction_type: filters.transaction_type,
    },
  });
};

onMounted(() => {
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "transactions.updated_at",
    },
    filter: undefined,
  });
});

const getTransactionByType = async () => {
  await paginate({
    pagination: {
      ...pagination.value,
      sortBy: "transactions.created_at",
      transaction_type: filters.transaction_type,
      descending: true,
    },
  });
};

watch(
  () => filters.transaction_type,
  () => {
    getTransactionByType();
  }
);

const viewApproval = (row) => {
  approval.value = true;
  selectedTransaction.value = row;
};

const viewAccounts = (row) => {
  account.value = true;
  selectedTransaction.value = row;
};

const viewDetial = (row) => {
  detail.value = true;
  selectedTransaction.value = row;
};

const viewTrasaction = (row) => {
  console.log("Row: ", row);
  selectedTransaction.value = row;
  if( row.transaction_type == "withdraw" && row.status == 'Review') {
      approval.value = true;
  } else if (row.transaction_type == 'withdraw' && ( row.status == "Approve" || row.status == "Fail" )) {
    account.value = true;
  } else {
    detail.value = true;
  }
};

const TranferAmount = async () => {
  counts.value = await (await getTransfer()).data;
};
TranferAmount();

const resetFilters = () => {
  console.log(filters);
  for (const [key, value] of Object.entries(filters)) {
    filters[key] = "";
  }

  active.value = 0;

  // range.value = null;
};
</script>
