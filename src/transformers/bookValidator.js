const { z } = require("zod");

const bookSchema = z.object({
  title: z.string().min(1),
  price_text: z.string(),
  price_value: z.number().nonnegative(), // Gunakan nonnegative biar harga 0 gak error
  image_url: z.string().url(),
});

function transformBookData(rawData) {
  try {
    // 1. Bersihkan Harga
    const cleanPrice = parseFloat(rawData.price.replace("£", ""));

    // 2. BIKIN KABELNYA (Ini yang tadi hilang, Cu!)
    const absoluteImageUrl =
      "https://books.toscrape.com/" + rawData.image_url.replace("../", "");

    // 3. Setorkan ke Zod
    return bookSchema.parse({
      title: rawData.title,
      price_text: rawData.price,
      price_value: cleanPrice,
      image_url: absoluteImageUrl, // Nah, sekarang variabel ini sudah ada isinya!
    });
  } catch (err) {
    // Tambahin err.message biar kalau ada salah lain, kita gak buta
    console.log(`❌ Zod Reject [${rawData.title}]:`, err.message);
    return null;
  }
}

module.exports = { transformBookData };
