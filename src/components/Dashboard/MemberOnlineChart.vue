<template>
  <div
    class="col-md-12 col-sm-12 col-xs-12 q-mt-md chart-container"
    :style="{ height: '400px' }"
  >
    <div class="row">
      <div class="col-md-12 col-sm-12 col-xs-12 stat-card bg-dark text-white">
        <Loading :loading="isLoading" />
        <q-bar dark class="chart-qbar q-py-lg row">
          <div class="col-md-2">
            <span class="">{{ $t(Utils.getKey("Statistic Graph")) }}</span>
          </div>

          <q-select
            v-model="typeOfFilter"
            :options="optionsValue"
            outlined
            style="width: 300px"
            dense
            map-options
            emit-value
            option-value="id"
            class="q-mr-sm q-mt-sm bg-dark-sushil"
            :option-label="(item) => $t(Utils.getKey(item.name))"
          />
          <!-- <div class="col-md-4"> -->
          <el-date-picker
            class="q-mt-xs q-mr-sm bg-dark-sushil"
            color="white"
            v-model="onlineStats.range"
            type="daterange"
            :range-separator="$t(Utils.getKey('To'))"
            :start-placeholder="$t(Utils.getKey('Start date'))"
            :end-placeholder="$t(Utils.getKey('End date'))"
            value-format="YYYY-MM-DD"
            style="color: #ffffff !important"
          />

          <q-btn
            class="q-mr-sm q-px-sm q-ml-sm capitalize"
            color="primary"
            style="
              margin-left: 10px;
              height: 40px;
              min-width: 125px !important;
              background-color: #28a745 !important;
            "
            @click="onSearch"
            >{{ $t("search") }}</q-btn
          >
          <q-btn
            class="q-mr-sm q-px-sm q-ml-sm capitalize"
            color="warning"
            style="margin-left: 10px; height: 40px; min-width: 125px !important"
            @click="resetFilters"
            >{{ $t("reset") }}</q-btn
          >
          <!-- </div> -->
        </q-bar>
      </div>
    </div>
    <!-- <q-bar dark class="chart-qbar q-py-lg">
      <span class="text-body1">{{ $t(Utils.getKey("Statistic Graph")) }}</span>
      <q-space />
    </q-bar> -->
    <v-chart id="online-chart" :option="onlineStats.option" autoresize />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import moment from "moment";
import Utils from "src/helpers/Utils";
import useStats from "../../composables/useStats";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, PieChart } from "echarts/charts";
import auth from "src/store/auth";
import Loading from "src/components/Shared/Loading.vue";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { locale } = useI18n({ useScope: "global" });

const optionsValue = ref([
  {
    id: "NewDirectMember",
    name: "New direct member",
  },
  {
    id: "NewTeamMember",
    name: "New team member",
  },
  {
    id: "DirectMemberBetAmount",
    name: "Direct member bet amount",
  },
  {
    id: "TeamMemberBetAmount",
    name: "Team member bet amount",
  },
  {
    id: "DirectMemberWL",
    name: "Direct Member W/L",
  },
  {
    id: "TeamMemberWL",
    name: "Team Member W/L",
  },
]);

use([
  CanvasRenderer,
  PieChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);
const stats = useStats();
const isLoading = ref(true);
const typeOfFilter = ref("NewDirectMember");
const defaultDate = [
  moment().subtract(1, "month").format("YYYY-MM-DD"),
  moment().format("YYYY-MM-DD"),
];

const onSearch = () => {
  getChartDataFun();
};

const getChartData = ref([]);
const resetFilters = () => {
  onlineStats.value.range = defaultDate;
  typeOfFilter.value = "NewDirectMember";
  onSearch();
};
const onlineStats = ref({
  range: defaultDate,
  option: {
    grid: {
    top:    60,
    bottom: 60,
    left:   '7%',
    right:  '0%',
  },
    tooltip: {
      trigger: "item",
      formatter: `{b} <br/>${t(Utils.getKey("Statistic Graph"))} : {c}`,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: [],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: getChartData,
        type: "line",
        areaStyle: {},
        color: ["#03507e"],
        emphasis: {
          label: {
            show: true,
            fontSize: "16",
            fontWeight: "bold",
          },
        },
      },
    ],
  },
});
const levelOptionsReferral = ref([]);
const allLevelAgenReferral = async () => {
  let res = await stats.getAllLevelReferral();
  console.log("resLevelData", res.data);

  levelOptionsReferral.value = res.data;
};

const getChartDataFun = async () => {
  isLoading.value = true;
  await allLevelAgenReferral();
  let filters = {
    date: onlineStats.value.range,
    typeOfFilter: typeOfFilter.value,
    agent_referral_code: auth.state.user.referral_code,
    all_agent_referral_code: levelOptionsReferral.value,
  };
  let res = await stats.getAllChartData(filters);
  console.log("res", res);

  getChartData.value = res.data.chart_data;
  isLoading.value = false;
};

getChartDataFun();
</script>
