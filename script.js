 

const accessKey = "ci3LRmju9yDNSHOnyyI-FQTflPOYAhoPw8JdnylKYeY";

const formEl = document.querySelector("form");
const inputEl = document.getElementById("search-input");
const searchResults = document.querySelector(".searchResults");
const showMore = document.getElementById("show-more-button");

let inputData = "";
let page = 1;

async function searchImages() {
    inputData = inputEl.value;
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`;

    const response = await fetch(url);
    const data = await response.json();
    const results = data.results;

    if (page === 1) {
        searchResults.innerHTML = "";
    }

    results.forEach((result, index) => {
        const imageWrapper = document.createElement("div");
        imageWrapper.classList.add("searchResult", "fade"); // start hidden

        const image = document.createElement("img");
        image.src = result.urls.small;
        image.alt = result.alt_description;
        image.loading = "lazy";

        const fncbtns = document.createElement("span");
        fncbtns.classList.add("fncbtns");

        const btnc = document.createElement("button");
        btnc.classList.add("fncbtn");
        const imgc = document.createElement("img");
        imgc.classList.add("fncimg");
        imgc.src = "https://img.icons8.com/forma-bold-filled/48/link.png";
        imgc.alt = "copy img";
        btnc.appendChild(imgc);

        const btnd = document.createElement("button");
        btnd.classList.add("fncbtn");
        const imgd = document.createElement("img");
        imgd.classList.add("fncimg");
        imgd.src = "https://img.icons8.com/material-rounded/100/download--v1.png";
        imgd.alt = "down img";
        btnd.appendChild(imgd);

        fncbtns.appendChild(btnc);
        fncbtns.appendChild(btnd);

        btnc.addEventListener("click", () => {
            navigator.clipboard.writeText(result.urls.small);
            alert("Image URL Copied Successfully!");
        });

        btnd.addEventListener("click", async (e) => {
            e.preventDefault();
            try {
                const response = await fetch(result.urls.full, { mode: "cors" });
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;
                link.download = `${result.alt_description || "image"}-HCC Pixels.jpg`;
                document.body.appendChild(link);
                link.click();
                link.remove();
                URL.revokeObjectURL(url);
            } catch (err) {
                console.error("Download failed", err);
            }
        });

        imageWrapper.appendChild(image);
        imageWrapper.appendChild(fncbtns);
        searchResults.appendChild(imageWrapper);

        // staggered reveal
        setTimeout(() => {
            imageWrapper.classList.add("show");
        }, index * 200);
    });

    page++;
    if (page > 1) {
        showMore.style.display = "block";
    }
}

formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    page = 1;
    searchImages();
});

showMore.addEventListener("click", () => {
    searchImages();
});

