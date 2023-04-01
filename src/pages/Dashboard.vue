<template>
  <q-page>
    <q-card class="card_container pa-3" :class="  $q.dark.isActive ? 'bg-dark': 'bg-white' ">
      <Loading :loading="isLoading" />
      <div class="row">
        <div class="col-12 col-sm-12 col-md-12 p_small" style="">
          <q-card class="card_style_small" :class="  $q.dark.isActive ? 'bg-dark': 'bg-white' ">
            <div class="row" style="">
              <div class="col-6 col-sm-6 col-md-3" style="">
                <div class="d_flex_around pa-2 red">
                  <div class="d_flex_center_column">
                    <!-- <q-circular-progress
                      show-value
                      font-size="12px"
                      :value="100"
                      size="58px"
                      :thickness="0.12"
                      color="red"
                      track-color="grey-3"
                    > -->
                    <q-avatar size="50px">
                      <img
                        class="b_l_red pa-2 r_50"
                        style="height: 50px"
                        src="../assets/deals.png"
                      />
                    </q-avatar>
                    <!-- </q-circular-progress> -->

                    <h2 class="font_28 text-bold mt-1">
                      {{ dashboardCount?.total_deals }}
                    </h2>
                    <p class="">{{ $t("total_deals") }}</p>
                  </div>
                </div>
              </div>
              <div class="col-6 col-sm-6 col-md-3" style="">
                <div class="d_flex_around pa-2">
                  <div class="green d_flex_center_column">
                    <!-- <q-circular-progress
                      show-value
                      font-size="12px"
                      :value="100"
                      size="58px"
                      :thickness="0.22"
                      color="green"
                      track-color="grey-3"
                    > -->
                    <q-avatar size="50px">
                      <img
                        class="b_l_green pa-2 r_50"
                        style="height: 50px"
                        src="../assets/shop2.png"
                      />
                    </q-avatar>
                    <!-- </q-circular-progress> -->

                    <h2 class="font_28 text-bold mt-1">
                      {{ dashboardCount?.total_order }}
                    </h2>
                    <p class="">{{ $t("total_orders") }}</p>
                  </div>
                </div>
              </div>
              <div class="col-6 col-sm-6 col-md-3" style="">
                <div class="d_flex_around pa-2 orange">
                  <div class="d_flex_center_column">
                    <!-- <q-circular-progress
                      show-value
                      font-size="12px"
                      :value="100"
                      size="58px"
                      :thickness="0.22"
                      color="orange"
                      track-color="grey-3"
                    > -->
                    <q-avatar size="50px">
                      <img
                        class="b_l_orange pa-2 r_50"
                        style="height: 50px"
                        src="../assets/member.png"
                      />
                    </q-avatar>
                    <!-- </q-circular-progress> -->

                    <h2 class="font_28 text-bold mt-1">
                      {{ dashboardCount?.total_customers }}
                    </h2>
                    <p class="">{{ $t("total_member") }}</p>
                  </div>
                </div>
              </div>
              <div class="col-6 col-sm-6 col-md-3" style="">
                <div class="d_flex_around pa-2 blue">
                  <div class="d_flex_center_column">
                    <!-- <q-circular-progress
                      show-value
                      font-size="12px"
                      size="58px"
                      :thickness="0.22"
                      color="blue"
                      track-color="grey-3"
                    > -->
                    <q-avatar size="50px">
                      <img
                        class="b_l_blue pa-2 r_50"
                        style="height: 50px"
                        src="../assets/goods.png"
                      />
                    </q-avatar>
                    <!-- </q-circular-progress> -->

                    <h2 class="font_28 text-bold mt-1">
                      {{ dashboardCount?.total_products }}
                    </h2>
                    <p class="">{{ $t("total_products") }}</p>
                  </div>
                </div>
              </div>
            </div>
            <!-- end row -->
          </q-card>
        </div>
      </div>
      <div class="px-4">
        <q-separator />
      </div>
      <div>
        <!-- Summary  -->

        <div class="text-h6 q-px-md q-pt-sm">
          {{ $t(Utils.getKey("summary")) }}
        </div>
        <q-card-section class="row q-col-gutter-md">
          <div class="col-md-4 col-sm-6 col-xs-12 stat-card">
            <q-card flat bordered>
              <q-card-section class="row pb-0 info-head">
                <div class="text-body1 text-break-space">
                  {{ $t(Utils.getKey("Monthly cumulative online user")) }}
                </div>
              </q-card-section>
              <q-card-section class="pb-0 row">
                <div class="text-h5 py-0 text-bold">
                  {{ thisMonthOnlineMembers?.current }}
                </div>
              </q-card-section>
              <q-card-section class="info-foot pt-0 text-right">
                <div class="text-break-space">
                  <span class="text-caption">{{
                    $t(Utils.getKey("Compare last month"))
                  }}</span>
                  <template v-if="thisMonthOnlineMembers?.percentage == 0">
                    <span
                      :style="{ margin: '0 2px 5px 2px' }"
                      class="text-gray text-body2 pt-0 text-bold"
                      >-</span
                    >
                  </template>
                  <template v-else-if="thisMonthOnlineMembers?.percentage >= 0">
                    <q-icon
                      name="mdi-arrow-up"
                      color="primary"
                      size="80"
                      :style="{ margin: '0 2px 5px 2px' }"
                    />
                    <span class="text-primary pt-0 text-body2 text-bold"
                      >{{
                       thisMonthOnlineMembers?.percentage == 100 ? thisMonthOnlineMembers?.percentage :   thisMonthOnlineMembers?.percentage?.toFixed(2)
                      }}%</span
                    >
                  </template>
                  <template v-else>
                    <q-icon
                      name="mdi-arrow-down"
                      color="negative"
                      size="80"
                      :style="{ margin: '0 2px 5px 2px' }"
                    />
                    <span class="text-negative pt-0 text-body2 text-bold"
                      >{{
                        thisMonthOnlineMembers?.percentage?.toFixed(2)
                      }}%</span
                    >
                  </template>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-md-4 col-sm-6 col-xs-12 stat-card">
            <q-card flat bordered>
              <q-card-section class="row pb-0 info-head">
                <div class="text-body1 text-break-space">
                  {{ $t(Utils.getKey("Monthly Transaction Amount")) }}
                </div>
              </q-card-section>
              <q-card-section class="pb-0 row">
                <div class="text-h5 py-0 text-bold">
                  {{
                    Utils.formatCurrency(monthTransactionAmount?.current || 0)
                  }}
                </div>
              </q-card-section>
              <q-card-section class="info-foot pt-0 text-right">
                <div class="text-break-space">
                  <span class="text-caption">{{
                    $t(Utils.getKey("Compare last month"))
                  }}</span>
                  <template v-if="monthTransactionAmount?.percentage == 0">
                    <span
                      :style="{ margin: '0 2px 5px 2px' }"
                      class="text-gray text-body2 pt-0 text-bold"
                      >-</span
                    >
                  </template>
                  <template v-else-if="monthTransactionAmount?.percentage >= 0">
                    <q-icon
                      name="mdi-arrow-up"
                      color="primary"
                      size="80"
                      :style="{ margin: '0 2px 5px 2px' }"
                    />
                    <span class="text-primary pt-0 text-body2 text-bold"
                      >{{
                        monthTransactionAmount?.percentage == 100 ?  monthTransactionAmount?.percentage:   monthTransactionAmount?.percentage?.toFixed(2)
                      }}%</span
                    >
                  </template>
                  <template v-else>
                    <q-icon
                      name="mdi-arrow-down"
                      color="negative"
                      size="80"
                      :style="{ margin: '0 2px 5px 2px' }"
                    />
                    <span class="text-negative pt-0 text-body2 text-bold"
                      >{{
                        monthTransactionAmount?.percentage?.toFixed(2)
                      }}%</span
                    >
                  </template>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- <div class="col-md-3 col-sm-6 col-xs-12 stat-card">
            <q-card flat bordered>
              <q-card-section class="row pb-0 info-head">
                <div class="text-body1 col text-break-space">
                  {{ $t(Utils.getKey("Today Member WL")) }}
                </div>
                <q-space />
                <q-select
                  v-model="todayMemberWl.currency_id"
                  outlined
                  :options="currencies"
                  dense
                  input-style="width: 50px"
                  option-value="id"
                  option-label="code"
                  emit-value
                  map-options
                />
              </q-card-section>
              <q-card-section class="row py-0">
                <div class="text-h5 text-bold">
                  {{
                    Utils.formatCurrency(Math.abs(todayMemberWl?.amount) ?? 0)
                  }}
                </div>
              </q-card-section>
              <q-card-section class="info-foot pt-0 text-right">
                <div class="text-break-space">
                  <span class="text-caption q-mr-sm">{{
                    $t(Utils.getKey("Cumulative this month"))
                  }}</span>
                  <template v-if="todayMemberWl?.cumulative == 0">
                    <span class="text-gray text-body2 text-bold">{{
                      Utils.formatCurrency(
                        Math.abs(todayMemberWl?.cumulative) ?? 0
                      )
                    }}</span>
                  </template>
                  <template v-else-if="todayMemberWl?.cumulative >= 0">
                    <span class="text-primary text-body2 text-bold">{{
                      Utils.formatCurrency(
                        Math.abs(todayMemberWl?.cumulative) ?? 0
                      )
                    }}</span>
                  </template>
                  <template v-else>
                    <span class="text-negative text-body2 text-bold">{{
                      Utils.formatCurrency(
                        Math.abs(todayMemberWl?.cumulative) ?? 0
                      )
                    }}</span>
                  </template>
                </div>
              </q-card-section>
            </q-card>
          </div> -->

          <div class="col-md-4 col-sm-6 col-xs-12 stat-card">
            <q-card flat bordered>
              <q-card-section class="row pb-0 info-head">
                <div class="text-body1 col text-break-space">
                  {{ $t(Utils.getKey("This Month New Members")) }}
                </div>
              </q-card-section>
              <q-card-section class="row q-py-sm">
                <div class="text-h5 text-bold">
                  {{
                    Intl.NumberFormat("en").format(
                      thisMonthMembers?.current ?? 0
                    )
                  }}
                </div>
              </q-card-section>
              <q-card-section class="info-foot pt-0 text-right">
                <div class="text-break-space">
                  <span class="text-caption">{{
                    $t(Utils.getKey("Compare last month"))
                  }}</span>
                  <template v-if="thisMonthMembers?.percentage == 0">
                    <span
                      :style="{ margin: '0 2px 5px 2px' }"
                      class="text-gray text-body2 text-bold"
                      >0.00%</span
                    >
                  </template>
                  <template v-else-if="thisMonthMembers?.percentage >= 0">
                    <q-icon
                      name="mdi-arrow-up"
                      color="primary"
                      size="80"
                      :style="{ margin: '0 2px 5px 2px' }"
                    />
                    <span class="text-primary text-body2 text-bold"
                      >{{
                        thisMonthMembers?.percentage == 100 ? thisMonthMembers?.percentage : thisMonthMembers?.percentage?.toFixed(2)
                      }}%</span
                    >
                  </template>
                  <template v-else>
                    <q-icon
                      name="mdi-arrow-down"
                      color="negative"
                      size="80"
                      :style="{ margin: '0 2px 5px 2px' }"
                    />
                    <span class="text-negative text-body2 text-bold"
                      >{{
                        thisMonthMembers?.percentage?.toFixed(2)
                      }}%</span
                    >
                  </template>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>

        <!-- row 3  Product-->
        <div class="px-4 my-1">
          <q-separator />
        </div>
        <!-- <div class="text-h6 q-px-md q-pt-sm">
          {{ $t(Utils.getKey("Products")) }}
        </div> -->
        <q-card-section class="row q-col-gutter-md">
          <div class="col-md-2 col-sm-6 col-xs-12 stat-card">
            <q-card flat bordered class="amount_card">
              <p class="text-body1 font_20 py-3 text-center">
                {{ $t(Utils.getKey("Product")) }}
              </p>
              <q-card-section class="pt-0">
                <div class="row pa-2 green">
                  <div class="border col-6 flex-1 px-2 r_4">
                    <span class="gray">{{ $t("acitve") }}</span>
                    <div class="d-flex mt-1">
                      <img
                        src="../assets/switch-on-60.png"
                        style="height: 26px; width: 20px; "
                      />
                      <p class="text-bold font_18 ml-1">
                        {{ dashboardCount?.total_products_ative || "000" }}
                      </p>
                    </div>
                  </div>
                  <div class="border col-6 flex-1 ml-1 px-2 r_4">
                    <span class="gray">{{ $t("inactive") }}</span>
                    <div class="d-flex mt-1">
                      <img
                        src="../assets/switch-off-50.png"
                        style="height: 26px; width: 20px; "
                      />
                      <p class="text-bold red font_18 ml-2">
                        {{
                          dashboardCount?.total_products -
                            dashboardCount?.total_products_ative || "00"
                        }}
                      </p>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-md-4 col-sm-6 col-xs-12 stat-card">
            <div class="col-md-3 col-sm-6 col-xs-12 stat-card">
              <q-card flat bordered class="amount_card">
                <p class="text-body1 font_20 py-3 text-center">
                  {{ $t(Utils.getKey("Deals")) }}
                </p>
                <q-card-section class="pt-0">
                  <div class="row pa-2 green">
                    <div class="border col-6 flex-1 px-4 r_4">
                      <span class="gray">{{ $t("open") }}</span>
                      <div class="d-flex mt-1">
                        <img src="../assets/open.png" style="height: 22px" />
                        <p class="text-bold font_18 ml-1">
                          {{ dealCount?.active_slots || 0 }}
                        </p>
                      </div>
                    </div>
                    <div class="border col-6 flex-1 ml-3 px-4 r_4">
                      <span class="gray">{{ $t("expired") }}</span>
                      <div class="d-flex mt-1">
                        <img
                          src="../assets/expired-50.png"
                          style="height: 18px"
                        />
                        <p class="text-bold red font_18 ml-2">
                          {{ dealCount?.expired_slots || 0 }}
                        </p>
                      </div>
                    </div>
                    <div class="border col-6 flex-1 ml-3 px-4 r_4">
                      <span class="gray">{{ $t("fulfilled") }}</span>
                      <div class="d-flex mt-1">
                        <img
                          src="../assets/goal-50.png"
                          class="mt-1"
                          style="height: 18px"
                        />
                        <p class="text-bold font_18 ml-2">
                          {{ dealCount?.fulfilled_slots || 0 }}
                        </p>
                      </div>
                    </div>
                    <div class="border col-6 flex-1 ml-3 px-4 r_4">
                      <span class="gray">{{ $t("settle") }}</span>
                      <div class="d-flex mt-1">
                        <img
                          src="../assets/settlements-50.png"
                          style="height: 22px"
                        />
                        <p class="text-bold blue font_18 ml-1">
                          {{ dealCount?.settled_slots || 0 }}
                        </p>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div class="col-md-6 col-sm-6 col-xs-12 stat-card">
            <div class="col-md-3 col-sm-6 col-xs-12 stat-card">
              <q-card flat bordered class="amount_card">
                <p class="text-body1 font_20 py-3 text-center">
                  {{ $t(Utils.getKey("shipment")) }}
                </p>
                <q-card-section class="pt-0 q-flutter">
                  <div class="row pa-2 green">
                    <div class="border col-6 flex-1 px-4 r_4">
                      <span class="gray">{{ $t("in transit") }}</span>
                      <div class="d-flex mt-1">
                        <img
                          src="../assets/in-transit-50.png"
                          style="height: 20px"
                        />
                        <p class="text-bold font_18 ml-2">
                          {{ dashboardCount.total_deals_by_status?.in_transit }}
                        </p>
                      </div>
                    </div>
                    <div class="border col-6 flex-1 ml-3 px-4 r_4">
                      <span class="gray">{{ $t("delivered") }}</span>
                      <div class="d-flex mt-1">
                        <img
                          src="../assets/in-transit-50.png"
                          style="height: 20px"
                        />
                        <p class="text-bold green font_18 ml-2">
                          {{ dashboardCount.total_deals_by_status?.delivered }}
                        </p>
                      </div>
                    </div>
                    <div class="border col-6 flex-1 ml-3 px-4 r_4">
                      <span class="gray">{{ $t("pending") }}</span>
                      <div class="d-flex mt-1">
                        <img
                          src="../assets/pending-48.png"
                          style="height: 20px"
                        />
                        <p class="text-bold gray font_18 ml-2">
                          {{ dashboardCount.total_deals_by_status?.pending }}
                        </p>
                      </div>
                    </div>
                    <div class="border col-6 flex-1 ml-3 px-4 r_4">
                      <span class="gray">{{ $t("returned") }}</span>
                      <div class="d-flex mt-1">
                        <img
                          src="../assets/return.png"
                          style="height: 20px"
                        />
                        <p class="text-bold orange font_18 ml-1">
                          {{ dashboardCount.total_deals_by_status?.returned }}
                        </p>
                      </div>
                    </div>
                    <div class="border col-6 flex-1 ml-3 px-4 r_4">
                      <span class="gray">{{ $t("failed") }}</span>
                      <div class="d-flex mt-1">
                        <img
                          src="../assets/failed.png"
                          style="height: 20px"
                        />
                        <p class="text-bold red font_18 ml-1">
                          {{ dashboardCount.total_deals_by_status?.failed }}
                        </p>
                      </div>
                    </div>
                    <div class="border col-6 flex-1 ml-3 px-4 r_4">
                      <span class="gray">{{ $t("cancelled") }}</span>
                      <div class="d-flex mt-1">
                        <img
                          src="../assets/failed.png"
                          style="height: 20px"
                        />
                        <p class="text-bold red font_18 ml-1">
                          {{ dashboardCount.total_deals_by_status?.cancelled }}
                        </p>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>

        <!-- Payment Row -->
        <div class="px-4 mt-3">
          <q-separator />
        </div>
        <div class="text-h6 q-px-md q-pt-sm">
          {{ $t(Utils.getKey("Payment")) }}
        </div>
        <q-card-section class="row q-col-gutter-md">
          <div class="col-md-3 col-sm-6 col-xs-12 stat-card">
            <q-card flat bordered class="amount_card">
              <TranferInChart />
            </q-card>
          </div>

          <div class="col-md-3 col-sm-6 col-xs-12 stat-card">
            <q-card flat bordered class="amount_card">
              <tranfer-out-chart />
            </q-card>
          </div>

          <div class="col-md-3 col-sm-6 col-xs-12 stat-card">
            <q-card flat bordered class="amount_card">
              <SlotPurchaseChart />
            </q-card>
          </div>

          <div class="col-md-3 col-sm-6 col-xs-12 stat-card">
            <q-card flat bordered class="amount_card">
              <RevnueChart />
            </q-card>
          </div>
        </q-card-section>

        <!-- Report  -->
        <!-- Report  -->

        <div class="text-h6 q-px-md">
          {{ $t(Utils.getKey("Report")) }}
        </div>
        <q-card-section class="row q-col-gutter-md q-pt-none q-px-md">
          <member-online />
          <recent-transaction />
        </q-card-section>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, provide, onMounted, watch } from "vue";
