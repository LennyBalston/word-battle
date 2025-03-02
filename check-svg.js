// Script to check if SVG files are accessible
document.addEventListener("DOMContentLoaded", () => {
  const svgFiles = [
    "assets/svg/godzilla.svg",
    "assets/svg/kong.svg",
    "assets/svg/mothra.svg",
    "assets/svg/ghidorah.svg",
    "assets/svg/rodan.svg",
    "assets/svg/mecha.svg",
  ];

  const resultContainer = document.getElementById("results");

  // Check each SVG file
  svgFiles.forEach((file) => {
    const resultItem = document.createElement("div");
    resultItem.className = "result-item";
    resultContainer.appendChild(resultItem);

    resultItem.innerHTML = `<strong>${file}</strong>: Checking...`;

    fetch(file)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then((svgContent) => {
        // Check if content is valid SVG
        if (svgContent.includes("<svg") && svgContent.includes("</svg>")) {
          resultItem.innerHTML = `<strong>${file}</strong>: <span class="success">✓ Valid SVG (${svgContent.length} bytes)</span>`;
          resultItem.classList.add("success");

          // Display the SVG
          const svgContainer = document.createElement("div");
          svgContainer.className = "svg-preview";
          svgContainer.innerHTML = svgContent;
          resultItem.appendChild(svgContainer);
        } else {
          resultItem.innerHTML = `<strong>${file}</strong>: <span class="error">✗ Invalid SVG format</span>`;
          resultItem.classList.add("error");
        }
      })
      .catch((error) => {
        resultItem.innerHTML = `<strong>${file}</strong>: <span class="error">✗ Error: ${error.message}</span>`;
        resultItem.classList.add("error");
      });
  });
});
