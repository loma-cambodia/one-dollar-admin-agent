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
            <q-select
              v-model="filters.level"
              :options="levelOptions"
              outlined
              style="width: 200px"
              dense
              emit-value
              map-options
              class="q-mr-sm"
              option-value="level"
              :label="$t('agent_level')"
              :option-label="
                (item) =>
                  item.levelLable == 'all'
                    ? $t(item.levelLable)
                    : 'L' + item.levelLable
              "
              multiple
            />
            <!-- <q-select
              v-model="filters.status"
              :options="['all', 'normal', 'locked']"
              outlined
              style="width: 200px"
              dense
              emit-value
              class="q-mr-sm q-mt-sm"
              map-options
              :label="$t('agent_status')"
              :option-label="(name) => $t(Utils.getKey(name))"
              clearable
            /> -->
            <q-input
              v-model="filters.agent_id"
              outlined
              dense
              class="q-mr-sm"
              :label="$t('agent_id')"
              :option-label="(name) => $t(Utils.getKey(name))"
              clearable
            />
            <q-checkbox
              v-model="filters.include_downline"
              :label="$t('include_downline')"
            />
            <!-- <el-date-picker
              class="q-mr-sm q-mt-sm"
              v-model="filters.dates"
              type="daterange"
              :range-separator="$t(Utils.getKey('To'))"
              :start-placeholder="$t(Utils.getKey('Start date'))"
              :end-placeholder="$t(Utils.getKey('End date'))"
              value-format="YYYY-MM-DD"
            /> -->

            <!-- <template v-slot:top> -->
            <div class="mt-3">
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
                style="margin-left: 18px; height: 40px; min-width: 116px !important;"
                @click="onDateSearch('today')"
              >
                {{ $t("today") }}
              </q-btn>
              <q-btn
                class="q-mr-sm"
                color="primary"
                :outline="dateSelect == 'yesterday' ? false : true"
                style="margin-left: 18px; height: 40px; min-width: 116px !important;"
                @click="onDateSearch('yesterday')"
              >
                {{ $t("yesterday") }}
              </q-btn>
              <q-btn
                class="q-mr-sm"
                color="primary"
                :outline="dateSelect == 'week' ? false : true"
                style="margin-left: 10px; height: 40px; min-width: 116px !important;"
                @click="onDateSearch('week')"
              >
                {{ $t(Utils.getKey("This Week")) }}
              </q-btn>
              <q-btn
                class="q-mr-sm"
                color="primary"
                :outline="dateSelect == 'lastweek' ? false : true"
                style="margin-left: 10px; height: 40px; min-width: 116px !important;"
                @click="onDateSearch('lastweek')"
              >
                {{ $t(Utils.getKey("Last Week")) }}
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
            </div>

            <!-- <q-space /> -->
            <!-- </template> -->

            <div class="mt-3">
              <q-btn
                class="q-mr-sm q-px-sm q-ml-sm capitalize"
                color="success"
                style="margin-left: 10px; height: 40px; min-width: 116px !important; background-color:#28a745 !important"
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
            </div>

            <q-space />
            <div class="mt-3 clearfix">
              <q-btn
                class="q-mr-sm q-px-sm q-ml-sm capitalize"
                color="info"
                style="margin-left: 10px; height: 40px; min-width: 116px !important;"
                @click="exportTable"
                >{{ $t("Export") }}</q-btn
              >
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
          <template v-slot:no-data>
            <q-icon
              style="margin-right: 5px"
              class="fas fa-exclamation-triangle"
            />
            {{ $t(Utils.getKey("No matching records found")) }}
          </template>

          <template v-slot:bottom-row>
            <q-tr>
              <q-td class="text-center">{{ $t(Utils.getKey("Total")) }} </q-td>
              <q-td> </q-td>
              <q-td class="text-center">
                {{ totals?.totalDirectAgent }}
              </q-td>
              <q-td class="text-center">
                {{ totals?.totalTeamAgent }}
              </q-td>
              <q-td class="text-center">
                {{ totals?.totalDirectMember }}
              </q-td>
              <q-td class="text-center">
                {{ totals?.totalTeamMember }}
              </q-td>
              <q-td class="text-right">
                {{ Utils.formatCurrency(totals?.totalTeamBetAmount) }}
              </q-td>
              <q-td class="text-right">
                {{ Utils.formatCurrency(totals?.totalTeamWL) }}
              </q-td>
              <!-- <q-td class="text-center">
                {{ totals?.totalPersonalComm }}
              </q-td>
              <q-td class="text-center">
                {{ totals?.totalTeamComm }}
              </q-td> -->
              <!-- <q-td> </q-td> -->
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
import useAgent from "../../composables/useConsolidated";
import Utils from "../../helpers/Utils";
import { useQuasar, exportFile } from "quasar";
import { i18n } from "src/boot/i18n";
import auth from "src/store/auth";
import Loading from "src/components/Shared/Loading.vue";

const { loading, columns, items, totals, paginate, getAllLevel } = useAgent();
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
const levelOptions = ref([]);

const allLevelAgen = async () => {
  let res = await getAllLevel();
  console.log("res", res);

  levelOptions.value = res.data;
  let all = {
    level: 'all',
    levelLable: "all",
  };
  levelOptions.value.unshift(all);
};

allLevelAgen();

const onSearch = () => {
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "agent_id",
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
      sortBy: "agent_id",
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
  else if (date == "lastweek") {
    filters.value.dates = [
      moment().weekday(-6).format('YYYY-MM-DD'),
      moment().weekday(0).format('YYYY-MM-DD'),
    ];
  } else if (date == "month") {
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
