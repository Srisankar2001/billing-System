import React, { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import PrintBill from "./printBill";

function CaptureBill({ bill, data }) {
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
        documentTitle: `Bill_${bill.id}`,
        removeAfterPrint : true
    });

    return (
        <>
            <div ref={contentToPrint}>
                <PrintBill bill={bill} data={data} />
            </div>
            <button onClick={handlePrint}>PRINT</button>
        </>
    );
}

export default CaptureBill;

