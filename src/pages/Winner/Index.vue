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
              v-model="filters.deal_id"
              :placeholder="$t(Utils.getKey('Search By Deal Id'))"
              style="width: 200px; margin-right: 10px"
            />
            <q-input
              dense
              outlined
              debounce="300"
              v-model="filters.customer_id"
              :placeholder="$t(Utils.getKey('Search By Member Id'))"
              style="width: 200px; margin-right: 10px"
            />
            <q-input
              dense
              outlined
              debounce="300"
              v-model="filters.slot_id"
              :placeholder="$t(Utils.getKey('Search By Slot Id'))"
              style="width: 200px"
            />
            <q-select
              v-model="filters.shipping_status"
              :options="statusOptions"
              outlined
              dense
              emit-value
              :style="$q.platform.is.mobile ? 'width:100%' : 'width:200px'"
              map-options
              option-value="Status"
              :label="$t(Utils.getKey('Status'))"
              :option-label="(text) => $t(Utils.getKey(text))"
              clearable
              class="pa-2"
            />
            <el-date-picker
              class="input_white"
              v-model="filters.dates"
              type="daterange"
              value-format="YYYY-MM-DD"
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
            <q-space />
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

          <template v-slot:body-cell-total="props">
            <q-td class="text-center">
              {{
                parseInt(Math.abs(props.row.bot_count)) +
                parseInt(Math.abs(props.row.member_count))
              }}
            </q-td>
          </template>

          <template v-slot:body-cell-member_count="props">
            <q-td class="text-center">
              {{ parseInt(Math.abs(props.row.member_count)) }}
            </q-td>
          </template>

          <template v-slot:body-cell-bot_count="props">
            <q-td class="text-center">
              {{ parseInt(Math.abs(props.row.bot_count)) }}
            </q-td>
          </template>
          <template v-slot:body-cell-shipping_status="props">
            <q-td class="text-center">
              <span
                :class="
                  props.row.shipping_status == 'Cancelled' || props.row.shipping_status == 'Failed Delivery'  ? 'red' : 'green'
                "
              >
                {{ $t(Utils.getKey(props.row.shipping_status)) }}</span
              >
            </q-td>
          </template>

          <template v-slot:body-cell-revenue="props">
            <q-td class="text-center">
              <span
                class="text-bold"
                :class="
                  props.row?.revenue?.result_type?.toLowerCase() != 'profit'
                    ? 'red'
                    : 'green'
                "
              >
                {{
                  props.row?.revenue?.result_type?.toLowerCase() == "profit"
                    ? "+"
                    : ""
                }}
                {{
                  Utils.formatCurrency(
                    props.row?.revenue?.profit_loss_amount || 0
                  )
                }}</span
              >
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import useTable from "../../composables/useTable";
import useWinner from "../../composables/useWinner";
import Utils from "../../helpers/Utils";

const { loading, columns, items, trash, paginate } = useWinner();
const {
  showAdd,
  showEdit,
  selected,
  showConfirm,
  pagination,
  onDelete,
  onRequest,
  onRefresh,
} = useTable(paginate, trash);

const selectedCurrency = ref();
const showAddLanguage = ref(false);
const filters = reactive({
  name: "",
});
const statusOptions = ref([
  "Pending",
  "In Transit",
  "Delivered",
  "Failed Delivery",
  "Cancelled",
]);

onMounted(() => {
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "id",
    },
    filter: undefined,
  });
});

const resetFilters = () => {
  for (const [key, value] of Object.entries(filters)) {
    filters[key] = "";
  }

  range.value = null;
};
</script>
