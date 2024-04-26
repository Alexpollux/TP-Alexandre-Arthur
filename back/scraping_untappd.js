import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
dotenv.config();
import {sendEmail} from "./send-email.js";

export async function scrapingUntappd(login, performance, email, search, filter, sort) {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();

    await page.setViewport({ width: 1080, height: 1024 });

    await page.goto('https://untappd.com/');

    // login pour avoir plus de données
    if (login) {
        await page.goto('https://untappd.com/login');

        await page.type("#username", process.env.USERNAME_LOGIN_UNTAPPD);
        await page.type("#password", process.env.PASSWORD_LOGIN_UNTAPPD);

        // Ajouter des actions humaines comme des délais et des mouvements de souris
        await new Promise(resolve => setTimeout(resolve, 1000)); // Attendre 1 seconde
        await page.mouse.move(100, 200); // Déplacer la souris

        // Attendez que le reCAPTCHA iframe soit chargé
        const recaptchaFrame = await page.waitForSelector('.g-recaptcha iframe');

        // Accédez à l'iframe de reCAPTCHA
        const frame = await recaptchaFrame.contentFrame();

        // Assurez-vous que le frame a été chargé
        if (frame) {
            // Trouvez le sélecteur du bouton reCAPTCHA à l'intérieur de l'iframe
            const recaptchaCheckboxSelector = '#recaptcha-anchor';

            // Cliquez sur le bouton reCAPTCHA
            await frame.click(recaptchaCheckboxSelector);

            await new Promise(resolve => setTimeout(resolve, 1000)); // Attendre 1 seconde

            console.log("Clic sur le bouton reCAPTCHA réussi.");
        }

        const submitLoginSelector = 'span.button.yellow.submit-btn';
        await page.waitForSelector(submitLoginSelector);
        await page.click(submitLoginSelector);
    }

    if (performance) {
        // pour une meilleure performance / gain de temps
        await page.goto("https://untappd.com/search?q="+search+"&type="+filter+"&sort="+sort)
    } else {
        // if/else pour aller dans la page de recherche
        if (login) {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Attendre 5 secondes
            await page.mouse.move(100, 200);

            const searchInputSelector = 'input.track-focus.search-input-desktop.aa-input';
            await page.waitForSelector(searchInputSelector);
            await page.type(searchInputSelector, search);

            // Simulez l'appui sur la touche "Entrée"
            await page.keyboard.press('Enter');
        } else {
            await page.type('form[action="/search"] > div > input', search);

            // Simulez l'appui sur la touche "Entrée"
            await page.keyboard.press('Enter');
        }

        await page.waitForNavigation();

        const consentButtonSelector = 'button.fc-button.fc-cta-consent.fc-primary-button';
        await page.waitForSelector(consentButtonSelector);
        await page.click(consentButtonSelector);

        const filterLinkSelector = 'a[data-filter="'+filter+'"]';
        await page.waitForSelector(filterLinkSelector);
        await page.click(filterLinkSelector);

        // await page.waitForNavigation();

        const selectSelector = '#sort_picker';
        await page.waitForSelector(selectSelector);
        await page.select(selectSelector, sort);
    }

    if (filter === "beer") {
        const imgSrcSelector = '.label > img';
        const nameSelector = '.beer-details > .name';
        const brewerySelector = '.beer-details > .brewery';
        const styleSelector = '.beer-details > .style';
        const abvSelector = '.details.beer > .abv';
        const ibuSelector = '.details.beer > .ibu';
        const ratingSelector = '.details.beer > .rating > .caps';

        await page.waitForSelector(imgSrcSelector);
        await page.waitForSelector(nameSelector);
        await page.waitForSelector(brewerySelector);
        await page.waitForSelector(styleSelector);
        await page.waitForSelector(abvSelector);
        await page.waitForSelector(ibuSelector);
        await page.waitForSelector(ratingSelector);

        const imgSrcElements = await page.$$(imgSrcSelector);
        const nameElements = await page.$$(nameSelector);
        const breweryElements = await page.$$(brewerySelector);
        const styleElements = await page.$$(styleSelector);
        const abvElements = await page.$$(abvSelector);
        const ibuElements = await page.$$(ibuSelector);
        const ratingElements = await page.$$(ratingSelector);

        const beerDetails = [];

        for (let i = 0; i < Math.min(5, imgSrcElements.length, nameElements.length, breweryElements.length, styleElements.length, abvElements.length, ibuElements.length, ratingElements.length); i++) {
            const imgSrc = await imgSrcElements[i].evaluate(img => img.src);
            const name = await nameElements[i].evaluate(el => el.textContent);
            const brewery = await breweryElements[i].evaluate(el => el.textContent);
            const style = await styleElements[i].evaluate(el => el.textContent);
            const abv = (await abvElements[i].evaluate(el => el.textContent)).replaceAll("\n", "");
            const ibu = (await ibuElements[i].evaluate(el => el.textContent)).replaceAll("\n", "");
            const rating = await ratingElements[i].evaluate(el => el.getAttribute('data-rating'));

            beerDetails.push({
                imgSrc,
                name,
                brewery,
                style,
                abv,
                ibu,
                rating,
            });
        }

        console.log(beerDetails);

        const emailStyle = `
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.5; }
                h1 { color: #333; }
                ul { list-style-type: none; padding: 0; }
                li { margin: 10px 0; border: 1px solid #ddd; padding: 10px; border-radius: 4px; }
                strong { color: #000; }
                em { color: #666; font-style: normal; }
                .beer-details { background: #f6f6f6; border-left: 5px solid #ccc; margin: 10px 0; padding: 10px; }
                .beer-name { color: #333; font-size: 16px; font-weight: bold; }
                .beer-style { color: #666; }
                .beer-info { color: #000; }
                img { width: 50px; height: 50px; object-fit: cover; }
            </style>
        `;

        const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Liste des Bières</title>
    ${emailStyle}
    </head>
    <body>
        <h1>Recherche pour : ${search}</h1>
        <h1>Liste des Bières</h1>
        <ul>
            ${beerDetails.map(beer => `
                <li class="beer-details">
                    <img src="${beer.imgSrc}" alt="${beer.name} label" />
                    <div class="beer-info">
                        <div class="beer-name">${beer.name}</div>
                        <div class="beer-style">${beer.style0} dans ${beer.style1}</div>
                        <div>ABV: ${beer.abv}</div>
                        <div>IBU: ${beer.ibu}</div>
                        <div>Note: ${beer.rating}</div>
                    </div>
                </li>
            `).join('')}
        </ul>
    </body>
    </html>
`;

        await sendEmail(email, 'Liste des Bières', htmlContent);

    } else if (filter === "brewery") {
        const imgSrcSelector = '.label > img';
        const nameSelector = '.beer-details > .name';
        const styleSelector = '.beer-details > .style';
        const abvSelector = '.details.brewery > .abv';
        const ibuSelector = '.details.brewery > .ibu';
        const ratingSelector = '.details.brewery > .rating > .caps';

        await page.waitForSelector(imgSrcSelector);
        await page.waitForSelector(nameSelector);
        await page.waitForSelector(styleSelector);
        await page.waitForSelector(abvSelector);
        await page.waitForSelector(ibuSelector);
        await page.waitForSelector(ratingSelector);

        const imgSrcElements = await page.$$(imgSrcSelector);
        const nameElements = await page.$$(nameSelector);
        const styleElements = await page.$$(styleSelector);
        const abvElements = await page.$$(abvSelector);
        const ibuElements = await page.$$(ibuSelector);
        const ratingElements = await page.$$(ratingSelector);

        const beerDetails = [];

        for (let i = 0; i < Math.min(5, imgSrcElements.length, nameElements.length, styleElements.length, abvElements.length, ibuElements.length, ratingElements.length); i++) {
            const imgSrc = await imgSrcElements[i].evaluate(img => img.src);
            const name = await nameElements[i].evaluate(el => el.textContent);
            const styles = await Promise.all(
                styleElements.map(element => element.evaluate(el => el.textContent.trim()))
            );
            const style0 = styles[0];
            const style1 = styles[1];
            const abv = (await abvElements[i].evaluate(el => el.textContent)).replaceAll("\n", "");
            const ibu = (await ibuElements[i].evaluate(el => el.textContent)).replaceAll("\n", "");
            const rating = await ratingElements[i].evaluate(el => el.getAttribute('data-rating'));

            beerDetails.push({
                imgSrc,
                name,
                style0,
                style1,
                abv,
                ibu,
                rating,
            });
        }

        const htmlContent = `
            <h1>Liste des Bières</h1>
            <ul>
                ${beerDetails.map(beer => `
                    <li>
                        <img src="${beer.imgSrc}" alt="${beer.name} label" style="width:50px; height:50px;" />
                        <strong>${beer.name}</strong> aux <em>${beer.style0}</em> dans ${beer.style1}
                        <br />
                        ABV: ${beer.abv}, IBU: ${beer.ibu}, Note: ${beer.rating}
                    </li>
                `).join('')}
            </ul>
        `;

        await sendEmail(email, 'Liste des Bières', htmlContent);

    } else if (filter === "venues") {
        const imgSrcSelector = '.label > img';
        const nameSelector = '.venue-details > .name';
        const styleSelector = '.venue-details > .style';

        await page.waitForSelector(imgSrcSelector);
        await page.waitForSelector(nameSelector);
        await page.waitForSelector(styleSelector);

        const imgSrcElements = await page.$$(imgSrcSelector);
        const nameElements = await page.$$(nameSelector);
        const styleElements = await page.$$(styleSelector);

        const beerDetails = [];

        for (let i = 0; i < Math.min(5, imgSrcElements.length, nameElements.length, styleElements.length); i++) {
            const imgSrc = await imgSrcElements[i].evaluate(img => img.src);
            const name = await nameElements[i].evaluate(el => el.textContent);
            const styles = await Promise.all(
                styleElements.map(element => element.evaluate(el => el.textContent.trim()))
            );
            const style0 = styles[0];
            const style1 = styles[1];

            beerDetails.push({
                imgSrc,
                name,
                style0,
                style1,
            });
        }

        const htmlContent = `
            <h1>Liste des Bières</h1>
            <ul>
                ${beerDetails.map(beer => `
                    <li>
                        <img src="${beer.imgSrc}" alt="${beer.name} label" style="width:50px; height:50px;" />
                        <strong>${beer.name}</strong> à <em>${beer.style0}</em> - ${beer.style1}
                    </li>
                `).join('')}
            </ul>
        `;

        await sendEmail(email, 'Liste des Bières', htmlContent);

    }

    // Gardez le navigateur ouvert pour observer
    await new Promise(resolve => setTimeout(resolve, 5000)); // Attendre 5 secondes

    await browser.close();
}