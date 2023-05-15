<template>
  <q-page>
    <q-card style="margin-left: 0px; box-shadow: none; min-height: 85vh">
      <q-card-section v-if="!showMlmTreeView">
        <q-table
          flat
          color="primary"
          :loading="loading"
          :rows="items"
          row-key="id"
          :columns="columns"
          v-model:pagination="pagination"
          @request="onRequest"
          :rows-per-page-options="[10, 15, 20, 50, 100, 150, 200, 500]"
          binary-state-sort
          :rows-per-page-label="$t(Utils.getKey('Records per page'))"
        >
          <template v-slot:top>
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
                :outline="dateSelect == 'month' ? false : true"
                style="
                  margin-left: 10px;
                  height: 40px;
                  min-width: 125px !important;
                "
                @click="onDateSearch('month')"
              >
                {{ $t(Utils.getKey("this month")) }}
              </q-btn>
              <q-btn
                class="q-mr-sm"
                color="primary"
                :outline="dateSelect == 'lastmonth' ? false : true"
                style="
                  margin-left: 10px;
                  height: 40px;
                  min-width: 125px !important;
                "
                @click="onDateSearch('lastmonth')"
              >
                {{ $t(Utils.getKey("last month")) }}
              </q-btn>
            </div>

            <div class="mt-3">
              <q-btn
                class="q-mr-sm q-px-sm q-ml-sm capitalize"
                color="primary"
                style="
                  margin-left: 10px;
                  height: 40px;
                  min-width: 125px !important;
                "
                @click="onSearch"
                >{{ $t("search") }}</q-btn
              >
              <q-btn
                class="q-mr-sm q-px-sm q-ml-sm capitalize"
                color="warning"
                style="
                  margin-left: 10px;
                  height: 40px;
                  min-width: 125px !important;
                "
                @click="resetFilters"
                >{{ $t("reset") }}</q-btn
              >
            </div>

            <q-space />
            <div class="mt-3 clearfix">
              <q-btn
                class="q-mr-sm q-px-sm q-ml-sm capitalize"
                color="primary"
                style="
                  margin-left: 10px;
                  height: 40px;
                  min-width: 125px !important;
                "
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
          <!-- no data -->
          <template v-slot:no-data>
            <q-icon
              style="margin-right: 5px"
              class="fas fa-exclamation-triangle"
            />
            {{ $t(Utils.getKey("No matching records found")) }}
          </template>

          <template v-slot:body-cell-phone_number="props">
            <q-td class="text-left">
              {{ props.row.idd }}-{{ props.row.phone_number }}
            </q-td>
          </template>
          <template v-slot:body-cell-dates="props">
            <q-td class="text-left">
              {{ props.row.dates }}
            </q-td>
          </template>

          <template v-slot:body-cell-direct_member="props">
            <q-td class="text-center">
              {{ props.row.direct_member }}
            </q-td>
          </template>

          <template v-slot:body-cell-team_member="props">
            <q-td class="text-center">
              {{ props.row.team_member }}
            </q-td>
          </template>

          <template v-slot:body-cell-direct_member_bet_amount="props">
            <q-td class="text-right">
              {{ props.row.bet_amount }}
            </q-td>
          </template>

          <template v-slot:body-cell-team_member_bet_amount="props">
            <q-td class="text-right">
              {{ Utils.formatCurrency(props.row.team_bet_amount) }}
            </q-td>
          </template>

          <template v-slot:body-cell-direct_member_waiting_list="props">
            <q-td class="text-right">
              {{ Utils.formatCurrency(props.row.win_lose_amount) }}
            </q-td>
          </template>

          <template v-slot:body-cell-team_member_waiting_list="props">
            <q-td class="text-right">
              {{ Utils.formatCurrency(props.row.team_wl_amount) }}
            </q-td>
          </template>

          <template v-slot:body-cell-activity_bonus="props">
            <q-td class="text-right">
              {{ Utils.formatCurrency(props.row.activity_bonus) }}
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td class="text-center">
              <q-btn
                v-if="Utils.hasPermissions(['Members: Edit/Update Members'])"
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

              <q-btn
                v-if="Utils.hasPermissions(['User: Edit/Update User'])"
                class="q-mr-sm"
                size="xs"
                rounded
                padding="5px"
                color="primary"
                icon="mdi-filter-remove-outline"
                @click="onResetClick(props.row)"
              >
                <q-tooltip>{{ $t(Utils.getKey("Reset Password")) }}</q-tooltip>
              </q-btn>

              <q-btn
                v-if="Utils.hasPermissions(['Members: Edit/Update Members'])"
                class="q-mr-sm"
                size="xs"
                rounded
                padding="5px"
                color="primary"
                icon="fa fa-expand"
                @click="onShowMlmTreeClick(props.row)"
              >
                <q-tooltip>{{ $t(Utils.getKey("view mlm tree")) }}</q-tooltip>
              </q-btn>
            </q-td>
          </template>
          <template v-slot:bottom-row>
            <q-tr>
              <q-td class="text-center"> Total </q-td>
              <q-td class="text-center">
                {{ totalDirectMembers }}
              </q-td>
              <q-td class="text-center">
                {{ totalTeamMembers }}
              </q-td>
              <q-td class="text-right">
                {{ totalBetAmounts }}
              </q-td>
              <q-td class="text-right">
                {{ Utils.formatCurrency(totalTeamBetAmt) }}
              </q-td>
              <q-td class="text-right">
                {{ Utils.formatCurrency(totalWinAmounts) }}
              </q-td>
              <q-td class="text-right">
                {{ Utils.formatCurrency(totalTeamWlAmt) }}
              </q-td>
              <q-td class="text-right">
                {{ Utils.formatCurrency(totalActivityBns) }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
      <q-card-section v-else>
        <show-mlm-tree
          @onClose="showMlmTreeView = false"
          :data="selectedShowMlmTree"
          @onBack="onRefresh"
        />
      </q-card-section>
      <Loading :loading="loading" />
    </q-card>

    <q-dialog v-model="resetPassword" persistent>
      <reset
        :data="selectedMembers"
        @onClose="resetPassword = false"
        @onUpdated="resetPassword = false"
      />
    </q-dialog>

    <q-dialog v-model="showEdit" position="top" persistent>
      <edit-member
        :data="selectedMembers"
        @onClose="showEdit = false"
        @onUpdated="onRefresh"
      />
    </q-dialog>

    <q-dialog v-model="showConfirm" persistent>
      <confirm
        @confirm="onDelete"
        @cancel="showConfirm = false"
        message="Are you sure you want to delete this Member?"
        :button-label="$t(Utils.getKey('Delete'))"
      />
    </q-dialog>
    <!-- <q-dialog v-model="showMlmTreeView" position="top" persistent>

    </q-dialog> -->
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import useTable from "../../composables/useTable";
import moment from "moment";
import useDaily from "../../composables/useDailyReport";
import Utils from "../../helpers/Utils";
import { useQuasar, exportFile } from "quasar";
import { i18n } from "src/boot/i18n";
import auth from "src/store/auth";
import Loading from "src/components/Shared/Loading.vue";

const {
  loading,
  columns,
  items,
  totals,
  paginate,
  getAllLevelReferral,
  totalWalletAmounts,
  totalBetAmounts,
  totalWinAmounts,
  totalDirectMembers,
  totalTeamMembers,
  totalTeamBetAmt,
  totalTeamWlAmt,
  totalActivityBns,
} = useDaily();
const { showEdit, showToggleClickConfirm, selected, pagination, onRequest } =
  useTable(paginate);

const $q = useQuasar();
const selectedUser = ref(null);

const levelOptionsReferral = ref([]);
const allLevelAgenReferral = async () => {
  let res = await getAllLevelReferral();
  console.log("resLevelData", res.data);

  levelOptionsReferral.value = res.data;
};


const defaultDate = [
  moment().startOf("month").format("YYYY-MM-DD"),
  moment().endOf("month").format("YYYY-MM-DD"),
];

const filters = ref({
  member_ID: "",
  dates: [],
  // direct_member: "",
  status: "all",
  agent_referral_code: auth.state.user.referral_code,
  dates: defaultDate,
  // data: [auth.state.user.referral_code],
});

const onSearch = () => {
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "member_ID",
      agent_referral_code: auth.state.user.referral_code,
      all_agent_referral_code: levelOptionsReferral.value,
      dates: defaultDate,
      // data: [auth.state.user.referral_code],
    },
    filter: filters.value,
  });
  console.log('levelOptionsReferral', levelOptionsReferral.value);
};

onMounted(async () => {

  await  allLevelAgenReferral();
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "member_ID",
      agent_referral_code: auth.state.user.referral_code,
      all_agent_referral_code: levelOptionsReferral.value,
      dates: defaultDate,
      // data: [auth.state.user.referral_code],
    },
    filter: undefined,
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
    // parent_id: auth.state.user.id,
    status: "all",
    dates: defaultDate,
    // level: "",
    // include_downline: false,
  };
  filters.value = f;
  dateSelect.value = defaultDate;
  // onSearch();
  onDateSearch("month");
};

const dateSelect = ref("month");
const onDateSearch = (date) => {
  dateSelect.value = date;
  if (date == "month") {
    filters.value.dates = [
      moment().startOf("month").format("YYYY-MM-DD"),
      moment().endOf("month").format("YYYY-MM-DD"),
    ];
  } else if (date == "lastmonth") {
    filters.value.dates = [
      moment().subtract(1, "months").startOf("month").format("YYYY-MM-DD"),
      moment().subtract(1, "months").endOf("month").format("YYYY-MM-DD"),
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
