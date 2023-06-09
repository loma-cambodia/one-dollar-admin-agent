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
          v-model:selected="selected"
          :rows-per-page-label="$t(Utils.getKey('Records per page'))"
        >
          <template v-slot:top>
            <q-select
              v-model="filters.level"
              :options="['level 1', 'level 2', 'level 3', 'level 4']"
              outlined
              style="width: 200px"
              dense
              emit-value
              class="q-mr-sm q-mt-sm"
              map-options
              :label="$t('agent_level')"
              :option-label="(name) => $t(Utils.getKey(name))"
              clearable
            />
            <q-select
              v-model="filters.status"
              :options="['All', 'Normal', 'Locked']"
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
            <q-input
              dense
              class="q-mr-sm q-mt-sm"
              outlined
              debounce="300"
              v-model="filters.agent_ID"
              :placeholder="$t(Utils.getKey('agent_id'))"
              style="width: 300px"
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
            <q-checkbox :label="$t('include_downline')" val="0" />

            <q-btn
              class="q-mr-sm q-mt-sm"
              dense
              color="primary"
              icon="mdi-filter-remove-outline"
              rounded
              style="margin-left: 10px"
              @click="resetFilters"
            />
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

          <template v-slot:body-cell-enable_ga="props">
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
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td class="text-center">
              <q-btn
                class="q-ml-sm"
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
                class="q-ml-sm"
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
                class="q-ml-sm"
                size="xs"
                rounded
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
                rounded
                padding="5px"
                color="negative"
                icon="fas fa-trash"
                @click="onDeleteClick(props.row)"
              >
                <q-tooltip>{{ $t(Utils.getKey("Delete")) }}</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="showAdd" position="top" persistent>
      <add-user @onClose="showAdd = false" @onAdded="onRefresh" />
    </q-dialog>

    <q-dialog v-model="showEdit" position="top" persistent>
      <edit-user
        :data="selectedUser"
        @onClose="showEdit = false"
        @onUpdated="onRefresh"
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

const {
  loading,
  deleting,
  columns,
  items,
  trash,
  paginate,
  isDeteteAble,
  update,
  saving,
} = useAgent();
const {
  showAdd,
  showEdit,
  showConfirm,
  selected,
  pagination,
  onRequest,
  onRefresh,
  onDelete,
} = useTable(paginate, trash);

const $q = useQuasar();
const selectedUser = ref(null);
const filters = reactive({
  // name: "",
  agent_id: "",
});

const showGoogleKeyConfirm = ref(false);
const resetPassword = ref(false);
const showDisbleGauth = ref(false);

onMounted(() => {
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "agent_id",
    },
    filter: undefined,
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
const onResetClick = async (row) => {
  resetPassword.value = true;
  selectedUser.value = row;
};
const onResetClickGoogle = async (row) => {
  showGoogleKeyConfirm.value = true;
  selectedUser.value = row;
};

const onToggleClick = (val) => {
  showDisbleGauth.value = true;
  selectedUser.value = val;
  console.log("selct=", selectedUser);
};

const resetFilters = () => {
  for (const [key, value] of Object.entries(filters)) {
    filters[key] = "";
  }

  range.value = null;
};

const updateUser = async () => {
  try {
    if (!showDisbleGauth.value) {
      selectedUser.value.google2fa_secret = null;
    } else {
      selectedUser.value.enable_ga = selectedUser.value.enable_ga == 0 ? 1 : 0;
    }
    // let mer = [];
    // selectedUser.value.merchants.map((m) => {
    //   mer.push(m.id);
    // });
    selectedUser.value.application_id = "";
    if (selectedUser.value?.applications > 0) {
      selectedUser.value.application_id =
        selectedUser.value?.applications?.[0].id;
    }

    selectedUser.value.role_id = selectedUser.value?.roles[0]?.id;
    await update(selectedUser.value.id, { ...selectedUser.value });
    onRefresh();
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "positive",
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
</script>
