import React, {useEffect, useMemo, useState} from "react";
import {MenuItem, Select, TextField} from "@mui/material";
import Stack from "@mui/material/Stack";


export function CurrencyInput({amount, setAmount, currency, setCurrency, sx, label, fullWidth= true, textFieldInputProps }) {
    const [inputting, setInputting] = useState(false)

    const numberFormatter = useMemo(() => new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currency,
        maximumFractionDigits: 2
    }), [currency])

    useEffect(() => {
        if (!inputting) {
            setDisplayedAmount(numberFormatter.format(amount))
        }
    }, [inputting, numberFormatter, amount])

    const [displayedAmount, setDisplayedAmount] = useState(numberFormatter.format(0))


    return <Stack direction={"row"} sx={sx}>
        <TextField
            fullWidth={fullWidth}
            required={true}
            label={label}
            id={"total-amount-spent-input"}
            value={displayedAmount === 0 ? "" : displayedAmount}
            inputProps={{
                "step": "0.01",
                "min": "0.0"
            }}
            InputProps={textFieldInputProps}

            onFocus={() => {
                setInputting(true)
                // Moving this to useEffect causes problems in the update order
                setDisplayedAmount(amount)
            }}
            onBlur={() => {
                setInputting(false)
            }}
            onChange={(e) => {
                setDisplayedAmount(e.target.value)
                let x = parseFloat(e.target.value)
                if (Number.isNaN(x)) {
                    x = 0
                }

                e.target.setCustomValidity(x === 0 ? "The cost should not be 0." : "")
                setAmount(x)
            }}
            type={inputting ? "number" : "text"}
                />
        <Select
            value={currency}
            label={"Currency"}
            id={"total-amount-spent-currency-input"}
            onChange={e => setCurrency(e.target.value)}
        >
            <MenuItem value={"EUR"}>€</MenuItem>
            <MenuItem value={"USD"}>$</MenuItem>
        </Select>
    </Stack>
}