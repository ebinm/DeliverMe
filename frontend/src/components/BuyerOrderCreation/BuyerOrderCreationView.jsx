import {BuyerChooseShopView} from "./BuyerChooseShop/BuyerChooseShopView";
import {Route, Routes, useNavigate} from "react-router-dom";
import {BuyerChooseItems} from "./BuyerChooseItems/BuyerChooseItems";
import {BuyerOrderSummary} from "./BuyerOrderSummary/BuyerOrderSummary";
import {useCacheLocalStorageForCustomer} from "../../util/hooks";


export function BuyerOrderCreationView() {

    const navigate = useNavigate()

    // TODO cache
    // TODO pull state management from shop selection view to this view
    const [selectedShop, setSelectedShop, clearShop] = useCacheLocalStorageForCustomer("shop-cache", null);


    const [from, setFrom, clearFrom] = useCacheLocalStorageForCustomer("from-cache", null)
    const [to, setTo, clearTo] = useCacheLocalStorageForCustomer("to-cache", null)
    const [notes, setNotes, clearNotes] = useCacheLocalStorageForCustomer("notes-cache", "")
    const [items, setItems, clearItems] = useCacheLocalStorageForCustomer("items-cache", [], it => !!it?.length)


    return <Routes>
        <Route index={true} path={"/"} element={
            <BuyerChooseShopView setSelectedShop={setSelectedShop} selectedShop={selectedShop} onSubmitShop={(shop) => {
                setSelectedShop(shop)
                navigate("./items")
            }}/>
        }/>

        <Route path={"/items"} element={
            <BuyerChooseItems shop={selectedShop} onGoBack={() => navigate("./")}
                              from={from} setFrom={setFrom} to={to} setTo={setTo} notes={notes} setNotes={setNotes}
                              items={items} setItems={setItems} onSubmit={() => navigate("./summary")}/>
        }/>

        <Route path={"/summary"} element={
            <BuyerOrderSummary onGoBack={() => navigate("./items")} items={items} to={to} from={from} notes={notes}
                               shop={selectedShop} onSubmit={() => {
                clearFrom()
                clearTo()
                clearNotes()
                clearItems()
                clearShop()
            }}/>
        }/>


    </Routes>
}