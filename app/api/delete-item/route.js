// export async function DELETE(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const name = searchParams.get("name");
//     const id = searchParams.get("id");
//     const api_token = searchParams.get("api_token");
//     const apiBaseUrl = searchParams.get("apiBaseUrl");

//     const response = await fetch(
//       `${apiBaseUrl}/v1/call-center/${name}/${id}?api_token=${api_token}`,
//       {
//         method: "DELETE",
//       }
//     );

//     const data = await response.json();

//     return new Response(JSON.stringify(data), {
//       status: response.status,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   } catch (err) {
//     return new Response(JSON.stringify({ error: err.message }), {
//       status: 500,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   }
// }

// app/api/delete-item/route.js
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    const id = searchParams.get("id");
    const api_token = searchParams.get("api_token");
    const apiBaseUrl = searchParams.get("apiBaseUrl");

    const response = await fetch(
      `${apiBaseUrl}/v1/call-center/${name}/${id}?api_token=${api_token}`,
      { method: "DELETE" }
    );

    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          status: response.status,
          message: data?.messages?.[0] || "Failed to delete item",
          data,
        }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: response.status,
        message: data?.messages?.[0] || "Item deleted successfully",
        data,
      }),
      { status: response.status, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        status: 500,
        message: err.message || "Internal server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
