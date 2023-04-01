<template>
  <q-card style="margin-left: 0px; box-shadow: none; min-height: 85vh">
    <q-card-section>
      <q-table
        flat
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
            debounce="250"
            v-model="filters.search"
            :label="$t(Utils.getKey('Search'))"
            style="width: 250px"
          />

          <q-select v-model="filters.status" :options="statusOptions" outlined dense emit-value
              :style="$q.platform.is.mobile ? 'width:100%' : 'width:150px'" map-options option-value="Status"
              :label="$t(Utils.getKey('Status'))" option-label="Status" clearable class="pa-2" />

          <el-date-picker
            class="q-ml-md input_white"
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
          <!-- <q-space />
          <add-button
            v-if="Utils.hasPermissions(['Product: Create Product'])"
            :disable="loading"
            @click="showAdd = true"
            tooltip-text="Add"
            color="primary"
          /> -->
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

        <template v-slot:body-cell-customer_id="props">
          <q-td>
              <span>Name: <b>{{ props.row.customer?.first_name }} {{ props.row.customer?.last_name }}</b></span><br>
              <span>Contact Number: <b>{{ props.row.customer?.idd }}{{ props.row.customer?.phone_number }}</b></span>
          </q-td>
        </template>

        <template v-slot:body-cell-carrier_id="props">
          <q-td>
              <span>Name: <b>{{ props.row.carrier?.name || "Not Availbale" }}</b></span><br>
              <span>Contact Number: <b>{{ props.row.carrier?.contact_no || "Not Availbale"}}</b></span><br>
              <span>Contact Email: <b>{{ props.row.carrier?.email || "Not Availbale"}}</b></span>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td class="text-center">
            <span class="pointer">
              <q-chip
                :label="$t(Utils.getKey(props.row.status))?.toUpperCase()"
                :color="getStatusColor(props)"
                size="sm"
                :class="
                  props.row.status !== 'active' ? 'text-white' : 'text-white'
                "
              />
            </span>
          </q-td>
        </template>
        <!-- action -->
        <!-- <template v-slot:body-cell-actions="props">
          <q-td class="text-center">

          </q-td>
        </template> -->
      </q-table>
    </q-card-section>
    <Loading :loading="loading" />
  </q-card>
  <q-dialog v-model="showAdd" position="top" persistent>
  </q-dialog>

  <q-dialog v-model="showEdit" position="top" persistent>
  </q-dialog>


</template>

<script setup>
import { onMounted, reactive, ref, inject, watch } from "vue";
import moment from "moment";
import useTable from "../../composables/useTable";
import Utils from "../../helpers/Utils";
import Loading from "src/components/Shared/Loading.vue";
import Confirm from "src/components/Shared/Confirm.vue";
import AddButton from "../../components/Buttons/AddButton.vue";
import useShipping from '../../composables/useShipping'

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const currency_id = inject("currency_id");
const locale = inject("locale");
const { loading, columns, items, trash, paginate } = useShipping();
const {
  showAdd,
  showEdit,
  selected,
  showConfirm,
  pagination,
  onRequest,
  onRefresh,
} = useTable(paginate, trash);

// ref
const filters = reactive({
  search: "",
  category_id: '',
});

// end
const statusOptions = ref(['Pending','In Transit','Delivered','Returned To Seller','Failed Delivery','Cancelled'])

const getStatusColor = (props) => {
  if (props.row.status === "active") {
    return "positive";
  }

  if (props.row.status === "inactive") {
    return "negative";
  }

  return "gray";
};

// vue api section
onMounted(() => {
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "created_at",
    },
    filter: undefined,
  });
});
//end

</script>
<style scoped>

</style>