import useState from "src/composables/useReport";

import Utils from "src/helpers/Utils";
import Breadcrumbs from "../components/Menu/BreadCrumbs.vue";
import useStats from "../composables/useStats";
import useCurrency from "../composables/useCurrency";
import enabledCurrencies from "../constants/defaults/enabledCurrencies";
import Loading from "src/components/Shared/Loading.vue";
import { useI18n } from "vue-i18n";
import OnlineStat from "../components/Dashboard/MemberOnlineChart.vue";
import MemberOnline from "src/components/Dashboard/RecentMemberOnline.vue";
import RecentTransaction from "src/components/Dashboard/RecentTransaction.vue";
import useDeals from "../composables/useDeals";
// chart
import TranferInChart from "src/components/Dashboard/TranferInChart";
import TranferOutChart from "src/components/Dashboard/TranferOutChart";
import SlotPurchaseChart from "src/components/Dashboard/SlotPurchaseChart";
import RevnueChart from "src/components/Dashboard/RevnueChart";

const { getCount } = useDeals();
const { t, locale } = useI18n();
const stats = useStats();
const currencies = ref([]);
const thisMonthOnlineMembers = ref({});
const thisMonthMembers = ref(0);
const monthTransactionAmount = ref({
  currency_id: "",
});
const todayMemberWl = ref({
  currency_id: "",
  amount: 0,
});
const tranferIn = ref({
  date: "",
});
const isLoading = ref(false);

