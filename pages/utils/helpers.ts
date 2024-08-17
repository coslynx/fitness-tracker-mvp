import { DateTime } from "luxon";

export const formatDate = (date: Date): string => {
  return DateTime.fromJSDate(date).toLocaleString(DateTime.DATE_FULL);
};

export const calculateProgress = (
  goal: { deadline: Date; target: number },
  activities: { calories: number; date: Date }[]
): number => {
  const now = new Date();
  const deadline = DateTime.fromJSDate(goal.deadline);
  const daysRemaining = deadline.diff(DateTime.fromJSDate(now), "days").days;

  const caloriesBurned = activities.reduce(
    (total, activity) => total + activity.calories,
    0
  );

  const progress =
    daysRemaining > 0
      ? (caloriesBurned / goal.target) * 100
      : 100; // Progress is 100% after the deadline
  return Math.round(progress);
};