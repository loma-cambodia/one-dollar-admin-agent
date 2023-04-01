<template>
  <q-page>

    <q-card style="margin-top:20px; margin-left:0px; box-shadow: none; min-height:85vh;">
      <q-card-section>
        <q-table flat class="q-pt-md" color="primary" :loading="loading" :rows="items" row-key="id" :columns="columns"
          v-model:pagination="pagination" :filter="filters" @request="onRequest"
          :rows-per-page-options="[10, 15, 20, 50, 100, 150, 200, 500]" binary-state-sort
          :rows-per-page-label="$t(Utils.getKey('Records per page'))">
          <template v-slot:top>
            <q-input dense outlined debounce="300" v-model="filters.name"
              :placeholder="$t(Utils.getKey('Search by name'))" style="width: 200px" />

            <q-select v-model="filters.status" :options="statusOptions" outlined dense emit-value
              :style="$q.platform.is.mobile ? 'width:100%' : 'width:150px'" map-options option-value="id"
              :label="$t(Utils.getKey('Status'))" option-label="name" clearable class="pa-2" />
            <el-date-picker class="q-ml-md input_white" v-model="filters.dates" type="daterange" value-format="YYYY-MM-DD"
              :start-placeholder="$t(Utils.getKey('Start Date'))" :end-placeholder="$t(Utils.getKey('End Date'))">
            </el-date-picker>
            <q-btn class="q-mr-sm q-mt-xs" dense color="primary" icon="mdi-filter-remove-outline" rounded
              style="margin-left: 10px" @click="resetFilters" />
            <q-space />

            <add-button v-if="Utils.hasPermissions(['Payment Gateway: Create Payment Gateway'])" :disable="loading"
              @click="showAdd = true" tooltip-text="Add" color="primary" />


            <!-- <div class="pa-5 d_flex_center">
                  <div class="d-flex">

                    <div class="card_1 third d-flex r_4 mx-3 pointer" :class="active == 'transfer_in' ? 'active_shadow' : ''"
                      @click="onClickActive('transfer_in')">
                      <img src="../../assets/like.png" style="height: 26px" />
                      <span class="px-3 green">{{ $t("transfer_in") }}</span>
                      <div class="count">
                        <span>{{ counts.transfer_in || 0 }}</span>
                      </div>
                    </div>
                    <div class="card_1 secondary d-flex r_4 mx-3 pointer"
                      :class="active == 'transfer_out' ? 'active_shadow' : ''" @click="onClickActive('transfer_out')">
                      <img src="../../assets/time-out.png" style="height: 26px" />
                      <span class="px-3 orange">{{ $t("transfer_out") }}</span>
                      <div class="count">
                        <span>{{ counts?.transfer_out || 0 }}</span>
                      </div>
                    </div>
                  </div>
                </div> -->
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
            <q-icon style="margin-right: 5px" class="fas fa-exclamation-triangle" />
            {{ $t(Utils.getKey("No matching records found")) }}
          </template>
          <template v-slot:body-cell-sl="props">
            <q-td>
              {{ props.rowIndex + 1 }}
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td class="text-center">
              <q-btn
                v-if="Utils.hasPermissions(['Payment Gateway: Update Payment Gateway'])"
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


    <q-dialog v-model="showAdd" position="top" persistent>
      <add-payment @onClose="showAdd = false" @onAdded="onRefresh" />
    </q-dialog>


    <q-dialog v-model="showEdit" position="top" persistent>
      <edit-payment
        :data="selectedPayment"
        @onClose="showEdit = false"
        @onUpdated="onRefresh"
      />
    </q-dialog>

  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import useTable from "../../composables/useTable";
import usePayment from "../../composables/usePayment";
import Utils from "../../helpers/Utils";

import AddButton from "../../components/Buttons/AddButton.vue";
import EditPayment from "../../components/PaymentGateway/Edit.vue";
import AddPayment from "../../components/PaymentGateway/Add.vue";

const { loading, columns, items, trash, paginate } = usePayment();
const {
  showAdd,
  showEdit,
  selected,
  showConfirm,
  pagination,
  onRequest,
  onRefresh,
} = useTable(paginate, trash);

const selectedPayment = ref();
const filters = reactive({
  transaction_ID: "",
  transaction_type: ""
});

const active = ref(0)

const statusOptions = ref([
  {
    "id": 'active',
    "name": "Active"
  },
  {
    "id": 'inactive',
    "name": "Inactive"
  }
])

const onClickActive = (val) => {
  active.value = val;
  filters.transaction_type = val;
}

onMounted(() => {
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "created_at",
    },
    filter: undefined,
  });
})

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

const onEditClick = (row) => {
  showEdit.value = true;
  selectedPayment.value = row;
};


const resetFilters = () => {
  for (const [key, value] of Object.entries(filters)) {
    filters[key] = "";
  }

  // range.value = null;
}
</script>