const shipSatatus = ref([
  {
    id: "Cancelled",
    name: "Cancelled",
  },

  {
    id: "Delivered",
    name: "Delivered",
  },
  {
    id: "In Transit",
    name: "In Transit",
  },
  {
    id: "Failed Delivery",
    name: "Failed Delivery",
  },
  {
    id: "Pending",
    name: "Pending",
  },
]);

let keys = ref([Math.random(), Math.random(), Math.random(), Math.random()]);

getCurrencies();

watch(locale, (newValue, _) => {
  keys.value = keys.value.map((k) => Math.random());
});

Promise.all([
  getThisMonthOnlineUsers(),
  getThisMontTransaction(),
  getThisMonthNewMembers(),
]);

async function getCurrencies() {
  try {
    const response = await all();
    currencies.value = response.data.filter((c) =>
      enabledCurrencies.includes(c.code)
    );

    // Init currency for stats
    if (currencies.value.length) {
      monthTransactionAmount.value.currency_id = currencies.value[0].id;
      todayMemberWl.value.currency_id = currencies.value[0].id;
    }
  } catch (e) {}
}

async function getThisMonthOnlineUsers() {
  try {
    const response = await stats.getThisMonthOnlineUsers();
    thisMonthOnlineMembers.value = response.data;
    console.log("thisMonthOnlineMembers", thisMonthOnlineMembers.value);
  } catch (e) {}
}

