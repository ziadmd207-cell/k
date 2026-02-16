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
      `${url}/rest/v1/users?select=*&limit=2`, // ← جبنا أول 2 سطر بدل 1 عشان تشوف بيانات أكتر
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

    // نرجّع البيانات نفسها (أول سطرين أو مصفوفة فارغة)
    res.status(200).json({
      status: "alive",
      ping_time: new Date().toISOString(),
      data_returned: data,              // ← البيانات الحقيقية هنا
      row_count: data.length,
      message: data.length === 0 
        ? "الجدول موجود لكنه فاضي (كويس للـ keep-alive)" 
        : `تم جلب ${data.length} سطر/سطور بنجاح`
    });
  } catch (err) {
    res.status(500).json({ 
      error: err.message || "خطأ غير متوقع" 
    });
  }
};
