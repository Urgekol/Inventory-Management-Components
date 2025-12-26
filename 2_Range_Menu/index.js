const container = document.querySelector(".container");
const arrowToggle = document.querySelector(".arrow_toggle");
const face2 = document.querySelector(".face2");
const arrowIcon = arrowToggle.querySelector("i");

arrowToggle.addEventListener("click", () => {
    if(face2.classList.contains("active"))
    {
        container.style.height = "30px";
    } 
    else 
    {
        container.style.height = "auto";
    }
    face2.classList.toggle("active");
    arrowToggle.classList.toggle("rotate");
});

const rangeInput = document.querySelectorAll(".range-input input");
const progress = document.querySelector(".slider .progress");
const priceInput = document.querySelectorAll(".price-input input");

let priceGap = 1000;

rangeInput.forEach(input => {
    input.addEventListener("input", (e) => {
        let minVal = parseInt(rangeInput[0].value);
        let maxVal = parseInt(rangeInput[1].value);

        if ((maxVal - minVal) < priceGap) 
        {
            if (e.target.classList.contains("range-min")) 
            {
                rangeInput[0].value = maxVal - priceGap;
                minVal = maxVal - priceGap;
            } 
            else 
            {
                rangeInput[1].value = minVal + priceGap;
                maxVal = minVal + priceGap; 
            }
        }
        
        priceInput[0].value = minVal;
        priceInput[1].value = maxVal;
        progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
        progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
    });
});

priceInput.forEach(input => {
    input.addEventListener("input", (e) => {
        let minVal = parseInt(priceInput[0].value);
        let maxVal = parseInt(priceInput[1].value);

        if ((maxVal - minVal) >= priceGap && maxVal <= 10000) 
        {
            if (e.target.classList.contains("input-min")) 
            {
                rangeInput[0].value = minVal;
                progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
            } 
            else 
            {
                rangeInput[1].value = maxVal;
                progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
            }
        }
    });
});