async function getThisMontTransaction() {
  try {
    const response = await stats.getThisMontTransaction();
    monthTransactionAmount.value = response.data;
    console.log("todayMemberWl", todayMemberWl.value);
  } catch (e) {
    console.log("monthTransactionAmount", e);
  }
}

async function getThisMonthNewMembers() {
  try {
    const response = await stats.getThisMonthNewMembers();
    thisMonthMembers.value = response.data;
  } catch (e) {}
}

// provide(THEME_KEY, "light");

const option = ref({
  title: {
    text: "Traffic Sources",
    left: "center",
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
  },
  legend: {
    orient: "vertical",
    bottom: "bottom",
    data: ["Direct", "Email", "Ad Networks", "Video Ads", "Search Engines"],
  },
  color: ["#F26522", "#21ba45", "#f5efeb", "#31ccec", "#f2c037"],
  series: [
    {
      name: "Traffic Sources",
      type: "pie",
      radius: "55%",
      center: ["50%", "60%"],
      data: [
        { value: 335, name: "Direct" },
        { value: 310, name: "Email" },
        { value: 234, name: "Ad Networks" },
        { value: 135, name: "Video Ads" },
        { value: 1548, name: "Search Engines" },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
});

const options2 = ref({
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
  },
  color: ["#F26522", "#21ba45", "#f5efeb", "#31ccec", "#f2c037"],
  series: [
    {
      data: [653, 56, 901, 934, 44, 66, 1320],
      type: "line",
      smooth: true,
    },
    {
      data: [12, 123, 901, 934, 1290, 1330, 1222],
      type: "line",
      smooth: true,
    },
    {
      data: [820, 932, 901, 934, 1290, 1330, 333],
      type: "line",
      smooth: true,
    },
  ],
});

const dashboardCount = ref({});
const getCountDashboard = async () => {
  isLoading.value = true;
  let count = await stats.getDashboard();
  dashboardCount.value = count.data;
  isLoading.value = false;
};
const dealCount = ref({});
onMounted(async () => {
  getCountDashboard();
  let gCount = await getCount();
  dealCount.value = gCount.data?.data[0] || {};
});
</script>
<style scoped>
.mt_16 {
  margin-top: 16px;
}
@media only screen and (max-width: 912px) {
  .p_small {
    padding: 16px !important;
  }
  .mt_16 {
    margin-top: 0px;
  }
}
.amount_card {
  min-height: 142px;
}
.card_style {
  box-shadow: none;
  height: 400px;
  background: #fff;
  padding: 12px;
}
.card_style_small {
  box-shadow: none;
  height: 146px;
  background: #fff;
  padding: 12px;
}
.card_container {
  margin: 0px;
  margin-left: 0px;
  margin-top: 20px;
  box-shadow: none;
  min-height: 85vh;
  background: #f5efeb;
}
.active_num {
  font-weight: bold;
  position: absolute;
  font-size: 20px;
  z-index: 98;
}

@media screen and (max-width: 912px) {
  .card_style_small {
    box-shadow: none;
    height: auto;
    background: #fff;
    padding: 12px;
  }
  .d_flex_between {
    justify-content: space-around;
  }
}
</style>
