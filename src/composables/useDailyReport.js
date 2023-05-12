import { reactive, toRefs } from "vue";
import Utils from "../helpers/Utils";
import { api } from "../boot/axios";
import { date } from "quasar";

export default function useDaily() {
  const state = reactive({
    loading: false,
    saving: false,
    deleting: false,
    totalAmounts:{},
    totalWalletAmounts:{},
    totalBetAmounts:{},
    totalWinAmounts:{},
    totalDirectMembers:{},
    totalTeamMembers:{},
    totalTeamBetAmt:{},
    totalTeamWlAmt:{},
    totalActivityBns:{},
    items: [],
    totalMember: 0,
    team_bet_amount:0,
    team_w_l: 0,
    // personal_comm: 0,
    team_comm: 0,

    totals:{},

    // totalDirectAgent: 0,
    // totalTeamAgent: 0,
    // totalDirectMember: 0,
    // totalTeamMember: 0,
    // totalTeamBetAmount: 0,
    // totalTeamWL: 0,
    // totalPersonalComm: 0,
    // totalTeamComm: 0,
  });

  const columns = [
    {
      name: "date",
      label: "Date",
      required: true,
      field: (row) => date.formatDate(row.created_at, "YYYY-MM-DD"),
      align: "center",
      sortable: true,
    },
    {
      name: "direct_member",
      label: "Direct Member",
      required: true,
      field: (row) => row.direct_member,
      align: "center",
      sortable: false,
    },
    {
      name: "team_member",
      label: "Team Member",
      required: true,
      field: (row) => row.team_member,
      align: "center",
      sortable: false,
    },
    {
      name: "direct_member_bet_amount",
      label: "Direct Member Bet Amount",
      required: true,
      field: (row) => row.bet_amount,
      align: "right",
      sortable: false,
    },
    {
      name: "team_member_bet_amount",
      label: "Team Member Bet Amount",
      required: true,
      field: (row) => row.team_bet_amount,
      align: "right",
      sortable: false,
    },
    {
      name: "direct_member_waiting_list",
      label: "Direct Member Waiting List",
      required: true,
      field: (row) => row.win_lose_amount,
      align: "right",
      sortable: false,
    },
    {
      name: "team_member_waiting_list",
      label: "Team Member Waiting List",
      required: true,
      field: (row) => row.team_wl_amount,
      align: "right",
      sortable: false,
    },



    {
      name: "activity_bonus",
      label: "Activity Bonus",
      required: true,
      field: (row) => row.activity_bonus,
      align: "right",
      sortable: false,
    },

    // {
    //   name: "Personal Comm",
    //   label: "Personal Comm",
    //   required: true,
    //   field: (row) => row.own_commision,
    //   align: "center",
    //   sortable: false,
    // },
    // {
    //   name: "Team Comm",
    //   label: "Team Comm",
    //   required: true,
    //   field: (row) => row.team_comm,
    //   align: "center",
    //   sortable: false,
    // },


    // {
    //   name: "created_at",
    //   label: "CREATED AT",
    //   required: true,
    //   field: (row) => date.formatDate(row.created_at, "YYYY-MM-DD HH:mm:ss"),
    //   align: "center",
    //   sortable: true,
    // },
    // {
    //   name: "enable_ga",
    //   label: "google authenticator",
    //   required: false,
    //   field: (row) => row.enable_ga,
    //   align: "center",
    //   sortable: false,
    // },
    // {
    //   name: "status",
    //   label: "status",
    //   required: false,
    //   field: (row) => row.status,
    //   align: "center",
    //   sortable: false,
    // },
    // {
    //   name: "actions",
    //   label: "ACTIONS",
    //   required: true,
    //   field: (row) => row,
    //   align: "center",
    // },
  ];

  const paginate = async (props) => {
    state.loading = true;
    let params =
      props.filter !== undefined
        ? Object.assign(props.pagination, { ...props.filter })
        : props.pagination;
    try {
      const response = await api.get("/members/getDailyReport", { params });
      state.items = response.data.data.data;
      state.loading = false;
      // state.totalAmounts = response.data.totalAmounts;
      console.log('response.data.data    ',response.data.total_values);
      state.totalWalletAmounts = response.data.total_values.total_wallet_amount;
      state.totalBetAmounts = response.data.total_values.total_bet_amount;
      state.totalWinAmounts = response.data.total_values.total_win_loss_amount;
      state.totalDirectMembers = response.data.total_values.total_direct_member;
      state.totalTeamMembers = response.data.total_values.total_team_member;
      state.totalTeamBetAmt = response.data.total_values.total_team_bet_amount;
      state.totalTeamWlAmt = response.data.total_values.total_team_wl_amount;
      state.totalActivityBns = response.data.total_values.total_activity_bonus;
      return response;
    } catch (err) {
      state.loading = false;
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const getAllLevel = async () => {
    try {
      const response = await api.get("/agents/level-all");
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
    getAllLevel,
  };
}
