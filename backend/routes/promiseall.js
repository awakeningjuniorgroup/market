
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API key:", process.env.CLOUDINARY_API_KEY);


async function uploadMultiple(images, folderName = "products") {
  try {
    // Filtrer les chemins vides ou inexistants
    const validImages = images.filter(img => {
      const exists = fs.existsSync(img);
      if (!exists) {
        console.error("⚠️ Fichier introuvable :", img);
      }
      return img && img.trim() !== "" && exists;
    });

    const results = await Promise.all(
      validImages.map(img =>
        cloudinary.uploader.upload(img, {
          folder: folderName, // ✅ toutes les images vont dans ce dossier
        })
      )
    );

    console.log("✅ Upload terminé :");
    results.forEach(r => console.log(r.secure_url));

    return results;
  } catch (error) {
    console.error("❌ Erreur upload :", error.message);
  }
}
const filePath = path.join(baseDir, "Magnifique porte feuille marbré .jpeg");
console.log("➡️ Chemin du fichier:", filePath, "Existe:", fs.existsSync(filePath));

// Exemple d’appel avec path.join
const baseDir = path.join(__dirname, "backend/imagecloudinary");

uploadMultiple([
  path.join(baseDir, "Magnifique porte feuille marbré .jpeg"),
]);

