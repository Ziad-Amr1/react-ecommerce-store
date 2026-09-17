export const featureStatus = {
  planned: "planned",
  inProgress: "inProgress",
  polishing: "polishing",
  doneWaitingPR: "doneWaitingPR",
  done: "done",
};

export const adminFeatures = [
  { key: "products", status: featureStatus.planned },
  { key: "orders", status: featureStatus.planned },
  { key: "users", status: featureStatus.planned },
  { key: "carts", status: featureStatus.planned },
  { key: "settings", status: featureStatus.planned },
];
