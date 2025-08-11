// export async function PATCH(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const name = searchParams.get("name");
//     const id = searchParams.get("id");
//     const api_token = searchParams.get("api_token");
//     const apiBaseUrl = searchParams.get("apiBaseUrl");

//     const response = await fetch(
//       `${apiBaseUrl}/v1/call-center/${name}/${id}/status?api_token=${api_token}`,
//       {
//         method: "PATCH",
//       }
//     );

//     const data = await response.json();

//     console.log("apiBaseUrl from server", apiBaseUrl);
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
export async function PATCH(req) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    const id = searchParams.get("id");
    const api_token = searchParams.get("api_token");
    const apiBaseUrl = searchParams.get("apiBaseUrl");

    const url = `${apiBaseUrl}/v1/call-center/${name}/${id}/status?api_token=${api_token}`;
    console.log("Hitting:", url);

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({}) // ← مهم جدًا!
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Catch Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
