// api/keep-alive.js

module.exports = async (req, res) => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return res.status(500).json({
      error: "Missing SUPABASE_URL or SUPABASE_ANON_KEY in Vercel environment variables"
    });
  }

  try {
    const response = await fetch(
      `${url}/rest/v1/users?select=*&limit=1`,
      {
        method: "GET",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Supabase ping failed with status ${response.status}`
      });
    }

    const data = await response.json();

    res.status(200).json({
      status: "alive",
      ping_time: new Date().toISOString(),
      rows: data.length,
      message: data.length === 0 ? "الجدول موجود لكنه فاضي" : "Ping ناجح"
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "خطأ غير متوقع" });
  }
};
