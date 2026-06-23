// src/api/logger.js

export async function Log(
  stack,
  level,
  pkg,
  message,
  token
) {
  try {
    await fetch(
      "http://4.224.186.213/evaluation-service/logs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stack,
          level,
          package: pkg,
          message,
        }),
      }
    );
  } catch (error) {
    console.error(error);
  }
}