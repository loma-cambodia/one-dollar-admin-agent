import { reactive, toRefs, ref } from "vue";
import { date } from "quasar";
import { api } from "../boot/axios";
import Utils from "../helpers/Utils";
import auth from "src/store/auth";

export default function useMemberGrandReport() {
  const state = reactive({
    loading: false,
    saving: false,
    deleting: false,
    items: [],
    totalAmounts:{}
  });

  const columns = [
    {
      name: "member_ID",
      label: "MEMBER ID",
      required: true,
      field: (row) => row.member_ID,
      align: "center",
      sortable: true,
    },
    {
      name: "upline",
      label: "UPLINE",
      required: true,
      field: (row) => row.upline_name,
      align: "center",
      sortable: false,
    },
    {
      name: "DEPOSIT",
      label: "DEPOSIT AMOUNT",
      required: true,
      field: (row) => Utils.formatCurrency(row.deposited_sum_amount || 0),
      align: "right",
      sortable: true,
    },

    {
      name: "bet_amount",
      label: "Bet Amount",
      required: true,
      field: (row) => Utils.formatCurrency(row.bet_amount || 0),
      align: "right",
      sortable: true,
    },


    {
      name: "win_loss",
      label: "Winning Amount",
      required: true,
      field: (row) => Utils.formatCurrency(row.win_amount || 0),
      align: "right",
      sortable: true,
    },
    {
      name: "win_loss",
      label: "Activity Bonus",
      required: true,
      field: (row) => Utils.formatCurrency(row.activity_bonus || 0),
      align: "right",
      sortable: true,
    },
    {
      name: "win_loss",
      label: "Member W/L",
      required: true,
      field: (row) => Utils.formatCurrency(row.win_lose_amount || 0),
      align: "right",
      sortable: true,
    },
  ];


  const paginate = async (props) => {
    state.loading = true;
    let params =
      props.filter !== undefined
        ? Object.assign(props.pagination, { ...props.filter })
        : props.pagination;
    try {
      const response = await api.get(`/members/get-grand-report`, { params });
      state.items = response?.data?.data?.data;
      state.loading = false;

      const total_amount = response.data.total_values;

      state.totalAmounts.totalActivityBonus = total_amount.total_activity_bonus || 0;
      state.totalAmounts.totalDepositedAmount = total_amount.total_deposited_amount || 0;
      state.totalAmounts.totalBetAmounts = total_amount.total_bet_amount || 0;
      state.totalAmounts.totalWinAmounts = total_amount.total_win_amount || 0;
      state.totalAmounts.totalWinLoseAmount = total_amount.total_win_lose_amount || 0;

      return response;
    } catch (err) {
      state.loading = false;
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };
  const getAllLevelReferral = async () => {
    try {
      const response = await api.get("/agents/level-all-agent-referral");
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  return {
    ...toRefs(state),
    columns,
    paginate,
    getAllLevelReferral,
  };
}
