  export async function PUT(req) {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
      const api_token = searchParams.get("api_token");
      const apiBaseUrl = searchParams.get("apiBaseUrl");

      const response = await fetch(
        `${apiBaseUrl}/v1/call-center/menu/${id}?api_token=${api_token}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }
