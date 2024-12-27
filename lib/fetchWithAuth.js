export async function fetchWithAuth(url, options = {}) {
    const accessToken = localStorage.getItem("accessToken");
  
    // เพิ่ม Access Token ใน Header
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  
    const response = await fetch(url, options);
  
    // ถ้า Access Token หมดอายุ
    if (response.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");
  
      const refreshResponse = await fetch("/api/auth/refresh-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
  
      if (refreshResponse.ok) {
        const { accessToken: newAccessToken } = await refreshResponse.json();
        localStorage.setItem("accessToken", newAccessToken);
  
        // ลองเรียก API อีกครั้ง
        options.headers.Authorization = `Bearer ${newAccessToken}`;
        return fetch(url, options);
      } else {
        console.error("Refresh token expired. Logging out...");
        localStorage.clear();
        window.location.href = "/login";
      }
    }
  
    return response;
  }
  