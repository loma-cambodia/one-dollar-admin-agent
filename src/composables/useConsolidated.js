import { reactive, toRefs } from "vue";
import Utils from "../helpers/Utils";
import { api } from "../boot/axios";
import { date } from "quasar";

export default function useAgent() {
  const state = reactive({
    loading: false,
    saving: false,
    items: [],
    total: 0,
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
      name: "agent_ID",
      label: "Agent ID",
      required: true,
      field: (row) => row.agent_id,
      align: "center",
      sortable: true,
    },
    {
      name: "level",
      label: "level",
      required: true,
      field: (row) => "L" + row?.levelLable,
      align: "center",
      sortable: false,
    },
    // {
    //   name: "Upline",
    //   label: "Upline",
    //   required: true,
    //   field: (row) => row?.upline,
    //   align: "center",
    //   sortable: false,
    // },
    // {
    //   name: "Profit Sharing",
    //   label: "Profit Sharing",
    //   required: true,
    //   field: (row) =>
    //     row.level == 2 || row.level == 1 ? row.own_commision + " %" : "...",
    //   align: "center",
    //   sortable: false,
    // },
    {
      name: "Direct Agent",
      label: "Direct Agent",
      required: true,
      field: (row) => row.direct_agent,
      align: "center",
      sortable: false,
    },
    {
      name: "Team Agent",
      label: "Team Agent",
      required: true,
      field: (row) => row.team_agent,
      align: "center",
      sortable: false,
    },
    {
      name: "Direct Member",
      label: "Direct Member",
      required: true,
      field: (row) => row.directMember,
      align: "center",
      sortable: false,
    },
    {
      name: "Team Member",
      label: "Team Member",
      required: true,
      field: (row) => row.teamMember,
      align: "center",
      sortable: false,
    },



    {
      name: "Team Bet Amount",
      label: "Team Bet Amount",
      required: true,
      field: (row) => row.team_bet_amount,
      align: "center",
      sortable: false,
    },
    {
      name: "Team WL",
      label: "Team WL",
      required: true,
      field: (row) => row.team_w_l,
      align: "center",
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
      const response = await api.get("/agent-consolidated/paginate", {
        params,
      });
      state.items = response.data.data.data;
      state.loading = false;
      state.total = response.data.data.total;
      // state.totalMember = response.data.total_member;
      state.totals = response.data.totals;
      // console.log(response);
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
