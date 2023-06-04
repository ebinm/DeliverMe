import {useState} from "react";
import BuyerChooseShopView from "./BuyerChooseShop/BuyerChooseShopView";
import {Route, Routes, useNavigate} from "react-router-dom";
import {BuyerChooseItems} from "./BuyerChooseItems/BuyerChooseItems";
import {BuyerOrderSummary} from "./BuyerOrderSummary/BuyerOrderSummary";
import {Login} from "../authentication/Login";
import {useCacheLocalStorageForCustomer} from "../../util/hooks";


export function BuyerOrderCreationView() {

    const navigate = useNavigate()

    // TODO cache
    // TODO pull sate maangemetn from shop selection view to this view
    const [selectedShop, setSelectedShop] = useState(null);


    const [from, setFrom] = useCacheLocalStorageForCustomer("from-cache", null)
    const [to, setTo] = useCacheLocalStorageForCustomer("to-cache", null)
    const [notes, setNotes] = useCacheLocalStorageForCustomer("notes-cache", "")
    const [items, setItems] = useCacheLocalStorageForCustomer("items-cache", [], it => !!it?.length)


    return <Routes>
        <Route index={true} path={"/"} element={
            <BuyerChooseShopView onSubmitShop={(shop) => {
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
            <BuyerOrderSummary items={items} to={to} from={from} notes={notes} shop={selectedShop}/>
        }/>


    </Routes>
}