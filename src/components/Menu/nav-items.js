export default {
  home: {
    label: "dashboard",
    icon: "mdi-shape-outline",
    to: { name: "/" },
    permissions: [],
    children: [],
  },

  member: {
    label: "Member Managerment",
    icon: "mdi-account-group",
    permissions: [
      "Deal: View Deal",
      "Deal: Create Deal",
      "Deal: Edit/Update Deal",
    ],
    children: [
      {
        label: "Member List",
        icon: "mdi-group",
        to: { name: "members" },
        permissions: ["Deal: View Deal", "Deal: Edit/Update Deal"],
      },
    ],
  },
  agent_center: {
    label: "Agent Managerment",
    icon: "mdi-handshake-outline",
    permissions: [
      "Agent: View",
      "Agent: Create",
      "Agent: Edit/Update",
    ],
    children: [
      {
        label: "Agent List",
        icon: "mdi-handshake",
        to: { name: "agents" },
        permissions: ["Agent: View", "Agent: Edit/Update"],
      }
    ],
  },

  manage_report: {
    label: "Manage Report",
    icon: "mdi-chart-donut-variant",
    permissions: [
      "Deal: View Deal",
      "Deal: Create Deal",
      "Deal: Edit/Update Deal",
    ],
    children: [
      {
        label: "Agent Consolidated Report",
        icon: "mdi-account",
        to: { name: "agent-consolidated" },
        permissions: ["Deal: View Deal", "Deal: Edit/Update Deal"],
      },

      {
        label: "Daily Report",
        icon: "mdi-order-bool-descending-variant",
        to: { name: "daily-report" },
        permissions: ["Order: View Order", "Order: Views Order"],
      },
      {
        label: "Member Grand Report",
        icon: "mdi-history",
        to: { name: "member-report" },
        permissions: ["Order: View Order", "Order: Views Order"],
      }
    ],
  },
  referral_center: {
    label: "Referral Center",
    icon: "mdi-cogs",
    permissions: [
      "Deal: View Deal",
      "Deal: Create Deal",
      "Deal: Edit/Update Deal",
    ],
    children: [
      {
        label: "commissions",
        icon: "mdi-seal",
        to: { name: "commissions" },
        permissions: ["Deal: View Deal", "Deal: Edit/Update Deal"],
      },
      {
        label: "Referal Center",
        icon: "mdi-crosshairs",
        to: { name: "referral-center" },
        permissions: ["Order: View Order", "Order: Views Order"],
      },
    ],
  },
};
