import Tesseract from "tesseract.js";


/**
 * A function which uses Tesseract to try and extract the total cost from a receipt.
 *
 * @param img An image encoded in any format Tesseract accepts.
 * @returns {Promise<number>}
 */
export async function detectCost(img) {
    // TODO detect currency
    const worker = await Tesseract.createWorker();

    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    await worker.setParameters({
        PSM_SPARSE_TEXT_OSD: 1,
        min_characters_to_try: 10
    })

    const {data} = await worker.recognize(img);
    const text = data.text
    await worker.terminate()
    return extractCost(text)
}


function extractCost(text) {
    // This is by no means a solid algorithm, but it should get the job done in
    // like 70% of cases

    const summeReg = /SUMME(?:\s.*)?\s([1-9][0-9]*,[0-9]{2})[^0-9.,]/gmi
    const summeResult = Array.from(text.matchAll(summeReg))
    if (summeResult.length > 0) {
        if (summeResult > 1) {
            console.warn("Found more than one possible total line for receipt.")
        }
        return parseFloat(summeResult[0][1].replace(",", "."))
    }


    const totalReg = /TOTAL(?:\s.*)?\s([1-9][0-9]*\.[0-9]{2})[^0-9.,]/gmi
    const totalResult = Array.from(text.matchAll(totalReg))
    if (totalResult.length > 0) {
        if (totalResult > 1) {
            console.warn("Found more than one possible total line for receipt.")
        }
        return parseFloat(totalResult[0][1].replace(",", "."))
    }


    const numbersDotReg = /([1-9][0-9]*\.[0-9]{2})[^0-9.,]/gmi
    const numbersDotResult = Array.from(text.matchAll(numbersDotReg))
        .map(it => parseFloat(it[1].replace(",", ".")))

    const numbersCommaReg = /([1-9][0-9]*,[0-9]{2})[^0-9.,]/gmi
    const numbersCommaResult = Array.from(text.matchAll(numbersCommaReg))
        .map(it => parseFloat(it[1].replace(",", ".")))

    if (numbersCommaResult.length === 0 && numbersDotResult.length === 0) {
        return undefined
    }

    if (numbersCommaResult.length > numbersDotResult.length) {
        return Math.max(...numbersCommaResult)
    } else if (numbersDotResult.length > numbersCommaResult.length) {
        return Math.max(...numbersDotResult)
    } else {
        return Math.min(...numbersDotResult, ...numbersCommaResult)
    }
}