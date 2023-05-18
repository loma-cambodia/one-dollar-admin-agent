<template>
  <q-page>
    <q-card
      class="card_container pa-3"
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
    >
      <Loading :loading="isLoading" />
      <div>
        <q-card-section class="q-col-gutter-md">
          <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 stat-card bg-dark text-white">
              <q-bar dark class="chart-qbar q-py-lg row">
                <div class="col-md-2">
                  <span class="">{{ $t(Utils.getKey("Statistic")) }}</span>
                </div>
                <div class="col-md-6">
                  (
                  {{ $t(Utils.getKey("Last updated")) }}
                  {{ lastUpdate }}
                  )
                </div>
                <div class="col-md-4 text-right">
                  <q-btn
                    style="font-size: 17px"
                    class="q-mr-sm q-mt-xs"
                    dense
                    color="primary"
                    icon="mdi-lock-reset"
                    @click="resetFilters"
                  />
                </div>
              </q-bar>
            </div>
          </div>

          <div class="row q-d-grid q-gap-3">

            <div class="col-md-3 col-sm-6 col-xs-12 stat-card mt-4">
              <q-card flat bordered style="width: 95% !important;">
                <q-card-section class="row pb-0 info-head">
                  <div class="text-body1 text-break-space">
                    {{ $t(Utils.getKey("Today new direct member")) }}
                  </div>
                </q-card-section>
                <q-card-section class="pb-0 row">
                  <div class="text-h5 py-0 text-bold">
                    {{ getTotalCount?.team_member || "0" }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-md-3 col-sm-6 col-xs-12 stat-card mt-4">
              <q-card flat bordered style="width: 95% !important;">
                <q-card-section class="row pb-0 info-head">
                  <div class="text-body1 text-break-space">
                    {{ $t(Utils.getKey("Today new team member")) }}
                  </div>
                </q-card-section>
                <q-card-section class="pb-0 row">
                  <div class="text-h5 py-0 text-bold">
                    {{ getTotalCount?.team_member || "0" }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-md-3 col-sm-6 col-xs-12 stat-card mt-4">
              <q-card flat bordered style="width: 95% !important;">
                <q-card-section class="row pb-0 info-head">
                  <div class="text-body1 text-break-space">
                    {{ $t(Utils.getKey("Today direct member bet amount")) }}
                  </div>
                </q-card-section>
                <q-card-section class="pb-0 row">
                  <div class="text-h5 py-0 text-bold">
                    {{ getTotalCount?.direct_member_bet_amount || "0" }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-md-3 col-sm-6 col-xs-12 stat-card mt-4">
              <q-card flat bordered style="width: 95% !important;">
                <q-card-section class="row pb-0 info-head">
                  <div class="text-body1 text-break-space">
                    {{ $t(Utils.getKey("Today team member bet amount")) }}
                  </div>
                </q-card-section>
                <q-card-section class="pb-0 row">
                  <div class="text-h5 py-0 text-bold">
                    {{ getTotalCount?.total_member_bet_amount || "0" }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-md-3 col-sm-6 col-xs-12 stat-card mt-4">
              <q-card flat bordered style="width: 95% !important;">
                <q-card-section class="row pb-0 info-head">
                  <div class="text-body1 text-break-space">
                    {{ $t(Utils.getKey("Today direct member W/L")) }}
                  </div>
                </q-card-section>
                <q-card-section class="pb-0 row">
                  <div class="text-h5 py-0 text-bold">
                    {{ getTotalCount?.get_direct_memberWL || "0" }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-md-3 col-sm-6 col-xs-12 stat-card mt-4">
              <q-card flat bordered style="width: 95% !important;">
                <q-card-section class="row pb-0 info-head">
                  <div class="text-body1 text-break-space">
                    {{ $t(Utils.getKey("Today team member W/L")) }}
                  </div>
                </q-card-section>
                <q-card-section class="pb-0 row">
                  <div class="text-h5 py-0 text-bold">
                    {{ getTotalCount?.get_team_memberWL || "0" }}
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- <div class="col-md-3 col-sm-6 col-xs-12 stat-card">
              <q-card flat bordered class="amount_card">
                <p class="text-body1 font_20 py-3 text-center">
                  {{ $t(Utils.getKey("Today new direct member")) }}
                </p>
                <q-card-section class="pt-0">
                  <div class="row pa-2 green">
                    <div class="border col-6 flex-1 px-2 r_4">
                      <div class="d-flex mt-1">
                        <p class="text-bold font_18 ml-1">
                          {{ getTotalCount?.direct_member || "0" }}
                        </p>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-md-3 col-sm-6 col-xs-12 stat-card">
              <q-card flat bordered class="amount_card">
                <p class="text-body1 font_20 py-3 text-center">
                  {{ $t(Utils.getKey("Today new team member")) }}
                </p>
                <q-card-section class="pt-0">
                  <div class="row pa-2 green">
                    <div class="border col-6 flex-1 px-2 r_4">
                      <div class="d-flex mt-1">
                        <p class="text-bold font_18 ml-1">
                          {{ getTotalCount?.team_member || "0" }}
                        </p>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-md-3 col-sm-6 col-xs-12 stat-card">
              <q-card flat bordered class="amount_card">
                <p class="text-body1 font_20 py-3 text-center">
                  {{ $t(Utils.getKey("Today direct member bet amount")) }}
                </p>
                <q-card-section class="pt-0">
                  <div class="row pa-2 green">
                    <div class="border col-6 flex-1 px-2 r_4">
                      <div class="d-flex mt-1">
                        <p class="text-bold font_18 ml-1">
                          {{ getTotalCount?.direct_member_bet_amount || "0" }}
                        </p>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-md-3 col-sm-6 col-xs-12 stat-card">
              <q-card flat bordered class="amount_card">
                <p class="text-body1 font_20 py-3 text-center">
                  {{ $t(Utils.getKey("Today team member bet amount")) }}
                </p>
                <q-card-section class="pt-0">
                  <div class="row pa-2 green">
                    <div class="border col-6 flex-1 px-2 r_4">
                      <div class="d-flex mt-1">
                        <p class="text-bold font_18 ml-1">
                          {{ getTotalCount?.total_member_bet_amount || "0" }}
                        </p>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-md-3 col-sm-6 col-xs-12 stat-card">
              <q-card flat bordered class="amount_card">
                <p class="text-body1 font_20 py-3 text-center">
                  {{ $t(Utils.getKey("Today direct member W/L")) }}
                </p>
                <q-card-section class="pt-0">
                  <div class="row pa-2 green">
                    <div class="border col-6 flex-1 px-2 r_4">
                      <div class="d-flex mt-1">
                        <p class="text-bold font_18 ml-1">
                          {{ getTotalCount?.get_direct_memberWL || "0" }}
                        </p>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-md-3 col-sm-6 col-xs-12 stat-card">
              <q-card flat bordered class="amount_card">
                <p class="text-body1 font_20 py-3 text-center">
                  {{ $t(Utils.getKey("Today team member W/L")) }}
                </p>
                <q-card-section class="pt-0">
                  <div class="row pa-2 green">
                    <div class="border col-6 flex-1 px-2 r_4">
                      <div class="d-flex mt-1">
                        <p class="text-bold font_18 ml-1">
                          {{ getTotalCount?.get_team_memberWL || "0" }}
                        </p>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div> -->
          </div>
        </q-card-section>
        <q-card-section class="row q-col-gutter-md q-pt-none q-px-md">
          <member-online-chart />
        </q-card-section>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

import Utils from "src/helpers/Utils";
import useStats from "../composables/useStats";
import Loading from "src/components/Shared/Loading.vue";
import { useI18n } from "vue-i18n";
import useDeals from "../composables/useDeals";
import moment from "moment";
import MemberOnlineChart from "src/components/Dashboard/MemberOnlineChart";

const { getCount } = useDeals();
const { t, locale } = useI18n();
const stats = useStats();
const getTotalCount = ref([]);

const lastUpdate = ref(moment().format("YYYY-MM-DD hh:mm:ss"));

const isLoading = ref(true);

getTodatCount();

async function getTodatCount() {
  try {
    const response = await stats.getTodatCount();
    getTotalCount.value = response.data;
    // lastUpdate.value = moment().format("YYYY-MM-DD hh:mm:ss");
    // console.log(lastUpdate);
    isLoading.value = false;
  } catch (e) {}
}
const resetFilters = () => {
  isLoading.value = true;
  getTodatCount();
};
// provide(THEME_KEY, "light");
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
