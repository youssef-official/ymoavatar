
async function testImport() {
  try {
    console.log("Importing MindARThree...");
    const module = await import("https://esm.sh/mind-ar@1.2.5/dist/mindar-image-three.prod.js");
    console.log("Imported:", module);
    if (module.MindARThree) {
        console.log("MindARThree found!");
    } else {
        console.log("MindARThree NOT found in export.");
    }
  } catch (e) {
    console.error("Import failed:", e);
  }
}

testImport();
