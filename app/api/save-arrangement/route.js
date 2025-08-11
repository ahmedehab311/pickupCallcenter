export async function PATCH(req) {
  try {
    const { searchParams } = new URL(req.url);
    const api_token = searchParams.get("api_token");
    const apiBaseUrl = searchParams.get("apiBaseUrl");
    const Itemid = searchParams.get("Itemid");
    const name = searchParams.get("name");

    const body = await req.json();
    const response = await fetch(
      `${apiBaseUrl}/v1/call-center/${name}/rearrange?api_token=${api_token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    const data = await response.json();
    console.log("BODY:", body);

    console.log("apiBaseUrl from server", apiBaseUrl);
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
