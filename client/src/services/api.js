
const API_URL = "https://coursecraft-j74p.onrender.com/api";

export async function apiRequest(
  path,
  method = "GET",
  data = null,
  token = ""
) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (data !== null && data !== undefined) {
    options.body = JSON.stringify(data);
  }

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, options);
  } catch (error) {
    throw new Error(
      "Cannot connect to the CourseCraft server. Please try again."
    );
  }

  const text = await response.text();
  let result = {};

  if (text) {
    try {
      result = JSON.parse(text);
    } catch {
      result = { message: text };
    }
  }

  if (!response.ok) {
    throw new Error(
      result.message ||
      result.messsage ||
      `Request failed with status ${response.status}`
    );
  }

  return result;
}