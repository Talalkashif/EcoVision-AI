const URL = "./model/";

let model;

async function loadModel() {
    try {
        model = await tmImage.load(
            URL + "model.json",
            URL + "metadata.json"
        );

        document.getElementById("result").innerHTML =
            "AI Loaded. Upload an image.";
    } catch (err) {
        console.error(err);
        document.getElementById("result").innerHTML =
            "Error loading model.";
    }
}

loadModel();

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");

imageInput.addEventListener("change", function () {

    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        preview.src = e.target.result;
        preview.style.display = "block";

        preview.onload = async function () {

            const prediction = await model.predict(preview);

            let best = prediction[0];

            prediction.forEach(p => {
                if (p.probability > best.probability)
                    best = p;
            });

            document.getElementById("result").innerHTML =
                "<h2>" + best.className + "</h2>" +
                "<p>Confidence: " +
                (best.probability * 100).toFixed(2) +
                "%</p>";
        };
    };

    reader.readAsDataURL(file);

});