<template>
  <q-page :class="!store.leftDrawerOpen ? 'ml-5' : ''">
    <q-card
      class="mt-3"
      style="margin-left: 0px; box-shadow: none; min-height: 100vh"
    >
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
              debounce="300"
              v-model="filters.search"
              :placeholder="$t(Utils.getKey('Search'))"
              style="width: 300px"
            />
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

            <add-button
              v-if="
                Utils.hasPermissions(['WinnerGallery: Create WinnerGallery'])
              "
              :disable="loading"
              @click="showAdd = true"
              tooltip-text="Add"
              color="primary"
            />
            <q-btn
              v-if="
                Utils.hasPermissions(['WinnerGallery: Create WinnerGallery'])
              "
              @click="showConfirmNotifi = true"
              round
              dense
              color="green"
              icon="mdi-bell"
              class="q-pa-sm ml-3"
            >
              <q-tooltip>{{ $t(Utils.getKey("Push Notification")) }}</q-tooltip>
            </q-btn>
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
          <template v-slot:body-cell-title="props">
            <q-td>
              {{
                props.row?.translations[locale]?.title?.length > 30
                  ? props.row?.translations[locale]?.title?.substring(0, 30) +
                    "..."
                  : props.row?.translations[locale]?.title
              }}
            </q-td>
          </template>
          <template v-slot:body-cell-description="props">
            <q-td>
              {{
                props.row?.translations[locale]?.description?.length > 30
                  ? props.row?.translations[locale]?.description?.substring(
                      0,
                      30
                    )
                  : props.row?.translations[locale]?.description
              }}
            </q-td>
          </template>
          <template v-slot:body-cell-status="props">
            <q-td class="text-center">
              <q-chip
                size="sm"
                :label="$t(props.row.status)"
                :color="getStatusColor(props)"
                :class="'text-white'"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td class="text-center">
              <q-btn
                v-if="
                  Utils.hasPermissions([
                    'WinnerGallery: Edit/Update WinnerGallery',
                  ])
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

              <q-btn
                v-if="
                  Utils.hasPermissions(['WinnerGallery: Create WinnerGallery'])
                "
                class="q-mr-sm"
                size="xs"
                rounded
                padding="5px"
                color="negative"
                icon="fas fa-trash"
                @click="onDeleteClick(props.row)"
              >
                <q-tooltip>{{ $t(Utils.getKey("Edit")) }}</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <Loading :loading="loading" />
    </q-card>

    <q-dialog v-model="showAdd" position="top" persistent>
      <add-broadcast
        :languages="languages"
        @onClose="showAdd = false"
        @onAdded="onRefresh"
      />
    </q-dialog>

    <q-dialog v-model="showEdit" position="top" persistent>
      <edit-broadcast
        :languages="languages"
        :data="selectedCategory"
        @onClose="showEdit = false"
        @onUpdated="onRefresh"
      />
    </q-dialog>

    <q-dialog v-model="showConfirm" persistent>
      <confirm
        @confirm="onDelete"
        @cancel="showConfirm = false"
        message="Are you sure you want to delete it"
        :button-label="$t(Utils.getKey('Delete'))"
      />
    </q-dialog>

    <q-dialog v-model="showConfirmNotifi" persistent>
      <confirm
        @confirm="onPushNofi"
        @cancel="showConfirmNotifi = false"
        message="Do you want to push notification"
        :button-label="$t(Utils.getKey('ok'))"
      />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref, inject } from "vue";
import useTable from "../../composables/useTable";
import userBroadcast from "../../composables/userBroadcast";
import Utils from "../../helpers/Utils";
import Loading from "src/components/Shared/Loading.vue";
import { store } from "../../store/store";
import AddButton from "../../components/Buttons/AddButton.vue";
import EditBroadcast from "../../components/Broadcast/Edit.vue";
import AddBroadcast from "../../components/Broadcast/Add.vue";
import Confirm from "../../components/Shared/Confirm.vue";
import useLanguage from "src/composables/useLanguage";
import { api } from "../../boot/axios";

const { all } = useLanguage();
const locale = inject("locale");
const { loading, columns, items, trash, paginate } = userBroadcast();
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
const languages = ref([]);
const selectedCategory = ref();
const filters = reactive({
  search: "",
});

const showConfirmNotifi = ref(false)

const onPushNofi = async () => {
  if (process.env.DEV) {
    let resonse = await api.get(
      "http://one-shop-mob.kk-lotto.com:8080/api/demoPushNoti"
    );
    console.log("resonse dev", resonse);
  } else {
    let resonse = await api.get("https://the1shops.com:10000/api/demoPushNoti");
    console.log("resonse prod", resonse);
  }
};

Promise.all([getData()]);
async function getData() {
  try {
    const response = await all();
    languages.value = response.data;
  } catch (error) {}
}

onMounted(() => {
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "created_at",
    },
    filter: undefined,
  });

  console.log("env=", process.env.DEV);
});

const onEditClick = (row) => {
  showEdit.value = true;
  selectedCategory.value = row;
};

const onDeleteClick = (row) => {
  showConfirm.value = true;
  selected.value = [row];
};

const getStatusColor = (props) => {
  if (props.row.status === "active") {
    return "positive";
  }
  return "negative";
};

const resetFilters = () => {
  for (const [key, value] of Object.entries(filters)) {
    filters[key] = "";
  }

  range.value = null;
};
</script>
