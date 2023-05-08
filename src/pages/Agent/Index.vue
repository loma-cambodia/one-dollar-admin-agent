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
              class="q-mr-sm q-mt-sm"
              option-value="level"
              :label="$t('agent_level')"
              :option-label="
                (item) =>
                  item.levelLable == 'all'
                    ? $t(item.levelLable)
                    : 'L' + item.levelLable
              "
              clearable
            />
            <q-select
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
            />
            <el-date-picker
              class="q-mr-sm q-mt-sm"
              v-model="filters.dates"
              type="daterange"
              :range-separator="$t(Utils.getKey('To'))"
              :start-placeholder="$t(Utils.getKey('Start date'))"
              :end-placeholder="$t(Utils.getKey('End date'))"
              value-format="YYYY-MM-DD"
            />
            <q-input
              v-model="filters.agent_id"
              outlined
              style="width: 200px"
              dense
              class="q-mr-sm q-mt-sm"
              :label="$t('agent_id')"
              :option-label="(name) => $t(Utils.getKey(name))"
              clearable
            />
            <q-checkbox
              v-model="filters.include_downline"
              :label="$t('include_downline')"
            />
            <q-btn
              class="q-mr-sm q-px-sm q-ml-sm capitalize"
              color="primary"
              @click="onSearch"
              >{{ $t("search") }}</q-btn
            >
            <q-btn
              class="q-mr-sm q-px-sm q-ml-sm capitalize"
              color="warning"
              @click="resetFilters"
              >{{ $t("reset") }}</q-btn
            >

            <!---<q-btn
              class="q-mr-sm q-mt-sm"
              dense
              color="primary"
              icon="mdi-filter-remove-outline"
              rounded
              style="margin-left: 10px"
              @click="resetFilters"
            /> -->
            <q-space />

            <q-btn
              :disable="loading"
              @click="showAdd = true"
              color="primary"
              :label="$t('new_agent')"
            />
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
          <template v-slot:body-cell-sl="props">
            <q-td>
              {{ props.rowIndex + 1 }}
            </q-td>
          </template>

          <!-- <template v-slot:body-cell-enable_ga="props">
            <q-td class="text-center">
              <div>
                <q-toggle
                  ref="toggleRef"
                  style="height: 32px"
                  :modelValue="props.row.enable_ga"
                  checked-icon="check"
                  color="green"
                  :label="
                    props.row.enable_ga == 0
                      ? $t(Utils.getKey('off'))
                      : $t(Utils.getKey('on'))
                  "
                  unchecked-icon="clear"
                  :true-value="1"
                  :false-value="0"
                  size="40px"
                  @update:model-value="onToggleClick(props.row)"
                />
              </div>
            </q-td>
          </template> -->

          <template v-slot:body-cell-status="props">
            <q-td class="text-center">
              <div>
                {{ props.row.level == 2 || props.row.level >= 2 ? " " : "..." }}
                <q-toggle
                  v-if="props.row.level == 2 || props.row.level >= 2"
                  ref="toggleRef"
                  style="height: 32px"
                  :modelValue="
                    props.row.status == 'normal' || props.row.status == null
                      ? 'normal'
                      : 'locked'
                  "
                  checked-icon="check"
                  color="green"
                  :label="
                    props.row.status == 'locked'
                      ? $t(Utils.getKey('locked'))
                      : $t(Utils.getKey('on'))
                  "
                  unchecked-icon="clear"
                  :true-value="'normal'"
                  :false-value="'locked'"
                  size="40px"
                  @click="onToggleClickConfirm(props.row)"
                />
              </div>
              <!-- @update:model-value="onToggleClick(props.row)" -->
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td class="text-center">
              {{ props.row.level == 2 || props.row.level >= 2 ? " " : "..." }}
              <q-btn
                class="q-ml-sm"
                size="xs"
                rounded
                padding="5px"
                v-if="props.row.level == 2"
                color="primary"
                icon="fas fa-pen"
                @click="onEditClick(props.row)"
              >
                <q-tooltip>{{ $t(Utils.getKey("Edit")) }}</q-tooltip>
              </q-btn>
              <q-btn
                class="q-ml-sm"
                size="xs"
                v-if="props.row.level == 2"
                rounded
                padding="5px"
                color="negative"
                icon="mdi-filter-remove-outline"
                @click="onResetProfitClick(props.row)"
              >
                <q-tooltip>{{ $t(Utils.getKey("Reset Profit")) }}</q-tooltip>
              </q-btn>
              <q-btn
                class="q-ml-sm"
                size="xs"
                rounded
                v-if="props.row.level >= 2"
                padding="5px"
                color="primary"
                icon="mdi-filter-remove-outline"
                @click="onResetClick(props.row)"
              >
                <q-tooltip>{{ $t(Utils.getKey("Reset Password")) }}</q-tooltip>
              </q-btn>

              <q-btn
                class="q-ml-sm"
                size="xs"
                rounded
                v-if="props.row.level == 2"
                padding="5px"
                color="primary"
                icon="mdi-google-plus"
                @click="onResetClickGoogle(props.row)"
              >
                <q-tooltip>{{
                  $t(Utils.getKey("reset google authenticator"))
                }}</q-tooltip>
              </q-btn>
              <q-btn
                class="q-ml-sm"
                size="xs"
                v-if="props.row.level >= 2"
                rounded
                padding="5px"
                color="negative"
                icon="fas fa-trash"
                @click="
                  props.row.team_agent == 0
                    ? onDeleteClick(props.row)
                    : onDeleteClickNotDelete(props.row)
                "
              >
                <q-tooltip>{{ $t(Utils.getKey("Delete")) }}</q-tooltip>
              </q-btn>
              <!-- <q-btn
                class="q-ml-sm"
                size="xs"
                v-if="props.row.level >= 2"
                rounded
                padding="5px"
                color="negative"
                icon="fas fa-trash"
                @click="onDeleteClickNotDelete(props.row)"
              >
                <q-tooltip>{{ $t(Utils.getKey("Delete")) }}</q-tooltip>
              </q-btn> -->
            </q-td>
          </template>
        </q-table>
        <div>
          <p>
            {{ total == 0 ? "" : $t("total_agent") + " : " + total }}
            {{
              totalMember == 0 ? "" : $t("total_member") + " : " + totalMember
            }}
          </p>
        </div>
      </q-card-section>
    <Loading :loading="loading" />
    </q-card>

    <q-dialog v-model="showAdd" position="top" persistent>
      <add-user @onClose="showAdd = false" @onAdded="onRefresh(filter)" />
    </q-dialog>

    <q-dialog v-model="showEdit" position="top" persistent>
      <edit-user
        :data="selectedUser"
        @onClose="showEdit = false"
        @onUpdated="onRefresh(filter)"
      />
    </q-dialog>

    <q-dialog v-model="resetPassword" persistent>
      <reset
        :data="selectedUser"
        @onClose="resetPassword = false"
        @onUpdated="resetPassword = false"
      />
    </q-dialog>

    <q-dialog v-model="showConfirm" persistent>
      <Confirm
        :message="`Are you sure you want to delete it`"
        @cancel="showConfirm = false"
        @confirm="onDelete()"
        :deleting="deleting"
      />
    </q-dialog>

    <q-dialog v-model="showConfirmResteProfit" persistent>
      <Confirm
        :message="`Are you sure you want to reset profit`"
        @cancel="showConfirmResteProfit = false"
        @confirm="onProfitReset()"
        :buttonLabel="$t('reset')"
        :deleting="deleting"
      />
    </q-dialog>
    <q-dialog v-model="showToggleClickConfirm" persistent>
      <Confirm
        :message="`Are you sure`"
        @cancel="showToggleClickConfirm = false"
        @confirm="onToggleClick()"
        :buttonLabel="$t('reset')"
        :deleting="deleting"
      />
    </q-dialog>
    <q-dialog v-model="showGoogleKeyConfirm" persistent>
      <Confirm
        :message="`Reset google authenticator`"
        @cancel="showGoogleKeyConfirm = false"
        @confirm="updateUser()"
        :deleting="saving"
        :button-label="$t(Utils.getKey('confirm'))"
      />
    </q-dialog>

    <q-dialog v-model="showDisbleGauth" persistent>
      <Confirm
        :message="`Turn ${
          selectedUser.enable_ga == true ? 'Off' : 'On'
        } google authenticator`"
        @cancel="showDisbleGauth = false"
        @confirm="updateUser()"
        :button-label="$t(Utils.getKey('confirm'))"
      />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import useTable from "../../composables/useTable";
import moment from "moment";
import useAgent from "../../composables/useAgent";
import Utils from "../../helpers/Utils";
import { useQuasar } from "quasar";
import { i18n } from "src/boot/i18n";
import Breadcrumbs from "../../components/Menu/BreadCrumbs.vue";
import AddButton from "../../components/Buttons/AddButton.vue";
import DeleteButton from "../../components/Buttons/DeleteButton.vue";
import AddUser from "../../components/Agent/Add.vue";
import EditUser from "../../components/Agent/Edit.vue";
import Reset from "../../components/Agent/Reset.vue";
import Confirm from "../../components/Shared/Confirm.vue";
import auth from "src/store/auth";
import Loading from "src/components/Shared/Loading.vue";

const {
  loading,
  total,
  totalMember,
  deleting,
  columns,
  items,
  trash,
  paginate,
  isDeteteAble,
  update,
  saving,
  getAllLevel,
  resetProfit,
} = useAgent();
const {
  showAdd,
  showEdit,
  showConfirm,
  showConfirmResteProfit,
  showToggleClickConfirm,
  selected,
  pagination,
  onRequest,
  onRefresh,
  onDelete,
} = useTable(paginate, trash);

const $q = useQuasar();
const selectedUser = ref(null);
const filters = ref({
  name: "",
  parent_id: auth.state.user.id,
  status: "all",
  level: "",
  include_downline: false,
});
const levelOptions = ref([]);

const allLevelAgen = async () => {
  let res = await getAllLevel();
  console.log("res", res);

  levelOptions.value = res.data;
  let all = {
    level: "",
    levelLable: "all",
  };
  levelOptions.value.unshift(all);
};

allLevelAgen();

const profitSelect = ref({});
const onProfitReset = async () => {
  try {
    let res = await resetProfit(profitSelect.value.id);
    showConfirmResteProfit.value = false;
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "mdi-update",
      message: i18n.global.t(Utils.getKey(res.data.messages[0])),
    });
  } catch (err) {
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: err.toString(),
    });
  }
};

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
const showGoogleKeyConfirm = ref(false);
const resetPassword = ref(false);
const showDisbleGauth = ref(false);

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
const defaultDate = [
  moment().startOf("day").format("YYYY-MM-DD"),
  moment().endOf("day").format("YYYY-MM-DD"),
];

// const filters = reactive({
//   user_id: "",
//   event: "",
//   auditable_type: "",
//   dates: defaultDate,
// });

const onEditClick = (row) => {
  showEdit.value = true;
  selectedUser.value = row;
};

const onResetProfitClick = async (row) => {
  // let res = await isDeteteAble(row.id);
  // if (res.data) {
  //   if (res.data.length > 0) {
  //     showNotEditable.value = true;
  //     return;
  //   }
  // }
  showConfirmResteProfit.value = true;
  profitSelect.value = row;
};
const onDeleteClick = async (row) => {
  // let res = await isDeteteAble(row.id);
  // if (res.data) {
  //   if (res.data.length > 0) {
  //     showNotEditable.value = true;
  //     return;
  //   }
  // }
  showConfirm.value = true;
  selected.value = [];
  selected.value.push(row);
};
const onDeleteClickNotDelete = () => {
  $q.notify({
    position: "top-right",
    type: "negative",
    icon: "fas fa-exclamation-triangle",
    message: i18n.global.t(Utils.getKey("not able to delete")),
  });
};
const onResetClick = async (row) => {
  resetPassword.value = true;
  selectedUser.value = row;
};
const onResetClickGoogle = async (row) => {
  showGoogleKeyConfirm.value = true;
  selectedUser.value = row;
};

// const onToggleClick = async (val) => {
//   // showDisbleGauth.value = true;
//   selectedUser.value = val;
//   selectedUser.value.status =
//     selectedUser.value.status == "normal" || selectedUser.value.status == null
//       ? "locked"
//       : "normal";
//   await update(selectedUser.value.id, { ...selectedUser.value });
// };

const toggleSelect = ref({});
const onToggleClick = async () => {
  showToggleClickConfirm.value = false;
  selectedUser.value = toggleSelect.value;
  selectedUser.value.status =
    selectedUser.value.status == "normal" || selectedUser.value.status == null
      ? "locked"
      : "normal";
  await update(selectedUser.value.id, { ...selectedUser.value });
  $q.notify({
    position: "top-right",
    type: "positive",
    icon: "mdi-update",
    message: i18n.global.t(Utils.getKey("updated successfully")),
  });
};

const onToggleClickConfirm = async (row) => {
  showToggleClickConfirm.value = true;
  toggleSelect.value = row;
};

const resetFilters = () => {
  let f = {
    name: "",
    parent_id: auth.state.user.id,
    status: "all",
    level: "",
    include_downline: false,
  };
  filters.value = f;
  onSearch();
};

const updateUser = async () => {
  try {
    if (!showDisbleGauth.value) {
      selectedUser.value.google2fa_secret = null;
    } else {
      selectedUser.value.enable_ga = selectedUser.value.enable_ga == 0 ? 1 : 0;
    }
    await update(selectedUser.value.id, { ...selectedUser.value });
    onRefresh();
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "mdi-update",
      message: i18n.global.t(Utils.getKey("updated successfully")),
    });
    showGoogleKeyConfirm.value = false;
    showDisbleGauth.value = false;
  } catch (err) {
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: err.toString(),
    });
  }
};

onMounted(() => {
  console.log(auth.state.user.id);
});
</script>
