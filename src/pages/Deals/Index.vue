<template>
  <q-page :class="!store.leftDrawerOpen ? 'ml-5' : ''">
    <q-card
      style="
        margin-top: 20px;
        margin-left: 0px;
        box-shadow: none;
        min-height: 85vh;
      ">
      <q-card-section class="pt-0" v-if="!isDetialView">
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
              debounce="260"
              v-model="filters.deal_id"
              :placeholder="$t(Utils.getKey('Search Deal Id'))"
              style="width: 260px; margin-right: 10px;"
            />

            <q-input
              dense
              outlined
              debounce="260"
              v-model="filters.name"
              :placeholder="$t(Utils.getKey('Search Name'))"
r="$t(Utils.getKey('Search'))"
     />
            <!-- <q-select
              v-model="filters.status"
              style="width: 200px"
              :options="statusOptions"
              outlined
              dense
              emit-value
              map-options
              class="q-ml-md"
              option-value="status"
              option-label="status"
              :label="$t(Utils.getKey('Status'))"
              clearable
              @filter="filterStatus"
            /> -->
            <q-btn
              class="q-mr-sm q-mt-xs"
              dense
              color="primary"
              icon="mdi-filter-remove-outline"
              rounded
              style="margin-left: 10px"
              @click="resetFilters"
            />
            <br />
            <div class="pa-5 d_flex_center">
              <div class="d-flex">
                <div
                  class="card_1 primary d-flex r_4 pointer"
                  :class="active == 'active' ? 'active_shadow' : ''"
                  @click="onClickActive('active')"
                >
                  <img
                    src="../../assets/mdi_gift-open.png"
                    style="height: 26px"
                  />
                  <span class="px-3 white">{{ $t("open_deals") }}</span>
                  <div class="count">
                    <span>{{counts.active_slots || 0}}</span>
                  </div>
                </div>
                <div
                  class="card_1 secondary d-flex r_4 mx-3 pointer"
                  :class="active == 'expired' ? 'active_shadow' : ''"
                  @click="onClickActive('expired')"
                >
                  <img src="../../assets/time-out.png" style="height: 26px" />
                  <span class="px-3 orange">{{ $t("expired_deals") }}</span>
                  <div class="count">
                                <span>{{counts.expired_slots || 0}}</span>
                  </div>
                </div>
                <div
                  class="card_1 third d-flex r_4 mr-3 pointer"
                  :class="active == 'inactive' ? 'active_shadow' : ''"
                  @click="onClickActive('inactive')"
                >
                  <img src="../../assets/like.png" style="height: 26px" />
                  <span class="px-3 green">{{ $t("fulfilled_deals") }}</span>
                  <div class="count">
                       <span>{{counts.fulfilled_slots || 0}}</span>
                  </div>
                </div>
                <div
                  class="card_1 four d-flex r_4 pointer"
                  :class="active == 'settled' ? 'active_shadow' : ''"
                  @click="onClickActive('settled')"
                >
                  <img src="../../assets/gift_blue.png" style="height: 26px" />
                  <span class="px-3 blue">{{ $t("settled_deals") }}</span>
                  <div class="count">
                    <span>{{counts.settled_slots || 0}}</span>
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
          <template v-slot:body-cell-product_id="props">
            <q-td class="text-left">
               {{$t('deal_id')}}:
              <span class="blue pointer" @click="showDetial(props.row)">
                {{ props.row.deal_id }}
              </span>
              <span>
                  <br />
                {{
                  props.row.products?.translations[local]?.name.length > 30
                    ? props.row.products?.translations[local]?.name.substring(
                        0,
                        30
                      ) + "..."
                    : props.row.products?.translations[local]?.name
                }}
              </span>
            </q-td>
          </template>
          <template v-slot:body-cell-slot_price="props">
            <q-td class="text-right"> {{ props.row.slot_price }} USD </q-td>
          </template>
          <template v-slot:body-cell-deal_price="props">
            <q-td class="text-right"> {{ props.row.deal_price }} USD </q-td>
          </template>
          <template v-slot:body-cell-time_period="props">
            <q-td class="text-left"> {{ props.row.time_period }} Hours </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td class="text-center">
              <q-chip
                size="sm"
                :label="
                  $t(Utils.getKey(props.row?.status)).toUpperCase()
                "
                :color="getStatusColor(props)"
                :class="'text-white'"
              />
            </q-td>
          </template>

        </q-table>
      </q-card-section>
      <q-card-section class="pt-0" v-if="isDetialView">
        <div v-if="isFullfill">
          <Fulfilled  @onUpdated="onCallBack" :data="selectedDeal" @onClose="isFullfill = false, isDetialView = false" />
        </div>
        <div v-if="showDealsDetail">
            <DealDetial  @onUpdated="onCallBack" :data="selectedDeal" @onClose="callBackClose" />
        </div>
      </q-card-section>
      <Loading :loading="loading" />
    </q-card>

    <q-dialog v-model="showEdit" position="top" persistent>
      <edit-deals
        :data="selectedDeal"
        @onClose="showEdit = false"
        @onUpdated="onRefresh"
      />
    </q-dialog>

    <q-dialog v-model="showEditDeal" position="top" persistent>
      <edit-deal
        :data="selectedDeal"
        @onClose="showEditDeal = false"
        @onUpdated="onRefresh"
      />
    </q-dialog>

    <q-dialog v-model="showWinner" persistent>
      <winner-deals
        :data="selectedDeal"
        @onClose="showWinner = false"
        @onUpdated="onWinner"
      />
    </q-dialog>

    <!-- <q-dialog v-model="showDealsDetail" persistent>
      <DealDetial :data="selectedDeal" @onClose="showDealsDetail = false" />
    </q-dialog> -->
  </q-page>
