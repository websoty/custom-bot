export type NodeVisit = {
  nodeId: string;
  count: number;
  firstVisitedAt: Date;
  lastVisitedAt: Date;
};

const visits = new Map<number, Map<string, NodeVisit>>();

export function trackNodeVisit(userId: number, nodeId: string) {
  let userVisits = visits.get(userId);

  if (!userVisits) {
    userVisits = new Map();
    visits.set(userId, userVisits);
  }

  const existing = userVisits.get(nodeId);

  if (existing) {
    existing.count += 1;
    existing.lastVisitedAt = new Date();
  } else {
    userVisits.set(nodeId, {
      nodeId,
      count: 1,
      firstVisitedAt: new Date(),
      lastVisitedAt: new Date(),
    });
  }
}

export function getUserVisits(userId: number) {
  return Array.from(visits.get(userId)?.values() ?? []);
}

export function getAllVisits() {
  return visits;
}
