"use server";

export async function generateProgram(data: {
  user_id: string;
  age: string;
  height: string;
  weight: string;
  injuries: string;
  workout_days: string;
  fitness_goal: string;
  fitness_level: string;
  dietary_restrictions: string;
}) {
  try {
    const response = await fetch(
      `${process.env.CONVEX_SITE_URL}/vapi/generate-program`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error generating program:", error);
    return { success: false, error: "Failed to generate program" };
  }
}