</template>

<script setup>
import { onMounted, computed,  reactive, ref, inject, watch } from "vue";
import useTable from "../../composables/useTable";
import useDeals from "../../composables/useDeals";
import Utils from "../../helpers/Utils";
import EditDeals from "../../components/Deals/Edit.vue";
import EditDeal from "../../components/Deals/EditDeal.vue";
import WinnerDeals from "../../components/Deals/Winner.vue";
import Confirm from "../../components/Shared/Confirm.vue";
import Loading from "src/components/Shared/Loading.vue";
import DealDetial from "../../components/Deals/DealDetial.vue";
import Fulfilled from "../../components/Deals/Fulfilled.vue";

import { store } from "../../store/store";

const { loading, columns, items, trash, paginate , getCount } = useDeals();
const showWinner = ref(false);
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

const showDealsDetail = ref(false);
const isDetialView = ref(false)
const showEditDeal = ref();
const selectedDeal = ref();
const isFullfill = ref(false);
const local = inject("locale");
const filters = reactive({
  name: "",
  status: "",
});
const tempstatusOptions = ref([]);
const statusOptions = ["active", "inactive", "settled"];
const counts = ref({})

onMounted(() => {
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "updated_at",
      descending: true,
    },
    filter: undefined,
  });
  getCountDeal();
});
const active = ref(0);

const onClickActive = (val) => {
  active.value = val;
  filters.status = val;
};
const callBackClose = (val) =>{
    showDealsDetail.value = false
   isDetialView.value = false
   if(val)
   onCallBack();
   getCountDeal();
}
const onCallBack = () => {
  filters.status =  active.value;
    onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "deals.updated_at",
      descending: true,
    },
    filter: filters,
  });
  getCountDeal();
}
const getCountDeal = async () => {
  let gCount  = await getCount()
  counts.value = gCount.data?.data[0] || {}
  console.log(counts.value)
}
const showDetial = (row) => {
  selectedDeal.value = row;
  isDetialView.value = true
  console.log(row);
  // if (row.products.slot.booked_slots == row.products.slot.total_slots) {
  if (row.status == 'inactive') {

    isFullfill.value = true;
  } else {
    showDealsDetail.value = true;
  }
};

const onEditClick = (row) => {
  showEdit.value = true;
  selectedDeal.value = row;
};

const onEditDealClick = (row) => {
  showEditDeal.value = true;
  selectedDeal.value = row;
};

const onWinnerClick = (row) => {
  // showWinner.value = true;
  // selectedDeal.value = row;
  showDetial(row)
};
watch(() => store.menuSelect	, () => {
  if(!store.isOne){
    showDealsDetail.value = false
   isDetialView.value = false
   onRefresh();
   getCountDeal();
  }
})

const onWinner = () => {
  console.log("Comming back to index");
  showWinner.value = false;
  onRefresh();
};

const getDealsByStatus = async () => {
  await paginate({
    pagination: {
      ...pagination.value,
      sortBy: "updated_at",
      status: filters.status,
      descending: true,
    },
  });
  //subCategoryOption.value = tempSubCategoryOptions = getSub.data
};

watch(
  () => filters.status,
  () => {
    getDealsByStatus();
    //filters.sub_category_id = ''
  }
);

const getStatusColor = (props) => {
  if (props.row.status === "active") {
    return "positive";
  }

  if (props.row.status === "inactive"  || props.row.status === "expired") {
    return "negative";
  }

  return "info";
};

const filterStatus = (val, update) => {
  statusOptions.value = Utils.filterDropdownOptions(
    tempstatusOptions,
    val,
    update,
    "name"
  );
};

const resetFilters = () => {
  for (const [key, value] of Object.entries(filters)) {
    filters[key] = "";
  }

  active.value = 0

  // range.value = null;

};
</script>
<style scoped>
  @media only screen and (max-width: 910px) {
    .card_1{
      margin-top: 16px;
      width: 100%;
      justify-content: space-between;
    }
    .card_1:nth-child(2){
      margin-left: 0px !important;
      margin-right: 0px !important;
    }
    .card_1:nth-child(3){
      margin-left: 0px !important;
      margin-right: 0px !important;
    }
    .pa-5{
      padding: 0px !important;
    }
  }
</style>
