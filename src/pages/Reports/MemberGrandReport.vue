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
          @request="onRequest"
          :rows-per-page-options="[10, 15, 20, 50, 100, 150, 200, 500]"
          binary-state-sort
          v-model:selected="selected"
          :rows-per-page-label="$t(Utils.getKey('Records per page'))"
        >
          <!-- :disable="!filters.include_downline" -->
          <template v-slot:top>
            <q-input
              v-model="filters.member_id"
              outlined
              dense
              class="q-mr-sm"
              :label="$t('member_id')"
              :option-label="(name) => $t(Utils.getKey(name))"
              clearable
            />

            <!-- <template v-slot:top> -->

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
                class="q-mr-sm"
                color="primary"
                :outline="dateSelect == 'today' ? false : true"
                style="margin-left: 10px; height: 40px; min-width: 116px !important;"
                @click="onDateSearch('today')"
              >
                {{ $t("today") }}
              </q-btn>
              <q-btn
                class="q-mr-sm"
                color="primary"
                :outline="dateSelect == 'yesterday' ? false : true"
                style="margin-left: 10px; height: 40px; min-width: 116px !important;"
                @click="onDateSearch('yesterday')"
              >
                {{ $t("yesterday") }}
              </q-btn>

              <q-btn
                class="q-mr-sm"
                color="primary"
                :outline="dateSelect == 'month' ? false : true"
                style="margin-left: 10px; height: 40px; min-width: 116px !important;"
                @click="onDateSearch('month')"
              >
                {{ $t(Utils.getKey("this month")) }}
              </q-btn>
              <q-btn
                class="q-mr-sm"
                color="primary"
                :outline="dateSelect == 'lastmonth' ? false : true"
                style="margin-left: 10px; height: 40px; min-width: 116px !important;"
                @click="onDateSearch('lastmonth')"
              >
                {{ $t(Utils.getKey("last month")) }}
              </q-btn>


            <!-- <q-space /> -->
            <!-- </template> -->


              <q-btn
                class="q-mr-sm q-px-sm q-ml-sm capitalize"
                color="primary"
                style="margin-left: 10px; height: 40px; min-width: 116px !important;"
                @click="onSearch"
                >{{ $t("search") }}</q-btn
              >
              <q-btn
                class="q-mr-sm q-px-sm q-ml-sm capitalize"
                color="warning"
                style="margin-left: 10px; height: 40px; min-width: 116px !important;"
                @click="resetFilters"
                >{{ $t("reset") }}</q-btn
              >

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

          <template v-slot:body-cell-upline>
            <q-td>
              {{ auth.state.user.agent_id }}
            </q-td>
          </template>

          <template v-slot:no-data>
            <q-icon
              style="margin-right: 5px"
              class="fas fa-exclamation-triangle"
            />
            {{ $t(Utils.getKey("No matching records found")) }}
          </template>

          <template v-slot:bottom-row v-if="items.length > 0">
            <q-tr>
              <q-td class="text-center">{{ $t(Utils.getKey("Total")) }} </q-td>
              <q-td> </q-td>
              <q-td class="text-center">
                {{ totalAmounts?.totalDepositedAmount || 0 }}
              </q-td>
              <q-td class="text-center">
                {{ totalAmounts?.totalBetAmounts || 0 }}
              </q-td>
              <q-td class="text-center">
                {{ totalAmounts?.totalWinAmounts || 0 }}
              </q-td>
              <q-td class="text-center">
                {{ totalAmounts?.totalActivityBonus || 0 }}
              </q-td>
              <q-td class="text-center">
                {{ totalAmounts?.totalWinLossAmount || 0 }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
      <Loading :loading="loading" />
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import useTable from "../../composables/useTable";
import moment from "moment";
import useMemberGrandReport from "../../composables/useMenberGrandReport";
import Utils from "../../helpers/Utils";
import { useQuasar, exportFile } from "quasar";
import { i18n } from "src/boot/i18n";
import auth from "src/store/auth";
import Loading from "src/components/Shared/Loading.vue";

const { loading, columns, items, totalAmounts, paginate } = useMemberGrandReport();
const { showEdit, showToggleClickConfirm, selected, pagination, onRequest } =
  useTable(paginate);

const $q = useQuasar();
const selectedUser = ref(null);

const defaultDate = [
  moment().startOf("day").format("YYYY-MM-DD"),
  moment().endOf("day").format("YYYY-MM-DD"),
];

const filters = ref({
  name: "",
  parent_id: auth.state.user.id,
  status: "all",
  level: [],
  include_downline: false,
  dates: defaultDate,
});

const onSearch = () => {
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "id",
      include_downline: false,
    },
    filter: filters.value,
  });
};

let filter = {
  parent_id: auth.state.user.id,
};
onMounted(() => {
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "id",
      include_downline: false,
    },
    filter: filters.value,
  });
});

const dates = ref([]);

const onEditClick = (row) => {
  showEdit.value = true;
  selectedUser.value = row;
};

const toggleSelect = ref({});

const onToggleClickConfirm = async (row) => {
  showToggleClickConfirm.value = true;
  toggleSelect.value = row;
};

const resetFilters = () => {
  let f = {
    name: "",
    parent_id: auth.state.user.id,
    status: "all",
    level: [],
    include_downline: false,
  };
  filters.value = f;
  dateSelect.value = "";
  onSearch();
};

const dateSelect = ref("today");
const onDateSearch = (date) => {
  dateSelect.value = date;
  if (date == "week") {
    filters.value.dates = [
      moment().weekday(1).format('YYYY-MM-DD'),
      moment().weekday(7).format('YYYY-MM-DD'),
    ];
  } else if (date == "yesterday") {
    filters.value.dates = [
      moment().subtract(1, "d").format("YYYY-MM-DD"),
      moment().subtract(1, "d").format("YYYY-MM-DD"),
    ];
  }
   else if (date == "month") {
    filters.value.dates = [
      moment().startOf('month').format('YYYY-MM-DD'),
      moment().endOf('month').format('YYYY-MM-DD'),
    ];
  } else if (date == "lastmonth") {
    filters.value.dates = [
      moment().subtract(1,'months').startOf('month').format('YYYY-MM-DD'),
      moment().subtract(1,'months').endOf('month').format('YYYY-MM-DD'),
    ];
  } else {
    filters.value.dates = [
      moment().startOf(date).format("YYYY-MM-DD"),
      moment().endOf(date).format("YYYY-MM-DD"),
    ];
  }
  onSearch();
};

function wrapCsvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
}

function exportTable() {
  // naive encoding to csv format
  const content = [columns.map((col) => wrapCsvValue(col.label))]
    .concat(
      items.value.map((row) =>
        columns
          .map((col) =>
            wrapCsvValue(
              typeof col.field === "function"
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
              col.format,
              row
            )
          )
          .join(",")
      )
    )
    .join("\r\n");

  const status = exportFile("table-export.csv", content, "text/csv");

  if (status !== true) {
    $q.notify({
      message: "Browser denied file download...",
      color: "negative",
      icon: "warning",
    });
  }
}

onMounted(() => {
  console.log(auth.state.user.id);
});
</script>
